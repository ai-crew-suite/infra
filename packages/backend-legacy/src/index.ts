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
import Router from 'express-promise-router';
import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  CacheManager,
  DatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  ServerTokenManager,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { PluginEnvironment } from './types';

// 1. Core Internal Environment Builder Factory
function createEnv(pluginId: string, config: Config): PluginEnvironment {
  const logger = getRootLogger().child({ type: 'plugin', plugin: pluginId });
  const database = DatabaseManager.fromConfig(config).forPlugin(pluginId);
  const cache = CacheManager.fromConfig(config).forPlugin(pluginId);
  const discovery = SingleHostDiscovery.fromConfig(config);
  const tokenManager = ServerTokenManager.noop();
  const reader = UrlReaders.fromConfig({ logger, config });

  return { logger, database, cache, config, discovery, tokenManager, reader };
}

async function main() {
  const logger = getRootLogger();
  logger.info('Initializing Legacy Express Test Bench Engine...');

  // 2. Extract configuration contexts from layered command line strings
  const config = await loadBackendConfig({
    argv: process.argv,
    logger,
  });

  // 3. Initialize explicit routing controllers and execution pools
  const apiRouter = Router();
  const serviceBuilder = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)
    .addStatusCheck('/health', async () => ({ status: 'OK' }));

  // Hot memoize prevents compilation pools from spawning memory leaks during local dev reloads
  const envBuilder = useHotMemoize(module, () => (pluginId: string) => createEnv(pluginId, config));

  // 4. Inject structural core modules using legacy Express routers
  const appEnv = envBuilder('app');
  const catalogEnv = envBuilder('catalog');
  const scaffolderEnv = envBuilder('scaffolder');
  const techdocsEnv = envBuilder('techdocs');
  const proxyEnv = envBuilder('proxy');

  // Load backend framework modules asynchronously (dynamically imported via plugins directory)
  const { createRouter: catalogRouter } = await import('./plugins/catalog');
  const { createRouter: scaffolderRouter } = await import('./plugins/scaffolder');
  const { createRouter: techdocsRouter } = await import('./plugins/techdocs');
  const { createRouter: proxyRouter } = await import('./plugins/proxy');

  apiRouter.use('/catalog', await catalogRouter(catalogEnv));
  apiRouter.use('/scaffolder', await scaffolderRouter(scaffolderEnv));
  apiRouter.use('/techdocs', await techdocsRouter(techdocsEnv));
  apiRouter.use('/proxy', await proxyRouter(proxyEnv));

  // 5. Secure trailing routes with standard compliance boundary catchers
  apiRouter.use(notFoundHandler());

  const server = serviceBuilder.build();
  await server.start();
}

main().catch(err => {
  getRootLogger().error('Legacy Test Bench engine crashed during initialization sequence:', err);
  process.exit(1);
});
