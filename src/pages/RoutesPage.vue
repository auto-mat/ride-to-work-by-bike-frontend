<template>
  <q-page class="overflow-hidden bg-white" data-cy="q-main">
    <div class="q-px-lg">
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="routes-page-title"
      >
        {{ $t('routes.titleRoutes') }}
      </h1>
      <p
        v-html="$t('routes.descriptionRoutes')"
        data-cy="routes-page-description"
      ></p>
    </div>
    <div></div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RoutesPage',
});
</script>

<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
