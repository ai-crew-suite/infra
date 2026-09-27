/*
 * Copyright 2026 The AI Crew Suite Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { createBackend } from '@backstage/backend-defaults';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha'
import { EnterpriseCustomKindsProcessor } from '@ai-crew-suite/custom-catalog-kinds';

// 1. Initialize the core Dependency Injection assembly container
const backend = createBackend();

// 2. Attach modern core system plugins and alpha boundary routers
backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));

// 3. Attach authentication lifecycle plugins
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));

// 3.5. Inject local permission sandbox policy module override
// This pulls from packages/backend-modern/src/plugins/permission.ts
backend.add(import('./plugins/permission'));

// 4. (Optional Placeholder): Register your local platform or tool mock engines here.
// When your 'drivers' or 'platform' repositories push update bundles via submodules,
// you hook them into this test architecture simply by importing them directly:
// backend.add(import('@ai-crew-suite/drivers'));

catalogProcessingExtensionPoint.addProcessor(new EnterpriseCustomKindsProcessor());

// 5. Fire the runtime network execution loop
backend.start();
