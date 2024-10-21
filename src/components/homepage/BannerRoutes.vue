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
 * @see
 * [Figma Design - default](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6021%3A22990&mode=dev)
 * [Figma Design - start](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103951&mode=dev)
 */

// libraries
import { colors, Screen } from 'quasar';
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
export enum BannerRoutesVariants {
  default = 'default',
  start = 'start',
}

// routes
import { routesConf } from '../../router/routes_conf';

export default defineComponent({
  name: 'BannerRoutes',
  props: {
    routesCount: {
      type: Number,
      required: true,
    },
    variant: {
      type: String as () => BannerRoutesVariants,
      required: true,
    },
  },
  setup() {
    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const secondary = getPaletteColor('secondary');
    const secondaryOpacity = changeAlpha(
      secondary,
      rideToWorkByBikeConfig.colorSecondaryBackgroundOpacity,
    );

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
      secondaryOpacity,
      routesConf,
      Screen,
      BannerRoutesVariants,
    };
  },
});
</script>

<template>
  <div
    class="text-grey-10"
    :class="[variant === BannerRoutesVariants.default ? 'q-py-sm' : 'q-py-lg']"
    :style="{
      borderRadius,
      backgroundColor: secondaryOpacity,
    }"
    data-cy="banner-routes-card"
  >
    <div class="row justify-between">
      <!-- Section: title -->
      <div
        class="col-12 flex gap-24 items-center q-py-sm q-px-lg"
        :class="[
          variant === BannerRoutesVariants.default
            ? 'col-md-6'
            : 'justify-center',
          Screen.lg ? 'no-wrap' : '',
        ]"
        data-cy="banner-routes-section-title"
      >
        <!-- Image -->
        <q-img
          class="col-12 col-sm-auto"
          src="~assets/svg/banner-routes.svg"
          width="70px"
          height="102px"
          alt=""
          aria-hidden="true"
          data-cy="banner-routes-image"
        />
        <!-- Title -->
        <h3
          class="col-12 col-sm text-h5 text-weight-bold q-my-none"
          data-cy="banner-routes-title"
        >
          <span v-if="variant === BannerRoutesVariants.default">
            <!-- TODO: fix conjugation in CZ and SK -->
            {{
              $tc('index.bannerRoutes.title', routesCount, { n: routesCount })
            }}
          </span>
          <span v-else-if="variant === BannerRoutesVariants.start">
            {{ $t('index.bannerRoutes.titleStart') }}
          </span>
        </h3>
      </div>
      <!-- Link to Routes list -->
      <div
        class="col-12 flex items-center justify-end q-py-sm q-px-xl"
        :class="[variant === 'default' ? 'col-md-6' : 'justify-center']"
        data-cy="banner-routes-section-button"
      >
        <q-btn
          rounded
          unelevated
          color="primary"
          size="16px"
          text-color="white"
          :to="routesConf['routes_list'].children.fullPath"
          class="q-pa-md text-weight-bold"
          data-cy="banner-routes-button-add-routes"
        >
          <!-- Plus icon -->
          <q-icon
            name="add"
            size="24px"
            color="white"
            class="q-mr-sm"
            data-cy="banner-routes-button-icon"
          />
          <!-- Button text -->
          <span
            v-if="variant === BannerRoutesVariants.default"
            class="inline-block q-px-sm"
          >
            {{ $t('index.bannerRoutes.addRoutes') }}
          </span>
          <span v-else-if="variant == BannerRoutesVariants.start">
            {{ $t('index.bannerRoutes.addFirstRoutes') }}
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>
