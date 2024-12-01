<script lang="ts">
/**
 * FormFieldDonation Component
 *
 * @description * Use this component to render donation form field.
 *
 * Used in `RegisterChallengePayment` component.
 *
 * @events
 * - `update:donation`: Emitted when donation amount changes.
 *
 * @components
 * - `FormFieldSliderNumber`: Component to render number input with slider.
 *
 * @example
 * <form-field-donation @update:donation="onUpdateDonation">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6417-29456&t=a6lPGteicfXsWu6F-1)
 */

// libraries
import { defineComponent, ref, watch } from 'vue';

// components
import FormFieldSliderNumber from './FormFieldSliderNumber.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'FormFieldDonation',
  components: {
    FormFieldSliderNumber,
  },
  emits: ['update:donation'],
  setup(props, { emit }) {
    const defaultPaymentAmountMin = parseInt(
      rideToWorkByBikeConfig.entryFeePaymentMin,
    );
    const amount = ref<number>(defaultPaymentAmountMin);
    const donation = ref<boolean>(false);

    /**
     * Watch values and emit 'update:donation' event.
     */
    watch([amount, donation], () => {
      if (donation.value) {
        emit('update:donation', amount.value);
      } else {
        emit('update:donation', false);
      }
    });

    return {
      amount,
      donation,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-donation">
    <!-- Checkbox: Donation -->
    <q-checkbox
      dense
      v-model="donation"
      color="primary"
      :true-value="true"
      :false-value="false"
      data-cy="form-field-donation-checkbox"
    >
      <!-- Label -->
      <span class="text-grey-10">
        {{ $t('form.labelVoucherEntryFeeDonation') }}
      </span>
    </q-checkbox>
    <!-- Widget: Slider input -->
    <div v-if="donation" class="q-mt-md">
      <form-field-slider-number
        v-model="amount"
        data-cy="form-field-donation-slider"
      />
    </div>
  </div>
</template>
