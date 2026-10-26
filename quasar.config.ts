/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli-vite/quasar-config-js

import { defineConfig } from '#q-app';

import { getAppConfig } from './src/utils/get_app_conf.js';
import { getDeployedAppVersion } from './src/utils/get_deployed_app_version.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig((ctx) => {
  return {
    eslint: {
      // fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: true,
      errors: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'bus',
      'directives',
      'global_vars',
      'google_login',
      'i18n',
      'logger',
      'pinia',
      'swiper',
      'matomo',
      'video_player',
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'ionicons-v4',
      'mdi-v5',
      'fontawesome-v6',
      'material-symbols-sharp',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      // 'roboto-font',
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
        node: 'node16',
      },

      defineEnv: {
        RIDE_TO_WORK_BY_BIKE_CONFIG: getAppConfig(process),
        RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION: getDeployedAppVersion(),
      },

      /**
       * Ignore automatically inferring and declaring types for these variables.
       * Variables can come from process.env (terminal variables) or
       * dotenv files or quasar.config > build > define/defineEnv.
       *
       * Use the full variable name as transformed in the code.
       * @example 'all' to ignore all variables
       * @example ['import.meta.env.OTHER_VAR', '__SOME_VAR__'] to ignore specific variables.
       * @source https://quasar.dev/quasar-cli-vite/handling-import-meta-env#configuring-dotenv-files
       */
      env: {
        ignoreType: [
          'import.meta.env.RIDE_TO_WORK_BY_BIKE_CONFIG',
          'import.meta.env.RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION',
        ],
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI defaults to false in Quasar v3; kept enabled because
      // vue-facebook-login-component-next ships an Options API component.
      vueOptionsAPI: true,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      extendViteConf(viteConf) {
        // Fix dynamic module import error during Cypress component tests on the OS MS Windows
        viteConf.optimizeDeps = viteConf.optimizeDeps || {};
        viteConf.optimizeDeps.entries = ['index.html', 'src/**/*.cy.js'];
        viteConf.define = viteConf.define || {};
        viteConf.define.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
        // Fix dynamic import for SVG files which breaks tests
        viteConf.build = viteConf.build || {};
        viteConf.build.assetsInlineLimit = 0;
      },

      viteVuePluginOptions: {
        template: {
          compilerOptions: {
            isCustomElement: (tag) =>
              ['swiper-slide', 'swiper-container'].includes(tag),
          },
        },
      },

      vitePlugins: [
        ['@originjs/vite-plugin-content', {}],
        [
          'vite-plugin-checker',
          {
            vueTsc: false,
            eslint: {
              lintCommand:
                'eslint -c ./eslint.config.mjs "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],

      typescript: {
        vueShim: true,
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true,
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        notify: {
          position: getAppConfig(process)['notifyMessagePosition'],
        },
      },

      iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify'],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW', // or 'InjectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'quiz',
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      extraScripts: [],

      // extendBexScriptsConf (config) {}
      // extendBexManifestJson (json) {}
    },
  };
});
