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
 * - `modelValue` (number, required) - The number value.
 *   It should be of type `number`.
 * - `min` (number) - The minimum value. Default from config.
 * - `max` (number) - The maximum value. Default from config.
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

// stores
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// utils
import { defaultPaymentAmountMinComputed } from '../../utils/price_levels';
import { defaultPaymentAmountMinComputedWithReward } from '../../utils/price_levels_with_reward';

// variables
const defaultMax = parseInt(rideToWorkByBikeConfig.entryFeePaymentMax);

export default defineComponent({
  name: 'FormFieldSliderNumber',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: false,
    },
    max: {
      type: Number,
      required: false,
      default: defaultMax,
    },
  },
  setup(props, { emit }) {
    // compute default min from store
    const challengeStore = useChallengeStore();
    const registerChallengeStore = useRegisterChallengeStore();

    const defaultMin = computed((): number => {
      const configAmount = parseInt(rideToWorkByBikeConfig.entryFeeDonationMin);
      if (configAmount && configAmount > 0) {
        return configAmount;
      }
      if (registerChallengeStore.getIsPaymentWithReward) {
        return defaultPaymentAmountMinComputedWithReward(
          challengeStore.getCurrentPriceLevelsWithReward,
        );
      } else {
        return defaultPaymentAmountMinComputed(
          challengeStore.getCurrentPriceLevels,
        );
      }
    });

    // compute final min value from props or default min from config
    const computedMin = computed((): number => {
      return props.min ?? defaultMin.value;
    });

    const model = computed({
      get: (): number => {
        return props.modelValue;
      },
      set: (value: number) => {
        if (value < computedMin.value) {
          value = computedMin.value;
        }
        if (value > props.max) {
          value = props.max;
        }
        emit('update:modelValue', value);
      },
    });

    return {
      model,
      computedMin,
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
        :min="computedMin"
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
        :min="computedMin"
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
