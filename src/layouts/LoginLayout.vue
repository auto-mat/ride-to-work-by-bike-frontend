<script lang="ts">
// libraries
import { defineComponent } from 'vue';
import { i18n } from 'src/boot/i18n';

// set global i18n object (for test purposes)
if (window.Cypress) {
  window.i18n = i18n;
}

export default defineComponent({
  name: 'LoginLayout',
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
