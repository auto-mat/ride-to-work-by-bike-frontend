<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent, ref } from 'vue';
import DrawerHeader from 'components/DrawerHeader.vue';
import UserSelect from 'components/UserSelect.vue';
import DrawerMenu from 'components/DrawerMenu.vue';

const rideToWorkByBikeConfig: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('gray-light', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'MainLayout',

  components: { DrawerHeader, UserSelect, DrawerMenu },

  setup() {
    const leftDrawerOpen = ref(true);
    return {
      leftDrawerOpen,
    };
  },
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="360"
      class="q-py-lg q-px-lg"
    >
      <drawer-header></drawer-header>
      <user-select class="q-pt-lg"></user-select>
      <drawer-menu class="q-pt-lg"></drawer-menu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <!-- footer content -->
    </q-footer>
  </q-layout>
</template>

<style>
.q-drawer {
  background-color: var(--q-gray-light);
}
</style>
