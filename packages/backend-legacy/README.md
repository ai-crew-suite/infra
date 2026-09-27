# `@ai-crew-suite/backend-legacy`

🏛️ Traditional Express-based backend integration test bench and backward-compatibility playground for the AI Crew Suite platform.

## Overview

This workspace package provides an isolated, deterministic execution environment for the traditional, legacy Backstage backend architecture. It serves as our primary compatibility engine, ensuring that custom plugins, data transformers, and core agent orchestration interfaces function smoothly under traditional Express middleware loops, route builders, and legacy dependency patterns before being deployed to the platform.

## Core Responsibilities

- **Express Router Orchestration**: Manages the manual configuration, mounting, and execution of Express routers across core plugin environments.
- **Backward-Compatibility Safeguards**: Mimics the traditional environment assembly tree to verify that custom drivers don't break for consumers relying on standard Backstage runtimes.
- **Environment Service Injection**: Explicitly maps and injects foundational service singletons—such as Winston logging streams, `DatabaseManager` pools, and cache providers—directly down into separate route endpoints.

## Architectural Dependency Tree

This test bench bridges the gap between old-school runtime layouts and our modern monorepo configurations:

- **Upstream Engine**: Built directly on top of the traditional `@backstage/backend-common` routing utilities and the CommonJS module resolution format.
- **Downstream Consumers**: Used exclusively by internal validation pipelines and automated Playwright E2E tracks to execute backward-compatibility checks.
- **Boundary Rule**: Always operate inside the legacy CommonJS parameters (`module: "CommonJS"`). Do not import modern, DI-only structural plugins (`createBackendModule`) into this workspace zone.

## Local Development Workflow

### Installation & Workspace Compilation

Compile the legacy TypeScript source trees and output production definitions directly from the monorepo root:

```bash
yarn install --refresh
yarn build:legacy
```

### Running the Legacy Test Bench Server

To start the legacy server engine locally and watch for active file changes, execute:

```bash
yarn start:legacy
```

## Consumer Integration Checklist

To add an explicit sub-route or initialize a traditional core plugin inside this test bench, integrate the constructor loops under the plugin factory architecture:

### Mount Sub-Router Middleware

Create or append your service connector file under `src/plugins/` and wire it into the main execution lifecycle loops:

```typescript
// packages/backend-legacy/src/plugins/custom-driver.ts
import { createRouter as createCustomRouter } from '@ai-crew-suite/drivers';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
  
export async function createRouter(env: PluginEnvironment): Promise<Router> {
  return await createCustomRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
  });
}
```

### Legacy Plugin Routing Matrix

Ensure all manual components conform to these core configuration boundaries:

- **`src/index.ts`**: The central system bootloader. Orchestrates configuration reading, creates connection environments, and exposes `/api/*` endpoints.
- **`src/types.ts`**: Captures and enforces structural type safety for `PluginEnvironment` singletons injected down to sub-routers.
- **`src/plugins/`**: Isolated route mounting scripts dedicated to core modules (Catalog, Scaffolder, TechDocs, Proxy) and your integrated agent workflows.

## Compliance and Licensing

Copyright © 2026 The AI Crew Suite Authors.
Licensed under the **Apache License, Version 2.0**.
