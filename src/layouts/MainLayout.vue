<script lang="ts">
// libraries
import { setCssVar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { i18n } from 'src/boot/i18n';

// components
import VueDrawerHeader from 'components/VueDrawerHeader.vue';
import VueUserSelect from 'components/VueUserSelect.vue';
import VueDrawerMenu from 'components/VueDrawerMenu.vue';
import VueFooter from 'components/VueFooter.vue';
import VueFooterPanel from 'src/components/VueFooterPanel.vue';

if (window.Cypress) {
  window.i18n = i18n;
}

const rideToWorkByBikeConfig: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('gray-light', rideToWorkByBikeConfig.colorGrayLight);
setCssVar('gray-lighter', '#f7faff');

export default defineComponent({
  name: 'MainLayout',
  components: {
    VueDrawerHeader,
    VueUserSelect,
    VueDrawerMenu,
    VueFooter,
    VueFooterPanel,
  },
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal class="lt-md bg-white">
      <q-toolbar>
        <vue-drawer-header
          v-model="leftDrawerOpen"
          data-cy="drawer-header-mobile"
          :show-logo="false"
          :show-drawer-open-button="true"
        >
        </vue-drawer-header>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      side="left"
      :width="320"
      class="gt-sm bg-gray-light q-py-lg q-px-lg pb-footer"
      data-cy="q-drawer"
    >
      <vue-drawer-header
        data-cy="drawer-header"
        :mobile="false"
      ></vue-drawer-header>
      <vue-user-select class="q-pt-lg" data-cy="user-select"></vue-user-select>
      <vue-drawer-menu class="q-pt-lg" data-cy="drawer-menu"></vue-drawer-menu>
    </q-drawer>

    <q-page-container class="bg-gray-lighter pb-footer">
      <router-view />
    </q-page-container>
    <q-footer class="position-static md-position-absolute bg-transparent">
      <!-- footer content -->
      <vue-footer-panel></vue-footer-panel>
      <vue-footer />
    </q-footer>
  </q-layout>
</template>

<style lang="scss">
.bg-gray-light {
  background-color: var(--q-gray-light);
}

.bg-gray-lighter {
  background-color: var(--q-gray-lighter);
}

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
  padding-bottom: 390px !important;
  @media (min-width: $breakpoint-md-min) {
    padding-bottom: 320px;
  }
}
</style>
