<script lang="ts">
/**
 * FormFieldVoucher Component
 *
 * @description * Use this component to render a Voucher widget.
 * It handles voucher submission and validation and emits
 * the data about the voucher.
 *
 * Used in `RegisterChallengePayment` component.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required text field.
 *
 * @example
 * <form-field-voucher />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6410-2305&t=gB7ERmDZorpD4TdE-1)
 */

// libraries
import { Notify } from 'quasar';
import { computed, defineComponent, ref } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useFormatPrice } from '../../composables/useFormatPrice';
import { useApiGetDiscountCoupon } from '../../composables/useApiGetDiscountCoupon';

import { defaultPaymentAmountMinComputed } from '../../utils/price_levels.ts';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { Currency } from '../../composables/useFormatPrice';

// stores
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { ValidatedCoupon } from '../types/Coupon';

export default defineComponent({
  name: 'FormFieldVoucher',
  components: {
    FormFieldTextRequired,
  },
  props: {},
  setup() {
    const formFieldTextRequiredRef = ref<InstanceType<
      typeof FormFieldTextRequired
    > | null>(null);
    const challengeStore = useChallengeStore();
    const defaultPaymentAmountMin = computed(() => {
      return defaultPaymentAmountMinComputed(
        challengeStore.getCurrentPriceLevels,
      );
    });

    const registerChallengeStore = useRegisterChallengeStore();

    const code = ref('');
    const codeFormatted = computed(() => code.value.replace(/\s/g, ''));
    const voucher = computed<ValidatedCoupon | null>({
      get: (): ValidatedCoupon | null => registerChallengeStore.getVoucher,
      set: (voucher: ValidatedCoupon | null) => {
        registerChallengeStore.setVoucher(voucher);
      },
    });

    const { validateCoupon, isLoading } = useApiGetDiscountCoupon(null);

    /**
     * Submits voucher data to API
     * If voucher is valid it emits the data
     * @returns {void}
     */
    const onSubmitVoucher = async (): Promise<void> => {
      if (formFieldTextRequiredRef.value?.inputRef?.validate()) {
        const validatedCoupon: ValidatedCoupon = await validateCoupon(
          codeFormatted.value,
        );

        // when applying voucher, we need to check both validity and availability
        if (validatedCoupon.valid && validatedCoupon.available) {
          Notify.create({
            type: 'positive',
            message: i18n.global.t('notify.voucherApplySuccess'),
          });
          voucher.value = validatedCoupon;
        } else {
          Notify.create({
            type: 'negative',
            message: i18n.global.t('notify.voucherApplyError'),
          });
          voucher.value = null;
        }
      }
    };

    /**
     * Resets the code and voucher values.
     * @return {void}
     */
    const onRemoveVoucher = (): void => {
      code.value = '';
      voucher.value = null;
    };

    const { formatPriceCurrency } = useFormatPrice();

    /**
     * Displays the text string with the discount
     * If discount is 100% display "Free registration" message
     * If discount is less than 100% display the discount percentage
     * as well as computed discount amount (discounted default amount).
     */
    const voucherDiscount = computed((): string => {
      const discount = voucher.value?.discount;
      if (!discount) return '';

      // calculate discount from min payment amount
      const discountAmountInt: number = Math.round(
        defaultPaymentAmountMin.value -
          (defaultPaymentAmountMin.value * discount) / 100,
      );

      if (discount === 100) {
        return i18n.global.t('register.challenge.labelVoucherFreeRegistration');
      } else if (discountAmountInt) {
        return `${i18n.global.t('global.discount')} ${discount}% (${formatPriceCurrency(discountAmountInt, Currency.CZK)})`;
      }

      return `-${discount}%`;
    });

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      code,
      isLoading,
      voucher,
      voucherDiscount,
      onRemoveVoucher,
      onSubmitVoucher,
      formFieldTextRequiredRef,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-voucher">
    <q-banner
      v-if="voucher"
      inline-actions
      rounded
      class="bg-grey-2 q-my-lg"
      :style="{ borderRadius }"
      data-cy="voucher-banner"
    >
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm text-grey-10" data-cy="voucher-banner-code">
          {{ $t('form.textVoucher') }}: {{ voucher.name }}
        </div>
        <div
          class="col-12 col-sm-auto text-weight-bold text-primary"
          data-cy="voucher-banner-name"
        >
          {{ voucherDiscount }}
        </div>
      </div>
      <template v-slot:action>
        <q-btn
          dense
          flat
          color="primary"
          icon="mdi-close"
          size="18px"
          data-cy="voucher-button-remove"
          @click.prevent="onRemoveVoucher"
        />
      </template>
    </q-banner>
    <q-form v-else @submit.prevent="onSubmitVoucher">
      <div class="row items-center q-col-gutter-md" data-cy="voucher-widget">
        <div class="col">
          <!-- Input: Voucher -->
          <form-field-text-required
            v-model="code"
            name="voucher"
            label="form.labelVoucher"
            data-cy="form-field-voucher-input"
            ref="formFieldTextRequiredRef"
          />
        </div>
        <div class="col-auto">
          <!-- Button: Submit -->
          <q-btn
            rounded
            unelevated
            type="submit"
            color="primary"
            class="q-mt-sm"
            :label="$t('form.buttonVoucherSubmit')"
            :loading="isLoading"
            data-cy="form-field-voucher-submit"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>
