<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueBannerRoutes',
  props: {
    routesCount: {
      type: Number,
      required: true,
    }
  }
})
</script>

<template>
  <q-card
    square
    flat
    :bordered="false"
    class="bg-grey-1"
    data-cy="banner-routes-card"
  >
    <q-card-section horizontal class="justify-between flex-wrap">
      <q-card-section class="row items-center">
        <h3 class="text-subtitle2 text-weight-bold q-my-none" data-cy="banner-routes-title">{{ $tc('index.bannerRoutes.title', { routesCount: routesCount }) }}</h3>
      </q-card-section>
      <q-card-section class="row items-center">
        <q-btn
        rounded
        color="grey-10"
        text-color="white"
        unelevated
        data-cy="banner-routes-button-add-routes">
          <q-icon name="add" size="24px" color="white" />
          <span class="inline-block q-px-sm">
            {{ $t('index.bannerRoutes.addRoutes') }}
          </span>
        </q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.flex-wrap {
  flex-wrap: wrap;
}
</style>
