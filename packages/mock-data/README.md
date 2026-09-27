# `@ai-crew-suite/mock-data`

💾 High-fidelity static data fixtures, catalog entities, and pre-compiled TechDocs documentation layers for the AI Crew Suite platform.

## Overview

This workspace package serves as the primary data simulation matrix for the infrastructure repository. It holds the high-fidelity mock environments, software components, documentation pages, and search index configurations used to simulate a complete enterprise cloud ecosystem. By isolating these definitions into a dedicated, uniform package, it gives both our legacy and modern backend test benches instant access to realistic datasets without executing expensive network API requests or querying public cloud systems.

## Core Responsibilities

- **Ecosystem Simulation**: Provisions high-fidelity mock files representing an integrated workspace containing **Domains**, **Systems**, **Components**, and **Locations**.
- **Documentation Isolation**: Hosts pre-compiled HTML documentation fragments matching the exact visual specs of Backstage's local TechDocs publisher engine.
- **Hermetic Test Grounding**: Serves as the immutable file asset target for browser simulation sweeps, preventing pipeline execution blocks from breaking due to upstream cloud API limits.

## Architectural Dependency Tree

This asset data package populates the user interface layers across your active testing servers:

- **Upstream Ingestion**: Read directly off the disk by the Backstage core catalog file-poller engine via declarative location pointers.
- **Downstream Consumers**: Natively rendered by `@ai-crew-suite/backend-legacy` and `@ai-crew-suite/backend-modern` whenever a browser requests dashboard layouts.
- **Boundary Rule**: This package is structured strictly as a static data warehouse. Do not mix active compiled Node logic, server middleware scripts, or cloud credential tokens into this asset directory space.

## Local Development Workflow

Workspace Installation & Code Consistency

This package follows our strict repository requirement for absolute folder consistency, allowing it to register natively as an official Node workspace. To link its local Prettier formatting engine dependencies, execute from the repository root:


```bash
yarn install
```

### Executing Static Data Lint Sweeps

To check that your data documents, catalog entities, and raw HTML runbook fragments strictly pass standard syntax formatting guidelines, run the workspace linter task:

```bash
yarn workspace @ai-crew-suite/mock-data run lint
```

### Automated Code Style Fixing

To automatically fix formatting errors, trailing spaces, or indentation variations inside your mock assets instantly, run:

```bash
yarn workspace @ai-crew-suite/mock-data run lint:fix
```

## Consumer Data Checklist

To extend the catalog or trace custom visual components inside your test bench suites, integrate your files using standard Backstage schema patterns:

### Register a Mock Software Entity

Append your target component block directly into the catalog file to instantly generate new software architecture nodes inside the portal UI:

```yaml
# packages/mock-data/catalog-fixtures.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: dynamic-agent-worker
  description: Simulates an autonomous workflow worker agent processing episodic context vectors.
spec:
  type: service
  lifecycle: production
  owner: platform-team
  system: crew-suite
```

## Static Data Component Matrix

Verify that your asset data structures match these expected structural boundaries:

- **`catalog-fixtures.yaml`**: The primary data file organizing systems, components, and ingestion loop pointers to simulate our multi-repo platform layout.
- **`techdocs/default/component/`**: Pre-built entity documentation directories housing isolated HTML pages and runbooks.
- **`techdocs/\**/search_index.json`**: Static pre-compiled document maps protecting localized UI search boxes from throwing lookup failures.
- **`package.json`**: The workspace descriptor file implementing Prettier verification scripts to maintain code style parity with your other packages.

## Compliance and Licensing

Copyright © 2026 The AI Crew Suite Authors.
Licensed under the **Apache License, Version 2.0**.