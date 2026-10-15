/* eslint-disable */
import type { ComponentCustomProperties as VueCustomPropertiesObject } from 'vue';

/// <reference types="vite/client" />

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * Shares types between `vue` and `@vue/runtime-core` packages.
 * This way the types are available for all libraries regardless of where they
 * import types from.
 */
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends VueCustomPropertiesObject {}
}
