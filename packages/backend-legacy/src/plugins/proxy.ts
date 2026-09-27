import { createRouter as createProxyRouter } from '@backstage/plugin-proxy-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export async function createRouter(
  env: PluginEnvironment,
): Promise<Router> {
  return await createProxyRouter({
    logger: env.logger,
    config: env.config,
    discovery: env.discovery,
  });
}
