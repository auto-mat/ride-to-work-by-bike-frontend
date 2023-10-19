<script lang="ts">
/**
 * BannerRoutes Component
 *
 * The `BannerRoutes` component acts as a reminder to log biking routes.
 *
 * @description
 * Displayed as a banner, this component highlights the number of biking routes
 * that have not been logged by the user.
 *
 *
 * @props
 * - `routesCount` (Number, required): The number of biking routes that are yet
 *   to be logged by the user.
 * - `variant` (String: 'default' | 'start', required): Determines the
 *   appearance based on whether user has already started logging routes.
 *
 * @example
 * <banner-routes
 *   :routesCount="unloggedRoutesCount"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6021%3A22990&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BannerRoutes',
  props: {
    routesCount: {
      type: Number,
      required: true,
    },
    variant: {
      type: String as () => 'default' | 'start',
      required: true,
    }
  },
});
</script>

<template>
  <div class="bg-grey-1 q-py-sm" data-cy="banner-routes-card">
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
      <div
        class="col-12 col-sm-4 flex items-center justify-end q-py-sm q-px-md"
      >
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
