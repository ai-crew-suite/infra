import { DockerContainerRunner } from '@backstage/backend-common';
import { Scaffolder, createRouter as createScaffolderRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import Docker from 'dockerode';
import { PluginEnvironment } from '../types';

export async function createRouter(
  env: PluginEnvironment,
): Promise<Router> {
  const docker = new Docker();
  const containerRunner = new DockerContainerRunner({ docker });

  return await createScaffolderRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    catalogClient: env.discovery as any, // Legacy client type override cast
    reader: env.reader,
    containerRunner,
  });
}
