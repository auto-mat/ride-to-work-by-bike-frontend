<script lang="ts">
// libraries
import { setCssVar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { i18n } from 'src/boot/i18n';

// import components
import DrawerHeader from 'components/DrawerHeader.vue';
import UserSelect from 'components/UserSelect.vue';
import DrawerMenu from 'components/DrawerMenu.vue';
import VueFooter from 'components/VueFooter.vue';

// import types
import { ConfigGlobal, User } from 'components/types';

if (window.Cypress) {
  window.i18n = i18n;
}

// import config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('info', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'MainLayout',

  components: { DrawerHeader, UserSelect, DrawerMenu, VueFooter },

  setup() {
    const leftDrawerOpen = ref(false);

    const userMenuTop: Link[] = [
      {
        title: 'Vaše údaje',
        url: '#',
      },
      {
        title: 'Odebírat newsletter',
        url: '#',
      },
      {
        title: 'Propojit aplikace',
        url: '#',
      },
      {
        title: 'Historie notifikací',
        url: '#',
      },
    ];

    const userMenuBottom: Link[] = [
      {
        title: 'Stát se firemním koordinátorem',
        url: '#',
      },
      {
        title: 'Odhlásit se',
        url: '#',
      },
    ];

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      userMenuTop,
      userMenuBottom,
      toggleLeftDrawer,
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
          v-model="leftDrawerOpen"
          data-cy="drawer-header-mobile"
          :show-logo="false"
          :show-drawer-open-button="true"
        >
        </drawer-header>
      </q-toolbar>
    </q-header>

    <!-- Left-side drawer (desktop) -->
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="320"
      class="bg-info q-py-lg q-px-lg pb-footer"
      data-cy="q-drawer"
    >
      <!-- Logo + Buttons (help, notification) -->
      <drawer-header
        data-cy="drawer-header"
        :mobile="false"
      ></drawer-header>
      <!-- User options dropdown -->
      <user-select
        :options="users"
        class="q-pt-lg"
        data-cy="user-select"
      ></user-select>
      <!-- Navigation menu -->
      <drawer-menu class="q-pt-lg" data-cy="drawer-menu"></drawer-menu>
    </q-drawer>

    <q-page-container class="bg-info pb-footer">
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent absolute-bottom">
      <!-- footer content -->
      <vue-footer />
    </q-footer>
  </q-layout>
</template>

<style lang="scss">
.pb-footer {
  padding-bottom: 20rem !important;
}
</style>
