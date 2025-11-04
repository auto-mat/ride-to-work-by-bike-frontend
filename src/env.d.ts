declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    RIDE_TO_WORK_BY_BIKE_CONFIG: string;
    RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION: string;
  }
}
