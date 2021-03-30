import { envload } from './env_load';
envload();
import * as config from 'config';
import { CachingConfig } from '../models';

/**
 * Wallet object configuration.
 * Has 3rd party API hosts and other configurations
 */
export const elrondConfig = config.get('elrond');
/**
 * Caching time config.
 * The values are in seconds
 */
export const cacheConfig: CachingConfig = config.get('caching');
