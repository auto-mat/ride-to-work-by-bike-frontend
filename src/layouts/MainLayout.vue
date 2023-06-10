<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    return {};
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
