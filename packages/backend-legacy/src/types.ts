import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
  PluginDatabaseManager,
  PluginCacheManager,
  PluginEndpointDiscovery,
  TokenManager,
  UrlReader,
} from '@backstage/backend-common';

export interface PluginEnvironment {
  logger: Logger;
  database: PluginDatabaseManager;
  cache: PluginCacheManager;
  config: Config;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  reader: UrlReader;
}
