<script lang="ts">
// libraries
import { computed, defineComponent, inject } from 'vue';
import { i18n } from '../boot/i18n';
import { defaultLocale } from '../i18n/def_locale';
import { useRoute } from 'vue-router';

// components
import AutomatLogoBanner from 'components/global/AutomatLogoBanner.vue';
import DrawerHeader from 'components/global/DrawerHeader.vue';
import DrawerMenu from 'components/global/DrawerMenu.vue';
import FooterBar from 'components/global/FooterBar.vue';
import MobileBottomPanel from 'components/global/MobileBottomPanel.vue';
import UserSelect from 'components/global/UserSelect.vue';

// routes config
import { routesConf } from '../router/routes_conf';

// composables
import { useMenu } from 'src/composables/useMenu';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Link } from 'components/types';
import type { Logger } from 'components/types/Logger';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// utils
import { getApiBaseUrlWithLang } from '../utils/get_api_base_url_with_lang';

declare global {
  interface Window {
    i18n: typeof i18n;
  }
}

// set global i18n object (for test purposes)
if (window.Cypress) {
  window.i18n = i18n;
}

export default defineComponent({
  name: 'MainLayout',
  components: {
    AutomatLogoBanner,
    DrawerHeader,
    DrawerMenu,
    FooterBar,
    MobileBottomPanel,
    UserSelect,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const route = useRoute();
    const registerChallengeStore = useRegisterChallengeStore();

    const isHomePage = computed(
      () => route.path === routesConf['home']['path'],
    );
    // do not limit homepage max width - there are sections with bg color.
    const maxWidth = computed(() => {
      return isHomePage.value
        ? 'none'
        : rideToWorkByBikeConfig.containerContentWidth;
    });

    const { getMenuTop, getMenuBottom } = useMenu();
    const urlDonate = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlDonate,
        defaultLocale,
        i18n,
      );
    });
    const menuBottom = computed(() => {
      return getMenuBottom(urlDonate.value);
    });
    const isUserOrganizationAdmin = computed(
      () => registerChallengeStore.isUserOrganizationAdmin,
    );
    const isUserStaff = computed(() => registerChallengeStore.getIsUserStaff);

    const {
      urlRideToWorkByBikeOldFrontendDjangoApp,
      urlRideToWorkByBikeOldFrontendDjangoAppAdmin,
    } = rideToWorkByBikeConfig;
    const rtwbbOldFrontendDjangoAdminUrl = `${urlRideToWorkByBikeOldFrontendDjangoApp}/${urlRideToWorkByBikeOldFrontendDjangoAppAdmin}`;

    const urlAdmin = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rtwbbOldFrontendDjangoAdminUrl,
        defaultLocale,
        i18n,
      );
    });
    const menuTop = computed((): Link[] => {
      return getMenuTop({
        isUserOrganizationAdmin,
        isUserStaff,
        urlAdmin,
      });
    });

    return {
      menuBottom,
      menuTop,
      isHomePage,
      maxWidth,
    };
  },
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <!-- Top bar: (mobile) -->
    <q-header reveal class="lt-md bg-white">
      <q-toolbar>
        <!-- Logo + Buttons (help, notification) -->
        <drawer-header
          mobile
          :show-logo="false"
          :show-drawer-open-button="true"
          data-cy="drawer-header-mobile"
        >
        </drawer-header>
      </q-toolbar>
    </q-header>

    <!-- Left-side drawer (desktop) -->
    <q-drawer
      show-if-above
      side="left"
      :width="320"
      class="gt-sm bg-primary q-py-lg"
      data-cy="q-drawer"
    >
      <div class="q-px-lg">
        <!-- Logo + Buttons (help, notification) -->
        <drawer-header data-cy="drawer-header" />
        <!-- User options dropdown -->
        <user-select class="q-pt-lg" data-cy="user-select-desktop" />
      </div>
      <!-- Navigation menu -->
      <drawer-menu :items="menuTop" class="q-pt-lg" data-cy="drawer-menu-top" />
      <q-separator
        v-if="menuBottom.length > 0"
        color="blue-grey-2 q-my-sm q-mx-lg"
      />
      <drawer-menu :items="menuBottom" data-cy="drawer-menu-bottom" />
      <automat-logo-banner
        class="q-mx-md q-mt-lg"
        data-cy="automat-logo-banner"
      />
    </q-drawer>

    <q-page-container class="bg-white">
      <router-view :style="{ maxWidth }" />
      <!-- Footer content (desktop) -->
      <footer-bar />
    </q-page-container>
    <!-- Footer content (mobile) -->
    <q-footer class="position-static md-position-absolute bg-transparent">
      <mobile-bottom-panel />
    </q-footer>
  </q-layout>
</template>

<style lang="scss">
.md-absolute-bottom {
  @media (min-width: $breakpoint-md-min) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.position-static {
  position: static;
}

.md-position-absolute {
  @media (min-width: $breakpoint-md-min) {
    position: absolute;
  }
}

.pb-footer {
  padding-bottom: 420px !important;

  @media (min-width: $breakpoint-md-min) {
    padding-bottom: 320px !important;
  }
}
</style>
