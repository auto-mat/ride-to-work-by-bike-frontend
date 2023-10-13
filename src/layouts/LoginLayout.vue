<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoginLayout',
})
</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
