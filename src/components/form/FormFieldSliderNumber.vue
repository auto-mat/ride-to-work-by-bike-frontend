<script lang="ts">
/**
 * FormFieldSliderNumber Component
 *
 * @description * Use this component to render an input widget for a number
 * value with slider and manual input.
 *
 * Used in `RegisterChallengePayment`, `FormFieldDonation`.
 *
 * @props
 * - `modelValue` (number, required): The number value.
 *   It should be of type `number`.
 * - `min` (number, required): The minimum value.
 * - `max` (number, required): The maximum value.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-slider-number v-model="number">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6417-28987&t=gB7ERmDZorpD4TdE-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// variables
const defaultMin = parseInt(rideToWorkByBikeConfig.entryFeePaymentMin);
const defaultMax = parseInt(rideToWorkByBikeConfig.entryFeePaymentMax);

export default defineComponent({
  name: 'FormFieldSliderNumber',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number,
      required: true,
      default: defaultMin,
    },
    min: {
      type: Number,
      required: false,
      default: defaultMin,
    },
    max: {
      type: Number,
      required: false,
      default: defaultMax,
    },
  },
  setup(props, { emit }) {
    const model = computed({
      get: (): number => {
        return props.modelValue;
      },
      set: (value: number) => {
        if (value < props.min) {
          value = props.min;
        }
        if (value > props.max) {
          value = props.max;
        }
        emit('update:modelValue', value);
      },
    });

    return {
      model,
    };
  },
});
</script>

<template>
  <div
    class="row items-center q-col-gutter-md"
    data-cy="form-field-slider-number"
  >
    <div class="col-7 col-sm flex items-center">
      <q-slider
        v-model="model"
        :min="min"
        :max="max"
        color="primary"
        data-cy="form-field-slider-number-slider"
      />
    </div>
    <div class="col-5 col-sm-auto">
      <q-input
        dense
        outlined
        type="number"
        v-model.number="model"
        :min="min"
        :max="max"
        data-cy="form-field-slider-number-input"
      >
        <template v-slot:append>
          <span
            class="text-subtitle2 text-weight-regular text-grey-10"
            data-cy="form-field-slider-number-unit"
          >
            {{ $t('global.currencyUnitCzk') }}
          </span>
        </template>
      </q-input>
    </div>
  </div>
</template>
