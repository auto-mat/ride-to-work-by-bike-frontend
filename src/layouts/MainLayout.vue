<script lang="ts">
// libraries
import { defineComponent } from 'vue';
import { i18n } from '../boot/i18n';

// import components
import DrawerHeader from 'components/global/DrawerHeader.vue';
import DrawerMenu from 'components/global/DrawerMenu.vue';
import DrawerToggleButtons from 'src/components/global/DrawerToggleButtons.vue';
import FooterBar from 'components/global/FooterBar.vue';
import MobileBottomPanel from 'components/global/MobileBottomPanel.vue';
import UserSelect from 'components/global/UserSelect.vue';

// set global i18n object (for test purposes)
if (window.Cypress) {
  window.i18n = i18n;
}

export default defineComponent({
  name: 'MainLayout',

  components: {
    DrawerHeader,
    DrawerMenu,
    DrawerToggleButtons,
    FooterBar,
    MobileBottomPanel,
    UserSelect,
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
      class="gt-sm bg-info q-py-lg q-px-lg pb-footer"
      data-cy="q-drawer"
    >
      <!-- Logo + Buttons (help, notification) -->
      <drawer-header :mobile="false" data-cy="drawer-header" />
      <!-- User options dropdown -->
      <user-select class="q-pt-lg" data-cy="user-select" />
      <drawer-toggle-buttons class="q-pt-lg" data-cy="drawer-toggle-buttons" />
      <!-- Navigation menu -->
      <drawer-menu class="q-pt-lg" data-cy="drawer-menu" />
    </q-drawer>

    <q-page-container class="bg-info pb-footer">
      <router-view />
    </q-page-container>
    <q-footer class="position-static md-position-absolute bg-transparent">
      <!-- footer content -->
      <mobile-bottom-panel />
      <footer-bar />
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
