<script lang="ts">
/**
 * OfferValidation Component
 *
 * @description * Use this component to display information about how an offer.
 * can be validated and received.
 * This snippet component is used by the `CardOffer` component.
 *
 * @example
 * <offer-validation />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104737&t=MPCKpyMz9ntbhZYe-1)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

export default defineComponent({
  name: 'OfferValidation',
  setup() {
    const { changeAlpha, getPaletteColor } = colors;
    const primary = getPaletteColor('primary');
    const primaryOpacity = changeAlpha(
      primary,
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    return {
      backgroundColor: primaryOpacity,
    };
  },
});
</script>

<template>
  <div
    class="q-pa-md q-pb-lg"
    :style="{ backgroundColor }"
    data-cy="offer-validation"
  >
    <!-- Title -->
    <h3
      class="text-subtitle2 text-weight-bold q-mt-none q-mb-md"
      data-cy="offer-validation-title"
    >
      {{ $t('offer.titleOfferValidation') }}
    </h3>
    <!-- Row: 2 columns -->
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <div class="col-12 col-sm-6">
        <!-- Item: T-Shirt -->
        <q-item
          dense
          class="full-height q-pa-none"
          data-cy="offer-validation-item-tshirt"
        >
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="32px"
              name="svguse:icons/card_offer/icons.svg#lucide-shirt"
              data-cy="offer-validation-icon"
            />
          </q-item-section>
          <q-item-section>{{
            $t('offer.labelOfferValidationTshirt')
          }}</q-item-section>
        </q-item>
      </div>
      <div class="col-12 col-sm-6">
        <!-- Item: Account -->
        <q-item
          class="full-height q-pa-none"
          dense
          data-cy="offer-validation-item-app"
        >
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="32px"
              name="svguse:icons/card_offer/icons.svg#lucide-monitor-smartphone"
              data-cy="offer-validation-icon"
            />
          </q-item-section>
          <q-item-section>{{
            $t('offer.labelOfferValidationAccount')
          }}</q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>
