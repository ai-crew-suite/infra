# AI Crew Suite — Infrastructure Control Plane (`infra`)

Centralized Infrastructure-as-Code (IaC), deployment charts, deterministic local development runtimes, and regulatory-compliant mock ecosystems for the AI Crew Suite platform.

## 📋 Overview

This repository serves as the single source of truth for the provisioning, deployment, and high-fidelity simulation of the AI Crew Suite architecture across all development and production environments. It isolates our cloud topology definitions, orchestration layers, and testing sandboxes from individual application codebases, enabling robust GitOps delivery models and frictionless local execution.

## 📂 Repository Topology

The repository is structured as a unified Yarn Workspace monorepo, enforcing strict domain isolation and operational consistency:

```text
ai-crew-suite/infra/
├── .yarnrc.yml                          # Optimized local Yarn 4 version catalog governance
├── turbo.json                           # Centralized Turborepo pipeline caching rules
├── packages/
│   ├── app-config/                      # Central configuration templates & development overrides
│   ├── backend-legacy/                  # Express-based integration test bench (CommonJS)
│   ├── backend-modern/                  # Modern dependency-injection test bench (ES Modules)
│   ├── containers/                      # Local Docker Compose network (Postgres + pgvector, Redis, WireMock)
│   ├── deploy-kubernetes/               # High-availability production Helm charts (Backstage + Workers)
│   ├── deploy-terraform/                # Managed AWS Cloud Topologies (VPC, ECR, RDS, ElastiCache)
│   ├── mock-data/                       # Static Backstage catalog entities & pre-compiled TechDocs assets
│   └── mock-service/                    # In-memory browser network traffic interceptor (MSW)
```

## 🚀 Local Development Quickstart

### 1. Initialize the Monorepo Workspace
Ensure you have [Yarn 4+](https://yarnpkg.com) installed. Link the workspace packages and download required development tools:
```bash
yarn install
```

### 2. Stand Up the Local Container Network
Spin up the offline data layer, configure the `pgvector` schemas, and launch the third-party proxy interceptors:
```bash
yarn infra:up
```
*This command starts PostgreSQL on host port `5433` (to prevent conflicts with native workstation databases), maps your long-term agent memory tables (Mem0), and starts WireMock on port `8080`.*

### 3. Run the Backend Test Benches
Verify code compilation, type safety, and configuration routing across both system variants simultaneously:
```bash
yarn compile           # Compiles all TypeScript packages via Turborepo
yarn start:modern      # Launches the Modern DI Backstage testing instance
yarn start:legacy      # Launches the Traditional Express Backstage testing instance
```

---

## 📡 Cross-Repository Syndication (Git Submodule Ingestion)

To give other application repositories (`agents`, `platform`, `drivers`) immediate access to these local running utilities, mount this infrastructure repository as an tracking submodule inside your application root directories:

```bash
# Execute this inside your application codebeds to mount the runner utilities:
git submodule add -b main https://github.com internal/infra
```

Once mounted, write a standardized, cross-platform shortcut script inside the application repo's `package.json` to allow developers to spin up the container network seamlessly from their local environments:

```json
{
  "name": "@ai-crew-suite/agents",
  "scripts": {
    "infra:up": "yarn --cwd internal/infra infra:up",
    "infra:down": "yarn --cwd internal/infra infra:down",
    "infra:logs": "yarn --cwd internal/infra infra:logs"
  }
}
```

## 🔌 Advanced Usage: Yarn Catalog Plugin Injection

Both the legacy and modern servers consume configurations layered natively from `packages/app-config/`. This allows you to pull compiled workspace tool modules and core system loops from other repositories and mount them directly into your testing servers:

```typescript
import { createBackend } from '@backstage/backend-defaults';
import { catalogModuleCreatePod } from '@ai-crew-suite/platform'; // Your core workflow system
import { pagerDutyDriverModule } from '@ai-crew-suite/drivers';   // Your integrated driver tools

const backend = createBackend();

// Inject modules smoothly using native dependency injection
backend.add(catalogModuleCreatePod());
backend.add(pagerDutyDriverModule());

backend.start();
```

## 🛡️ Verification & Compliance Standards

Every package workspace inside this repository implements standardized verification tasks to pass quality gates before code promotion steps:

```bash
yarn lint         # Evaluates codebase formatting via Prettier and lint rules via eslint.config.ts
yarn tf:validate  # Verifies HashiCorp infrastructure layouts are syntactically valid
yarn helm:lint    # Audits Kubernetes Helm charts against production schema configurations
yarn image:build  # Compiles a hardened, multi-stage production Docker image securely
```

## ⚖️ Compliance and Licensing

Copyright © 2026 The AI Crew Suite Authors.
Licensed under the **Apache License, Version 2.0**.
