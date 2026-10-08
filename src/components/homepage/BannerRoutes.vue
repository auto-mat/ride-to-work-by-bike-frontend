<script lang="ts">
/**
 * BannerRoutes Component
 *
 * The `BannerRoutes` component acts as a reminder to log biking routes.
 *
 * @description
 * Displayed as a banner, this component highlights the date of the entry phase end.
 *
 * @props
 * - `dateEnd` (String, required): The date of the entry phase end.
 *
 * @example
 * <banner-routes :date-end="entryPhaseEnd" />
 */

// libraries
import { colors, date, Screen } from 'quasar';
import { computed, defineComponent } from 'vue';

// composables
import { i18n } from '@/boot/i18n';

// config
import { rideToWorkByBikeConfig } from '@/boot/global_vars';

// routes
import { routesConf } from '../../router/routes_conf';

export default defineComponent({
  name: 'BannerRoutes',
  props: {
    dateEnd: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const secondary = getPaletteColor('secondary');
    const secondaryOpacity = changeAlpha(
      secondary,
      rideToWorkByBikeConfig.colorSecondaryBackgroundOpacity,
    );

    const dateEndFormatted = computed<string>(() => {
      if (props.dateEnd && date.isValid(props.dateEnd)) {
        return i18n.global.d(new Date(props.dateEnd), 'numeric');
      }
      return '';
    });

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
      dateEndFormatted,
      secondaryOpacity,
      routesConf,
      Screen,
    };
  },
});
</script>

<template>
  <div
    class="text-grey-10 q-py-sm"
    :style="{
      borderRadius,
      backgroundColor: secondaryOpacity,
    }"
    data-cy="banner-routes-card"
  >
    <div class="row justify-between">
      <!-- Section: title -->
      <div class="col-12 flex gap-24 items-center q-py-sm q-px-lg">
        <!-- Image -->
        <q-img
          class="col-12 col-md-auto"
          src="~@/assets/svg/banner-routes.svg"
          width="70px"
          height="102px"
          alt=""
          aria-hidden="true"
          data-cy="banner-routes-image"
        />
        <!-- Title -->
        <h3
          class="col-12 col-md text-h5 text-weight-bold q-my-none"
          style="text-wrap: balance"
          data-cy="banner-routes-title"
        >
          {{
            $t('index.bannerRoutes.titleDefault', { date: dateEndFormatted })
          }}
        </h3>
        <!-- Link to Routes list -->
        <div
          class="col-12 col-md-auto flex items-center justify-end q-py-sm"
          data-cy="banner-routes-section-button"
        >
          <q-btn
            rounded
            unelevated
            color="primary"
            size="16px"
            text-color="white"
            :to="routesConf['routes'].children.fullPath"
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
            <span class="inline-block q-px-sm">
              {{ $t('index.bannerRoutes.addRoutes') }}
            </span>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
