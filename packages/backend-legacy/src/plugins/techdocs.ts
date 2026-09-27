import { createRouter as createTechDocsRouter } from '@backstage/plugin-techdocs-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export async function createRouter(
  env: PluginEnvironment,
): Promise<Router> {
  return await createTechDocsRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    cache: env.cache,
    reader: env.reader,
  });
}
