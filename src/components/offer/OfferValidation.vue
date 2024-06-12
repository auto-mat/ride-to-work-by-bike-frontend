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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OfferValidation',
});
</script>

<template>
  <div class="bg-grey-1 q-pa-md" data-cy="offer-validation">
    <!-- Title -->
    <h3
      class="text-subtitle2 text-weight-bold q-mt-none q-mb-sm"
      data-cy="offer-validation-title"
    >
      {{ $t('offer.titleOfferValidation') }}
    </h3>
    <!-- Row: 2 columns -->
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
      <div class="col-12 col-sm-6">
        <!-- Item: T-Shirt -->
        <q-item class="q-pa-none" dense data-cy="offer-validation-item">
          <q-item-section avatar>
            <q-icon
              color="grey-6"
              size="32px"
              name="mdi-tshirt-crew"
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
        <q-item class="q-pa-none" dense data-cy="offer-validation-item">
          <q-item-section avatar>
            <q-icon
              color="grey-6"
              size="32px"
              name="mdi-monitor-cellphone"
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
