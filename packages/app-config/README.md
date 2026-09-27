# `@ai-crew-suite/app-config`

Centralized configuration registry and multi-profile schema definitions for the AI Crew Suite platform.

## Overview

This workspace package serves as the single source of truth for all runtime property layouts, database clusters, and integration layers across the infrastructure repository. By isolating environment parameters into a dedicated package, it prevents configuration drift and allows both legacy and modern testing servers to evaluate identical configurations natively.

## Core Responsibilities

* **Topology Consolidation**: Establishes immutable infrastructure connection endpoints, route namespaces, and security contexts across platform segments.
* **Environment Layering**: Manages the strict division between fallback baseline controls (`app-config.ci.yaml`) and localized isolated testing overrides (`app-config.local.yaml`).
* **Supply Chain Sanitization**: Encapsulates external connection schemas using standard environment variable syntax maps (`${DB_HOST}`, `${GITHUB_TOKEN}`), ensuring no secrets or unencrypted credentials leak into source control.

## Architectural Dependency Tree

This configuration block governs the operational metadata maps for the active backend testing test benches:

* **Upstream Drivers**: Dictated by the native Backstage config system schema formats.
* **Downstream Consumers**: Natively pulled into `@ai-crew-suite/backend-legacy` and `@ai-crew-suite/backend-modern` execution threads using declarative CLI property overrides.
* **Boundary Rule**: This package contains exclusively configuration sheets and metadata files. It contains no runtime compiled JavaScript logic or native Node engines.

## Local Development Workflow

### Installation & Integrity Validation

Because this workspace contains static text configurations, it requires no localized TypeScript compilation. To check that the package paths map into the global workspace index successfully, execute the install script from the monorepo root:

```bash
yarn install --refresh
```

### Validating Configuration Schemes

To verify that modifications to your layout parameters strictly pass standard Backstage schema parsing constraints, invoke a test execution dry-run via either backend test bench:

```bash
yarn workspace @ai-crew-suite/backend-modern run start
```

## Consumer Usage Checklist

To apply these parameters cleanly to a server instance workspace, layer the configuration arguments within the startup command array:

### Base Invariant File Injection

```json
// package.json script snippet configuration
"scripts": {
  "start": "backstage-cli package start --config ../app-config/app-config.ci.yaml --config ../app-config/app-config.local.yaml"
}
```

### Configuration Hierarchy Matrix

Ensure your configuration architecture properties conform to these distinct boundaries:

* [ ] **`app-config.ci.yaml`**: Non-sensitive baseline blueprints common across all deployments. Uses template hooks to pull parameters from environment variables at runtime.
* [ ] **`app-config.local.yaml`**: Local workstation development overrides. Routes traffic to your local `pgvector` container pool, shifts driver APIs to WireMock (`http://localhost:8080`), and forces TechDocs to render from local disk assets.

## Compliance and Licensing

Copyright © 2026 The AI Crew Suite Authors.
Licensed under the **Apache License, Version 2.0**.
