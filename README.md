# `@ai-crew-suite/infra`

Centralized infrastructure-as-code, deployment charts, deterministic local development stacks, and regulatory-compliant mock ecosystems for the AI Crew Suite platform.

## Overview

This repository serves as the single source of truth for the provisioning, deployment, and simulation of the AI Crew Suite architecture across all environments. It isolates our cloud topology definitions, orchestration layers, and testing sandboxes from application codebases, enabling robust GitOps delivery models and frictionless local execution.

## Usage

```bash
{
  "scripts": {
    "infra:up": "docker compose -f ../foundry/packages/containers/docker-compose.yml up -d",
    "infra:down": "docker compose -f ../foundry/packages/containers/docker-compose.yml down"
  }
}
```

In your agents, platform, and drivers repositories, link the local dev infrastructure folder as a tracking submodule:bash# Run this inside your app repositories to mount the local runner utilities:

```bash
git submodule add -b main https://github.com internal/infra
```

This mounts the infrastructure files right inside a nested internal/infra/ folder. You can then write a clean, standardized command script inside each application repo's package.json:

```json
// Application Monorepos (agents, platform, drivers) - package.json
{
  "scripts": {
    "infra:up": "docker compose -f internal/infra/local-dev/docker-compose.yml up -d",
    "infra:down": "docker compose -f internal/infra/local-dev/docker-compose.yml down"
  }
}
```

Use Yarn Catalogs (catalog:prod) to pull driver modules and core loops into separate server setups easily:

```typescript
import { createBackend } from '@backstage/backend-defaults';
import { catalogModuleCreatePod } from '@ai-crew-suite/platform'; // Your core system
import { pagerDutyDriverModule } from '@ai-crew-suite/drivers';   // Your integrated tools

const backend = createBackend();

backend.add(catalogModuleCreatePod());
backend.add(pagerDutyDriverModule());

backend.start();
```
