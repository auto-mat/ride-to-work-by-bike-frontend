<script lang="ts">
/**
 * RegisterChallengePayment Component
 *
 * @description * Use this component to render a payment widget for the
 * registration process.
 * Options for payment amount are set in the config file as
 * `entryFeePaymentMin`, `entryFeePaymentMax` and `entryFeePaymentOptions`.
 *
 * @components
 * - `FormFieldCompany`: Component to render company select.
 * - `FormFieldDonation`: Component to render donation widget.
 * - `FormFieldPhone`: Component to render phone input.
 * - `FormFieldRadioRequired`: Component to render radio buttons.
 * - `FormFieldSliderNumber`: Component to render number input with slider.
 * - `FormFieldTextRequired`: Component to render required text field.
 * - `FormFieldVoucher`: Component to render voucher widget.
 *
 * @example
 * <register-challenge-payment />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6485-30201&t=5JpU0wrURbmXLMCm-1)
 */

// libraries
import { colors, Notify } from 'quasar';
import { computed, defineComponent, reactive, ref, watch } from 'vue';

// composables
import { i18n } from '../../boot/i18n';
import { useFormatPrice } from '../../composables/useFormatPrice';

// components
import FormFieldCompany from '../global/FormFieldCompany.vue';
import FormFieldDonation from '../form/FormFieldDonation.vue';
import FormFieldPhone from '../global/FormFieldPhone.vue';
import FormFieldRadioRequired from '../form/FormFieldRadioRequired.vue';
import FormFieldSliderNumber from '../form/FormFieldSliderNumber.vue';
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldVoucher from '../form/FormFieldVoucher.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { Currency } from '../../composables/useFormatPrice';
enum PaymentSubject {
  individual = 'individual',
  voucher = 'voucher',
  company = 'company',
  school = 'school',
}
enum PaymentAmount {
  custom = 'custom',
}

// types
import type { FormOption, FormPaymentVoucher } from '../types/Form';

export default defineComponent({
  name: 'RegisterChallengePayment',
  components: {
    FormFieldCompany,
    FormFieldDonation,
    FormFieldPhone,
    FormFieldRadioRequired,
    FormFieldSliderNumber,
    FormFieldTextRequired,
    FormFieldVoucher,
  },
  setup() {
    // constants
    const defaultPaymentAmountMax = Number(
      rideToWorkByBikeConfig.entryFeePaymentMax,
    );
    const defaultPaymentAmountMin = Number(
      rideToWorkByBikeConfig.entryFeePaymentMin,
    );
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
    const { getPaletteColor, lighten } = colors;
    const primaryColor = getPaletteColor('primary');
    const primaryLightColor = lighten(primaryColor, 90);

    const optionsPaymentSubject: FormOption[] = reactive([
      {
        label: i18n.global.t(
          'register.challenge.labelPaymentSubjectIndividual',
        ),
        value: PaymentSubject.individual,
      },
      {
        label: i18n.global.t('register.challenge.labelPaymentSubjectVoucher'),
        value: PaymentSubject.voucher,
      },
      {
        label: i18n.global.t('register.challenge.labelPaymentSubjectCompany'),
        value: PaymentSubject.company,
      },
      {
        label: i18n.global.t('register.challenge.labelPaymentSubjectSchool'),
        value: PaymentSubject.school,
      },
    ]);

    const { formatPriceCurrency } = useFormatPrice();
    const defaultPaymentOption = {
      label: formatPriceCurrency(defaultPaymentAmountMin, Currency.CZK),
      value: String(defaultPaymentAmountMin),
    };
    // Build the optionsPaymentAmount array dynamically
    let paymentOptions: FormOption[] = [];
    try {
      paymentOptions = rideToWorkByBikeConfig.entryFeePaymentOptions
        .split(',')
        .map((option) => {
          if (isNaN(Number(option))) {
            throw new Error(`Invalid number: ${option}`);
          }
          return {
            label: formatPriceCurrency(Number(option), Currency.CZK),
            value: String(option),
          };
        });
    } catch (error) {
      Notify.create({
        message: `Error parsing entryFeePaymentOptions: ${error}`,
        type: 'negative',
      });
    }

    const optionsPaymentAmount: FormOption[] = reactive([
      defaultPaymentOption,
      ...paymentOptions,
      {
        label: i18n.global.t('global.custom'),
        value: PaymentAmount.custom,
      },
    ]);

    const activeVoucher = ref<FormPaymentVoucher | null>(null);
    const selectedPaymentAmount = ref<string>(String(defaultPaymentAmountMin));
    const selectedPaymentAmountCustom = ref<number>(defaultPaymentAmountMin);
    const paymentAmountMax = ref<number>(defaultPaymentAmountMax);
    const paymentAmountMin = ref<number>(defaultPaymentAmountMin);
    const selectedPaymentSubject = ref<string>('individual');
    const isEntryFeeFree = ref<boolean>(false);
    const selectedCompany = ref<string>('');
    const isRegistrationCoordinator = ref<boolean>(false);
    const formRegisterCoordinator = reactive({
      jobTitle: '',
      phone: '',
      responsibility: false,
      terms: false,
    });

    /**
     * Returns the payment amount based on the selected payment amount
     * or the custom value.
     */
    const paymentAmount = computed((): number => {
      if (selectedPaymentAmount.value === PaymentAmount.custom) {
        return selectedPaymentAmountCustom.value;
      }
      return parseInt(selectedPaymentAmount.value);
    });

    /**
     * After selecting a payment amount from the given options,
     * set it as the default value for custom payment amount.
     */
    watch(selectedPaymentAmount, (newValue) => {
      if (newValue !== PaymentAmount.custom) {
        selectedPaymentAmountCustom.value = parseInt(
          selectedPaymentAmount.value,
        );
      }
    });

    /**
     * Handles voucher submission.
     * Updates payment options, minimum payment amount and current payment amount.
     * if entry fee is free, display voluntary contribution.
     */
    const onUpdateVoucher = (voucher: FormPaymentVoucher): void => {
      if (voucher.code) {
        // set active voucher
        activeVoucher.value = voucher;
      }
      // amount = discounted price
      if (voucher.amount) {
        // discount the lowest price in the price options
        optionsPaymentAmount.shift();
        optionsPaymentAmount.unshift({
          label: formatPriceCurrency(voucher.amount, Currency.CZK),
          value: String(voucher.amount),
        });
        // set min amount for custom amount
        paymentAmountMin.value = voucher.amount;
        // if current value is not in new options, set it to discounted value
        const optionValues = optionsPaymentAmount.map((option) => option.value);
        if (!optionValues.includes(String(selectedPaymentAmount.value))) {
          selectedPaymentAmount.value = String(voucher.amount);
        }
      }
      // no amount = free entry
      else {
        isEntryFeeFree.value = true;
      }
    };

    /**
     * Removes voucher.
     * Updates payment options, minimum payment amount and current payment amount.
     * @return {void}
     */
    const onRemoveVoucher = (): void => {
      // clear active voucher
      activeVoucher.value = null;
      isEntryFeeFree.value = false;
      optionsPaymentAmount.shift();
      optionsPaymentAmount.unshift(defaultPaymentOption);
      paymentAmountMin.value = defaultPaymentAmountMin;
      // if current value is not in new options, set it to default value
      const optionValues = optionsPaymentAmount.map((option) => option.value);
      if (!optionValues.includes(String(selectedPaymentAmount.value))) {
        selectedPaymentAmount.value = String(defaultPaymentOption.value);
      }
    };

    return {
      activeVoucher,
      borderRadius,
      formRegisterCoordinator,
      isEntryFeeFree,
      isRegistrationCoordinator,
      optionsPaymentAmount,
      optionsPaymentSubject,
      paymentAmount,
      paymentAmountMax,
      paymentAmountMin,
      primaryLightColor,
      selectedCompany,
      selectedPaymentAmount,
      selectedPaymentAmountCustom,
      selectedPaymentSubject,
      PaymentSubject,
      onRemoveVoucher,
      onUpdateVoucher,
      PaymentAmount,
    };
  },
});
</script>

<template>
  <div data-cy="register-challenge-payment">
    <!-- Text: Challenge organizer -->
    <div
      v-html="$t('register.challenge.textPaymentOrganizer')"
      data-cy="text-payment-organizer"
    />
    <!-- Banner: Payment minimum -->
    <q-banner
      class="q-my-lg q-pa-md text-primary"
      :style="{ backgroundColor: primaryLightColor, borderRadius }"
      data-cy="banner-payment-minimum"
    >
      <div v-html="$t('register.challenge.textPaymentMinimum')" />
    </q-banner>
    <!-- Input: Payment subject -->
    <div class="q-my-lg">
      <!-- Label -->
      <label
        for="paymentType"
        class="text-caption text-weight-bold text-grey-10"
        data-cy="form-field-payment-subject-label"
      >
        {{ $t('register.challenge.labelPaymentSubject') }}
      </label>
      <!-- Radio group: Subject -->
      <form-field-radio-required
        inline
        id="paymentType"
        v-model="selectedPaymentSubject"
        :options="optionsPaymentSubject"
        class="q-mt-sm text-grey-10"
        data-cy="form-field-payment-subject"
      />
    </div>
    <!-- Input: Payment amount -->
    <div
      v-if="
        selectedPaymentSubject === PaymentSubject.individual ||
        (selectedPaymentSubject === PaymentSubject.voucher && !isEntryFeeFree)
      "
      class="q-my-md"
    >
      <!-- Label -->
      <label
        for="paymentAmount"
        class="text-caption text-weight-bold text-grey-10"
        data-cy="form-field-payment-amount-label"
      >
        {{ $t('register.challenge.labelPaymentAmount') }}
      </label>
      <!-- Radio group: Amount -->
      <form-field-radio-required
        inline
        id="paymentAmount"
        v-model="selectedPaymentAmount"
        :options="optionsPaymentAmount"
        class="q-mt-sm"
        data-cy="form-field-payment-amount"
      />
    </div>
    <!-- Input: Voucher -->
    <div v-if="selectedPaymentSubject === PaymentSubject.voucher">
      <form-field-voucher
        :active-voucher="activeVoucher"
        @update:voucher="onUpdateVoucher"
        @remove:voucher="onRemoveVoucher"
      />
    </div>
    <!-- Input: Company -->
    <div
      v-if="
        selectedPaymentSubject === PaymentSubject.company ||
        selectedPaymentSubject === PaymentSubject.school
      "
    >
      <q-separator class="q-my-lg" />
      <!-- Input: Company -->
      <form-field-company
        v-model="selectedCompany"
        class="text-grey-10"
        :label="$t('register.challenge.labelCompanyOrSchool')"
        data-cy="form-field-company"
      />
      <!-- Text: Company approval -->
      <p class="q-mt-lg text-grey-10" data-cy="payment-company-text">
        {{ $t('register.challenge.textOrganization') }}
      </p>
    </div>
    <!-- Input: Custom amount -->
    <div
      v-if="selectedPaymentAmount === PaymentAmount.custom && !isEntryFeeFree"
    >
      <form-field-slider-number
        v-model="selectedPaymentAmountCustom"
        :min="paymentAmountMin"
        :max="paymentAmountMax"
        class="text-grey-10"
        data-cy="form-field-payment-amount-custom"
      />
    </div>
    <!-- Input: Donation -->
    <div
      v-if="
        (selectedPaymentSubject === PaymentSubject.voucher && isEntryFeeFree) ||
        selectedPaymentSubject === PaymentSubject.company ||
        selectedPaymentSubject === PaymentSubject.school
      "
    >
      <form-field-donation class="q-mt-md" data-cy="form-field-donation" />
    </div>
    <!-- Section: Register coordinator -->
    <!-- TODO: Add condition - NO COORDINATOR IN SELECTED COMPANY -->
    <div
      v-if="selectedPaymentSubject === PaymentSubject.company"
      class="q-mt-md"
    >
      <!-- Checkbox: Register coordinator -->
      <q-checkbox
        dense
        v-model="isRegistrationCoordinator"
        color="primary"
        :true-value="true"
        :false-value="false"
        class="text-primary text-weight-bold"
        data-cy="register-coordinator-checkbox"
      >
        {{ $t('companyCoordinator.labelRegisterCoordinator') }}
      </q-checkbox>
      <div v-if="isRegistrationCoordinator">
        <div
          class="q-mt-lg"
          v-html="$t('companyCoordinator.textBecomeCoordinator')"
          data-cy="register-coordinator-text"
        />
        <!-- Section: Inputs -->
        <div class="row q-col-gutter-md q-mt-none">
          <!-- Input: job title -->
          <form-field-text-required
            v-model="formRegisterCoordinator.jobTitle"
            name="form-job-title"
            label="form.labelJobTitle"
            label-short="form.labelJobTitleShort"
            class="col-12 col-sm-6"
            data-cy="register-coordinator-job-title"
          />
          <!-- Input: phone -->
          <form-field-phone
            v-model="formRegisterCoordinator.phone"
            class="col-12 col-sm-6"
            data-cy="register-coordinator-phone"
          />
        </div>
        <!-- Input: confirm responsibility -->
        <div data-cy="register-coordinator-responsibility">
          <q-field
            dense
            borderless
            hide-bottom-space
            :model-value="formRegisterCoordinator.responsibility"
            :rules="[
              (val) =>
                !!val ||
                $t('register.coordinator.form.messageResponsibilityRequired'),
            ]"
          >
            <!-- Checkbox: responsibility -->
            <q-checkbox
              dense
              v-model="formRegisterCoordinator.responsibility"
              color="primary"
              :true-value="true"
              :false-value="false"
              class="text-grey-10"
            >
              <span>{{
                $t('register.coordinator.form.labelResponsibility')
              }}</span>
            </q-checkbox>
          </q-field>
        </div>
        <!-- Input: confirm consent -->
        <div class="q-mt-sm" data-cy="register-coordinator-terms">
          <q-field
            dense
            borderless
            hide-bottom-space
            :model-value="formRegisterCoordinator.terms"
            :rules="[
              (val) =>
                !!val || $t('register.coordinator.form.messageTermsRequired'),
            ]"
          >
            <!-- Checkbox: terms -->
            <q-checkbox
              dense
              id="form-register-coordinator-terms"
              v-model="formRegisterCoordinator.terms"
              color="primary"
              :true-value="true"
              :false-value="false"
              rules="required"
              class="text-grey-10"
            >
              <!-- Default slot: label -->
              <span>
                {{ $t('register.coordinator.form.labelPrivacyConsent') }}
                <!-- Link: terms -->
                <!-- TODO: Link to terms page -->
                <a href="#" target="_blank" class="text-primary">{{
                  $t('register.coordinator.form.linkPrivacyConsent')
                }}</a
                >.
              </span>
            </q-checkbox>
          </q-field>
        </div>
      </div>
    </div>
  </div>
</template>
