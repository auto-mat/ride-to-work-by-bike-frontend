<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent, ref } from 'vue';
import VueDrawerHeader from 'components/VueDrawerHeader.vue';
import VueUserSelect from 'components/VueUserSelect.vue';
import VueDrawerMenu from 'components/VueDrawerMenu.vue';

const rideToWorkByBikeConfig: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('gray-light', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'MainLayout',

  components: { VueDrawerHeader, VueUserSelect, VueDrawerMenu },

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
      :width="320"
      class="bg-gray-light q-py-lg q-px-lg"
    >
      <vue-drawer-header></vue-drawer-header>
      <vue-user-select class="q-pt-lg"></vue-user-select>
      <vue-drawer-menu class="q-pt-lg"></vue-drawer-menu>
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
.bg-gray-light {
  background-color: var(--q-gray-light);
}
</style>
