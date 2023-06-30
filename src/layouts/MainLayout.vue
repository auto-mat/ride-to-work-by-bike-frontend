<script lang="ts">
// import libraries
import { setCssVar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { i18n } from 'src/boot/i18n';

// import components
import VueDrawerHeader from 'components/VueDrawerHeader.vue';
import VueUserSelect from 'components/VueUserSelect.vue';
import VueDrawerMenu from 'components/VueDrawerMenu.vue';

// import types
import { User } from 'components/types';

if (window.Cypress) {
  window.i18n = i18n;
}

const rideToWorkByBikeConfig: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('gray-light', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'MainLayout',

  components: { VueDrawerHeader, VueUserSelect, VueDrawerMenu },

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
      class="bg-gray-light q-py-lg q-px-lg"
      data-cy="q-drawer"
    >
      <vue-drawer-header
        data-cy="drawer-header"
        :mobile="false"
      ></vue-drawer-header>
      <vue-user-select
        :options="users"
        class="q-pt-lg"
        data-cy="user-select"
      ></vue-user-select>
      <vue-drawer-menu class="q-pt-lg" data-cy="drawer-menu"></vue-drawer-menu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <!-- footer content -->
    </q-footer>
  </q-layout>
</template>

<style scoped lang="scss">
@media (min-width: $breakpoint-md-min) {
  .lg-hidden {
    display: none;
  }
}
.bg-gray-light {
  background-color: var(--q-gray-light);
}
</style>
