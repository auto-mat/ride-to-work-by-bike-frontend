<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BannerRoutes',
  props: {
    routesCount: {
      type: Number,
      required: true,
    },
  },
});
</script>

<template>
  <div
    class="bg-grey-1 q-py-sm"
    data-cy="banner-routes-card"
  >
    <div class="row justify-between">
      <!-- Title -->
      <div class="col-12 col-sm-8 flex items-center q-py-sm q-px-md">
        <h3
          class="text-subtitle2 text-weight-bold q-my-none"
          data-cy="banner-routes-title"
        >
          <!-- TODO: fix conjugation in CZ and SK -->
          {{ $tc('index.bannerRoutes.title', routesCount, { n: routesCount }) }}
        </h3>
      </div>
      <!-- Link to Route log -->
      <div class="col-12 col-sm-4 flex items-center justify-end q-py-sm q-px-md">
        <q-btn
          rounded
          color="grey-10"
          text-color="white"
          unelevated
          data-cy="banner-routes-button-add-routes"
        >
          <!-- Plus icon -->
          <q-icon name="add" size="24px" color="white" />
          <!-- Button text -->
          <span class="inline-block q-px-sm">
            {{ $t('index.bannerRoutes.addRoutes') }}
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-wrap {
  flex-wrap: wrap;
}
</style>
