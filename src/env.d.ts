// types
import type { ConfigAppVersion, ConfigGlobal } from './components/types/Config';

// top-level imports make this a module so we need `declare global`
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
      VUE_ROUTER_BASE: string | undefined;
    }
  }

  interface ImportMetaEnv {
    // defined in quasar.config.ts build.defineEnv
    readonly RIDE_TO_WORK_BY_BIKE_CONFIG: ConfigGlobal;
    readonly RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION: ConfigAppVersion;
  }
}
