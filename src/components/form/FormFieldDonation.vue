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
import { computed, defineComponent, onUnmounted, ref, watch } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// components
import FormFieldSliderNumber from './FormFieldSliderNumber.vue';

// stores
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// utils
import { defaultPaymentAmountMinComputed } from '../../utils/price_levels';
import { defaultPaymentAmountMinComputedWithReward } from '../../utils/price_levels_with_reward';

export default defineComponent({
  name: 'FormFieldDonation',
  components: {
    FormFieldSliderNumber,
  },
  emits: ['update:donation'],
  setup(props, { emit }) {
    const challengeStore = useChallengeStore();
    const registerChallengeStore = useRegisterChallengeStore();

    const defaultPaymentAmountMin = computed((): number => {
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
    watch(defaultPaymentAmountMin, () => {
      amount.value = defaultPaymentAmountMin.value;
    });
    const amount = ref<number>(0);
    const isDonation = ref<boolean>(false);

    /**
     * Watch values and emit 'update:donation' event.
     */
    watch(
      [amount, isDonation],
      () => {
        if (isDonation.value) {
          emit('update:donation', amount.value);
        } else {
          // deselecting donation resets donation amount to default
          amount.value = defaultPaymentAmountMin.value;
          emit('update:donation', 0);
        }
      },
      { immediate: true },
    );

    onUnmounted(() => {
      emit('update:donation', 0);
    });

    return {
      amount,
      isDonation,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-donation">
    <!-- Checkbox: Donation -->
    <q-checkbox
      dense
      v-model="isDonation"
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
    <div v-if="isDonation" class="q-mt-md">
      <form-field-slider-number
        v-model="amount"
        data-cy="form-field-donation-slider"
      />
    </div>
  </div>
</template>
