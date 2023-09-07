<script lang="ts">
// import libraries
import { setCssVar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { i18n } from 'src/boot/i18n';

// import components
import DrawerHeader from 'components/DrawerHeader.vue';
import UserSelect from 'components/UserSelect.vue';
import DrawerMenu from 'components/DrawerMenu.vue';

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

  components: { DrawerHeader, UserSelect, DrawerMenu },

  setup() {
    const leftDrawerOpen = ref(false);

    const users: User[] = [
      {
        label: 'User 1',
        value: '1',
        image: 'https://picsum.photos/id/40/300/300',
      },
      {
        label: 'User 2',
        value: '2',
        image: 'https://picsum.photos/id/64/300/300',
      },
      {
        label: 'User 3',
        value: '3',
        image: 'https://picsum.photos/id/91/300/300',
      },
    ];

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      users,
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
      class="bg-info q-py-lg q-px-lg"
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

    <!-- Page content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <!-- Footer content -->
    </q-footer>
  </q-layout>
</template>
