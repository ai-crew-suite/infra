## Workbench Dev and Test Server SDK

## Direct Architectural Comparison of Dockerfiles

The "why?" is this:

> When an automated runner executes a check strictly on a pull request modifying code inside `backend-modern`, it doesn't want to spend time processing or pulling compute nodes for Kubernetes charts or Terraform IaC configs.
>
> As we saw during your compilation errors, because Yarn 4 locks down your *entire repository* cryptographically via a single root `yarn.lock` file, this Dockerfile is architected as a heavy multi-stage pipeline. It deliberately pulls in the templates for **all 8 directories** under `/packages` so that the workspace installation doesn't flag a tampering violation.

We can probably get rid of the `backend-legacy` and `backend-modern` Dockerfiles, and improve them in the `containers` directory with individual Dockerfiles for each platform.

| Attribute            | Folder-Level Dockerfiles (`packages/backend-*/Dockerfile`)   | Container Directory Dockerfile (`packages/containers/backstage-node22.Dockerfile`) |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Primary Scope**    | **Micro-Context Isolation**. Compiles *only* that specific backend server target. | **Macro-Context Monorepo Orchestration**. Compiles the entire topological workspace project tree at once. |
| **Yarn 4 Behavior**  | Breaks strict `--immutable` if used alone, because Yarn cannot see the surrounding workspace graph paths. | Fully supports `--immutable` because it explicitly copies every package descriptor skeleton to satisfy the global lockfile. |
| **Primary Use Case** | Fast CI unit verification, lint passes, or isolated sub-package test runs. | Production-grade deployment imagery (ECR/Helm inputs) and full system E2E testing loops. |
| **Build Context**    | Targeted directly at the subpath folder root.                | Targeted strictly at the monorepo root repository directory (`.`). |

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

### How Developers Invoke the External Track

*We added an env var to inject additional catalog fixture files.*

Now, an external plugin developer or internal engineer can link any loose file sitting anywhere on their local computer directly into your active workbench.

They don't have to touch a single line of your code repositories; they simply export the path in their active terminal session before booting your test benches:

```bash
# 1. Point the variable straight to any file on their local workstation disk
export EXTRA_MOCK_LOCATION="/home/kevin/Desktop/custom-agent-info.yaml"

# 2. Fire up the modern dependency-injection server bench
yarn start:modern
```

## Config-Driven Composition for Dev/Test Server Consumers

Instead of treating our `backend-modern` or `backend-legacy` servers as hardcoded, rigid applications, we need to view them as **plug-and-play runtimes**. Developers (internal or third-party) should be able to configure them purely via declarative layer configs or dependency injection hooks. The infrastructure server acts as a blank canvas shell, and the external repository injects the specific frontend/backend plugins it wants to test at runtime.

## Syndication Mechanics

To support  **internal and third-party open-source developers** cleanly, we can package our infrastructure assets in two distinct ways:

- **The Container Image SDK**: We can publish the pre-compiled multi-stage container images we just engineered out to a public or private container registry. A third-party developer can spin up our entire environment footprint simply by pulling our base images into their local `docker-compose.yml` file, passing their custom plugin paths as mounted code volumes.
- **The Node Package Utility**: We can distribute our foundational parameters, typescript compilation defaults, and MSW mock engines as standard npm workspace library dependencies. A developer simply runs `yarn add @ai-crew-suite/infra-test-kit` inside their own repository to instantly ingest our configuration shapes, lint criteria, and mocking servers.

### Dynamic Dependency Discovery

To make this frictionless, the infrastructure test bench shouldn't require manual `import` statements for every new plugin.

Instead, the system should feature an **Automated Ingestion Scanner**. When the server boots up, it looks at the user's custom configuration file or scans specific local directory boundaries. If it discovers a third-party backend plugin package sitting in the filesystem path, it automatically passes it to Backstage's modern dependency injection manager behind the scenes. The server scales its capabilities automatically based purely on what files are physically present in the developer's workspace.

## Mocking a Git Repo

While `catalog-info.yaml` is the only file required to satisfy Backstage's **Software Catalog Ingestion** system, a true enterprise-grade repository mock requires simulating **three distinct lifecycle layers**:

```
┌────────────────────────────────────────────────────────────────────────┐
│             Enterprise-Grade Code Repository Emulation Matrix          │
├───────────────────┬────────────────────────────────────────────────────┤
│ 1. Metadata Layer │ catalog-info.yaml (Registers entities & graphs)    │
├───────────────────┼────────────────────────────────────────────────────┤
│ 2. Content Layer  │ mkdocs.yml + docs/*.md (Simulates TechDocs trees)  │
├───────────────────┼────────────────────────────────────────────────────┤
│ 3. API Layer      │ WireMock JSON or MSW rules (Simulates webhooks &   │
│                   │ repository API payload structures)                 │
└───────────────────┴────────────────────────────────────────────────────┘
```

If a third-party developer is testing an advanced automation loop—such as a Scaffolder Template that performs a `publish:github` operation to physically push newly generated code out to a repository—the local Backstage server will attempt to hit GitHub’s HTTP REST API endpoints (`://github.com*`).

To completely simulate this action offline without errors, you expand your mock plane to capture that traffic. You add a WireMock rule that catches the outbound webhook request, saves the generated code zip payload to an internal directory, and returns a fake `201 Created` codebed payload. This provides a complete repository simulation without a single line of Git metadata required on your workstation disk.

### Detail

To inject a high-fidelity **mock Git repository infrastructure** directly into your `workbench` server setup without talking to external cloud servers like GitHub, you utilize Backstage’s native **`file` location protocol** layered directly over a relative data folder.

Because your local Backstage server runs inside a strict network sandbox (`backend.reading.allow.host`), it has full capability to crawl, read, and interpret directories on your local disk as if they were remote, hosted Git code repositories.

Here is exactly how that mock layout functions and how it connects to your active files:

#### 📁 1. The Directory Strategy

Instead of cloning or querying a live repository URL over HTTPS, you create a static tracking area inside your data package. You create a folder named **`packages/mock-fixtures/mock-git-repos/`**.

Inside that folder, you mimic a real Git repository's filesystem layout. For example, if a third-party developer or an internal team has an autonomous plugin pair named `dynamic-agent`, you drop their raw catalog file right into that directory:

`packages/mock-fixtures/mock-git-repos/dynamic-agent-repo/catalog-info.yaml`

#### 🎛️ 2. The Configuration Ingestion Hook

To instruct your legacy or modern server to treat this local directory as a secure, discovered repository endpoint, you map it directly inside your local development profile overrides.

Inside your **`packages/app-config/app-config.local.yaml`** file, under the `catalog.locations` block, you declare a `file` type target pointing to that specific location:

```yaml
# packages/app-config/app-config.local.yaml
catalog:
  locations:
    # 1. Standard monolithic fixtures file we built earlier
    - type: file
      target: ../../mock-fixtures/catalog-fixtures.yaml

    # 2. 🎯 THE MOCK GIT REPO INJECTION: 
    # Bypasses the public GitHub API entirely by treating this relative local folder
    # as a fully synchronized code repository target.
    - type: file
      target: ../../mock-fixtures/mock-git-repos/dynamic-agent-repo/catalog-info.yaml
```

1. **Simulates Upstream Version Control Changes Natively:** Backstage treats the `file` protocol exactly like a live repository scanner. It opens a background file-system event watcher thread. If you modify a component property, title, or label inside `dynamic-agent-repo/catalog-info.yaml`, the local processing engine intercepts the change instantly and hot-refreshes your user interface—simulating a live Git web-hook action without any network activity.
2. **Solves the Multi-Repo Developer Loop Frictionless:** A third-party developer doesn't need to commit their code or push it to an actual GitHub branch to see if it works with your setup. They can simply create a symbolic link (`ln -s`) from their isolated workspace repository directory straight into your `packages/mock-fixtures/mock-git-repos/` folder. Your infrastructure stack immediately consumes it as an independent repository block, completely isolating their code mutations from your core workspace codebed.
3. **Perfect Playwright Isolation:** During automated quality tracks, your E2E pipelines can spin up the server, mutate the mock repository file programmatically to simulate an automated version release, and check that the frontend reflects the deployment updates deterministically.

## How a third-party developer registers their custom plugin pair

Save this file as **`packages/mock-fixtures/mock-git-repos/dynamic-agent-repo/catalog-info.yaml`**. It uses standard Backstage entity schemas to declare a backend engine, a frontend interface, and an integration system boundary—establishing full traceability in your architecture graph without requiring actual network connections.

### 💾 The Component Pair Template: `.../dynamic-agent-repo/catalog-info.yaml`

```yaml
# ============================================================================
# 🤖 THIRD-PARTY DEVELOPER CODE REPOSITORY COMPONENT PAIR (MOCK GIT EMULATION)
# Frameworks: SOC 2 Type II System Isolation | Decoupled Integration Testing
# ============================================================================
apiVersion: backstage.io/v1alpha1
kind: System
metadata:
  name: dynamic-agent-system
  description: An isolated subsystem encapsulating custom third-party agentic workflows and telemetry panels.
spec:
  owner: external-developer-group
  domain: agentic-capabilities # 🔌 Hooks automatically back into your infra core domain!

---
# 🧠 1. THE BACKEND PLUGIN MANIFEST
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: dynamic-agent-backend
  description: Asynchronous Node/Python service processing custom prompt weights and execution tracks.
  annotations:
    # Simulates localized repository document hosting natively
    backstage.io/techdocs-ref: dir:.
spec:
  type: backstage-plugin-backend
  lifecycle: experimental
  owner: external-developer-group
  system: dynamic-agent-system
  dependsOn:
    - component:infra/platform # 🎯 Explicit boundary dependency pointing to your core runtime!

---
# 💻 2. THE FRONTEND PLUGIN MANIFEST
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: dynamic-agent-frontend
  description: User interface cards, charts, and control forms rendering agent metrics inside the portal.
  annotations:
    backstage.io/techdocs-ref: dir:.
spec:
  type: backstage-plugin-frontend
  lifecycle: experimental
  owner: external-developer-group
  system: dynamic-agent-system
  dependsOn:
    - component:dynamic-agent-backend # 🔗 Links directly to its corresponding backend partner
```

### Why this Manifest Design fulfills your "Test-Kit SDK" Vision

- **Cross-Repository Entity Stitching:** Notice the reference `component:infra/platform`. Backstage uses a standard format `[namespace]/[name]` for dependencies. By pointing to your core system component as an upstream requirement, the developer's entity seamlessly anchors itself into your global **Ecosystem Topology Map** the second your file system scanner picks it up.
- **Encapsulates Single-Driver Exclusivity:** If this specific third-party module requires an exclusive configuration parameter (like swapping out your default `pgvector` parameters for a local `Qdrant` instance), the developer can declare those settings in their repository's localized configuration profile overlay. Their backend component can test its unique isolated workflows cleanly without forcing any structural shifts on your main `infra` repository file templates.
