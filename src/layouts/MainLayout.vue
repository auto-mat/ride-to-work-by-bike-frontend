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

// mocks
import * as layout from 'src/mocks/layout';

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
  components: { VueDrawerHeader, VueUserSelect, VueDrawerMenu, VueFooter },
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      userMenuTop: layout.userMenuTop,
      userMenuBottom: layout.userMenuBottom,
      user: layout.user,
      toggleLeftDrawer,
    };
  },
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal class="lg-hidden bg-white">
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
      v-model="leftDrawerOpen"
      side="left"
      :width="320"
      class="bg-gray-light q-py-lg q-px-lg pb-footer"
      data-cy="q-drawer"
    >
      <vue-drawer-header
        data-cy="drawer-header"
        :mobile="false"
      ></vue-drawer-header>
      <vue-user-select
        :menu-top="userMenuTop"
        :menu-bottom="userMenuBottom"
        :user="user"
        class="q-pt-lg"
        data-cy="user-select"
      ></vue-user-select>
      <vue-drawer-menu class="q-pt-lg" data-cy="drawer-menu"></vue-drawer-menu>
    </q-drawer>

    <q-page-container class="bg-gray-lighter pb-footer">
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent absolute-bottom">
      <!-- footer content -->
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

.pb-footer {
  padding-bottom: 20rem !important;
}

@media (min-width: $breakpoint-md-min) {
  .lg-hidden {
    display: none;
  }
}
</style>
