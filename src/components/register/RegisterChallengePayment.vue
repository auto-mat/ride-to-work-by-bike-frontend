<script lang="ts">
/**
 * RegisterChallengePayment Component
 *
 * @description * Use this component to render a payment widget for the
 * registration process.
 * Options for payment amount are set in the config file as
 * `entryFeePaymentMax` and `entryFeePaymentOptions`.
 * The minimum payment amount is set from API in the challenge store.
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
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';

// composables
import { i18n } from '../../boot/i18n';
import { defaultLocale } from '../../i18n/def_locale';
import { useFormatPrice } from '../../composables/useFormatPrice';

// components
import FormFieldCompany from '../global/FormFieldCompany.vue';
import FormFieldDonation from '../form/FormFieldDonation.vue';
import FormFieldPhone from '../global/FormFieldPhone.vue';
import FormFieldRadioRequired from '../form/FormFieldRadioRequired.vue';
import FormFieldSliderNumber from '../form/FormFieldSliderNumber.vue';
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldVoucher from '../form/FormFieldVoucher.vue';

import { defaultPaymentAmountMinComputed } from '../../utils/price_levels';
import { defaultPaymentAmountMinComputedWithReward } from '../../utils/price_levels_with_reward';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { Currency } from '../../composables/useFormatPrice';
import { PaymentAmount, PaymentSubject } from '../enums/Payment';
import { OrganizationType } from '../types/Organization';

// stores
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { FormOption } from '../types/Form';
import type { Logger } from '../types/Logger';
import type { ValidatedCoupon } from '../types/Coupon';

import { getApiBaseUrlWithLang } from '../../utils/get_api_base_url_with_lang';

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
    const logger = inject('vuejs3-logger') as Logger | null;
    const challengeStore = useChallengeStore();
    const registerChallengeStore = useRegisterChallengeStore();

    // constants
    const defaultPaymentAmountMax = parseInt(
      rideToWorkByBikeConfig.entryFeePaymentMax,
    );
    logger?.debug(`Default max. payment amount <${defaultPaymentAmountMax}>.`);
    // get default min price from store with merch preference
    const defaultPaymentAmountMin = computed(() => {
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
    logger?.debug(
      `Default min. payment amount basic <${defaultPaymentAmountMin.value}>.`,
    );

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
    const { getPaletteColor, lighten } = colors;
    const primaryColor = getPaletteColor('primary');
    const primaryLightColor = lighten(primaryColor, 90);

    const optionsPaymentSubject = computed((): FormOption[] => {
      return [
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
      ];
    });
    logger?.debug(
      `Default payment subject options <${JSON.stringify(optionsPaymentSubject.value, null, 2)}>` +
        ` for <${i18n.global.t('register.challenge.labelPaymentSubject')}>` +
        'radio button element.',
    );

    const { formatPriceCurrency } = useFormatPrice();

    // Build the optionsPaymentAmount array dynamically
    let paymentOptions: FormOption[] = [];
    try {
      paymentOptions = rideToWorkByBikeConfig.entryFeePaymentOptions
        .split(',')
        .map((option) => {
          if (isNaN(parseInt(option))) {
            throw new Error(
              i18n.global.t(
                'register.challenge.parseEntryFeePaymentOptionsInvalidNumberError',
                {
                  value: option,
                },
              ),
            );
          }
          return {
            label: formatPriceCurrency(parseInt(option), Currency.CZK),
            value: String(option),
          };
        });
    } catch (error) {
      Notify.create({
        message: i18n.global.t(
          'register.challenge.parseEntryFeePaymentOptionsError',
          {
            error: error,
          },
        ),
        type: 'negative',
      });
    }

    const activeVoucher = computed<ValidatedCoupon | null>(() => {
      return registerChallengeStore.getVoucher;
    });
    // Model for 'Entry fee amount' radio button element must be string type (options values '390', ..., 'custom')
    const selectedPaymentAmount = ref<string>(
      String(defaultPaymentAmountMin.value),
    );
    // Model for 'Entry fee amount' radio button element custom option slider element
    const selectedPaymentAmountCustom = ref<number>(
      defaultPaymentAmountMin.value,
    );
    const donationAmount = ref<number>(0);
    const paymentAmountMax = ref<number>(defaultPaymentAmountMax);
    const paymentAmountMin = ref<number>(defaultPaymentAmountMin.value);

    // with-reward toggle state
    const isPaymentWithReward = computed<boolean>({
      get: (): boolean => registerChallengeStore.getIsPaymentWithReward,
      set: (value: boolean): void => {
        registerChallengeStore.switchPriceSet(value);
      },
    });
    // init organization admin status
    const hasOrganizationAdmin = computed<boolean | null>(() => {
      return registerChallengeStore.getHasOrganizationAdmin;
    });
    const isUserOrganizationAdmin = computed<boolean | null>(() => {
      return registerChallengeStore.getIsUserOrganizationAdmin;
    });
    //  Model for 'Entry fee payment' radio button element
    const selectedPaymentSubject = computed<PaymentSubject>({
      get: (): PaymentSubject => registerChallengeStore.getPaymentSubject,
      set: (value: PaymentSubject): void =>
        registerChallengeStore.setPaymentSubject(value),
    });
    // selected company links directly to store organizationId
    const selectedCompany = computed<number | null>({
      get: (): number | null =>
        registerChallengeStore.getOrganizationId
          ? registerChallengeStore.getOrganizationId
          : null,
      set: (value: number | null) => {
        if (value !== registerChallengeStore.getOrganizationId) {
          // reset subsidiaryId
          registerChallengeStore.setSubsidiaryId(null);
          // reset teamId
          registerChallengeStore.setTeamId(null);
          // reset organizationId
          registerChallengeStore.setOrganizationId(value);
          // refetch subsidiaries
          registerChallengeStore.loadSubsidiariesToStore(logger);
          // check if organization has coordinator
          registerChallengeStore.checkOrganizationHasCoordinator();
        }
      },
    });
    onMounted(() => {
      registerChallengeStore.checkOrganizationHasCoordinator();
    });
    const isRegistrationCoordinator = computed<boolean>({
      get: (): boolean =>
        registerChallengeStore.getIsSelectedRegisterCoordinator,
      set: (value: boolean): void =>
        registerChallengeStore.setIsSelectedRegisterCoordinator(value),
    });
    const formRegisterCoordinator = reactive({
      jobTitle: '',
      phone: '',
      responsibility: false,
      terms: false,
    });
    // sync formRegisterCoordinator values with store
    watch(
      formRegisterCoordinator,
      (newVal) => {
        registerChallengeStore.setFormRegisterCoordinator(newVal);
      },
      { deep: true },
    );

    watch(selectedPaymentSubject, (newVal, oldVal) => {
      logger?.debug(
        `Selected payment subject changed from <${oldVal}> to <${newVal}>.`,
      );
      switch (newVal) {
        case PaymentSubject.company:
          registerChallengeStore.setOrganizationType(OrganizationType.company);
          break;
        case PaymentSubject.school:
          registerChallengeStore.setOrganizationType(OrganizationType.school);
          break;
        default:
          registerChallengeStore.setOrganizationType(OrganizationType.none);
      }
      logger?.debug(
        'Set store organization type to' +
          ` <${registerChallengeStore.getOrganizationType}>.`,
      );
      // when switching payment subject, always clear the organizationId
      selectedCompany.value = null;
    });
    const organizationType = computed<OrganizationType>(() => {
      return registerChallengeStore.getOrganizationType;
    });

    const isVoucherValid = computed((): boolean => {
      return !!activeVoucher.value?.valid;
    });
    const isVoucherFreeEntry = computed((): boolean => {
      if (activeVoucher.value?.discount && isVoucherValid.value) {
        return activeVoucher.value?.discount === 100;
      }
      return false;
    });
    const isVoucherDiscountedEntry = computed((): boolean => {
      if (activeVoucher.value?.discount && isVoucherValid.value) {
        return (
          activeVoucher.value?.discount > 0 &&
          activeVoucher.value?.discount < 100
        );
      }
      return false;
    });

    const onUpdateDonation = (amount: number): void => {
      donationAmount.value = amount;
      logger?.debug(`Set donation amount <${donationAmount.value}>.`);
    };

    const optionsPaymentAmountComputed = computed((): FormOption[] => {
      logger?.debug(
        'Compute payment amount options for' +
          ` <${i18n.global.t('register.challenge.labelPaymentAmount')}>` +
          ' radio button element.',
      );
      let opts: FormOption[] = [];
      if (
        selectedPaymentSubject.value === PaymentSubject.voucher &&
        isVoucherFreeEntry.value
      ) {
        logger?.debug(
          `Selected payment subject <${selectedPaymentSubject.value}>,` +
            ` is voucher free entry <${isVoucherFreeEntry.value}>.`,
        );
        opts = [];
      } else if (
        selectedPaymentSubject.value === PaymentSubject.voucher &&
        isVoucherValid.value &&
        activeVoucher.value?.discount
      ) {
        const discountAmount: number =
          (defaultPaymentAmountMin.value * activeVoucher.value?.discount) / 100;
        const discountedAmount: number = Math.round(
          defaultPaymentAmountMin.value - discountAmount,
        );
        logger?.debug(
          `Selected payment subject <${selectedPaymentSubject.value}>,` +
            ` is voucher valid <${isVoucherValid.value}>,` +
            ` active voucher amount <${discountedAmount}>.`,
        );
        opts = [
          {
            label: formatPriceCurrency(discountedAmount, Currency.CZK),
            value: String(discountedAmount),
          },
          // other options
          ...paymentOptions,
          // custom option
          {
            label: i18n.global.t('global.custom'),
            value: PaymentAmount.custom,
          },
        ];
      } else if (
        [
          PaymentSubject.company,
          PaymentSubject.school,
          PaymentSubject.voucher,
        ].includes(selectedPaymentSubject.value)
      ) {
        logger?.debug(
          `Selected payment subject <${selectedPaymentSubject.value}>.`,
        );
        opts = [];
      } else if (selectedPaymentSubject.value === PaymentSubject.individual) {
        logger?.debug(
          `Selected payment subject <${selectedPaymentSubject.value}>.`,
        );
        opts = [
          // min option
          {
            label: formatPriceCurrency(
              defaultPaymentAmountMin.value,
              Currency.CZK,
            ),
            value: String(defaultPaymentAmountMin.value),
          },
          // other options
          ...paymentOptions,
          // custom option
          {
            label: i18n.global.t('global.custom'),
            value: PaymentAmount.custom,
          },
        ];
      }
      logger?.debug(
        `Computed payment amount options <${JSON.stringify(opts, null, 2)}> for` +
          ` <${i18n.global.t('register.challenge.labelPaymentAmount')}>` +
          ' radio button element.',
      );
      return opts;
    });

    watch(
      optionsPaymentAmountComputed,
      (options) => {
        const optsVals = options.map((option) => option.value);
        logger?.debug(
          `Computed payment subject option change to <${selectedPaymentSubject.value}>` +
            ` for <${i18n.global.t('register.challenge.labelPaymentSubject')}> radio element` +
            ` and amount options changed to <${optsVals}> for` +
            ` <${i18n.global.t('register.challenge.labelPaymentAmount')}>` +
            ' radio button element.',
        );
        // New payment options include currently selected amount
        const newPaymentOptionsIncludeSelectedAmount = optsVals.includes(
          selectedPaymentAmount.value,
        );
        // Selected payment amount is custom
        const isSelectedAmountCustom =
          selectedPaymentAmount.value === PaymentAmount.custom;

        // Reset custom payment amount to first option to update slider min value
        if (isSelectedAmountCustom && optsVals.length > 0) {
          logger?.debug(
            `Selected payment amount is <${selectedPaymentAmountCustom.value}>,` +
              ` reset it to the first option <${optsVals[0]}>.`,
          );
          selectedPaymentAmount.value = String(optsVals[0]);
        }
        // New payment options include selected amount
        else if (newPaymentOptionsIncludeSelectedAmount) {
          logger?.debug(
            'New payment options include selected payment amount' +
              ` <${selectedPaymentAmount.value}>, selected payment` +
              ` amount is the same <${selectedPaymentAmount.value}>.`,
          );
        }
        // New payment options do not include selected amount
        else if (!newPaymentOptionsIncludeSelectedAmount) {
          selectedPaymentAmount.value = String(optsVals[0]);
          logger?.debug(
            'New payment options do not include selected payment amount' +
              ` <${selectedPaymentAmount.value}>, set new selected payment` +
              ` amount to <${selectedPaymentAmount.value}>.`,
          );
        }
        // No payment options, clear selected amount value
        else if (optsVals.length === 0) {
          selectedPaymentAmount.value = '';
          logger?.debug(
            'No payment options for payment amount, set selected amount to' +
              ` <${selectedPaymentAmount.value}>.`,
          );
        }
        logger?.debug(
          `New selected payment amount <${selectedPaymentAmount.value}> for` +
            ` <${i18n.global.t('register.challenge.labelPaymentAmount')}>` +
            ' radio button element.',
        );
      },
      { immediate: true },
    );

    /**
     * Set selected custom payment amount model value
     * for 'Entry fee amount' radio button element
     * custom option slider element, must be integer type
     *
     * @param {string} val - Input string integer value e.g. '390'
     *
     * @returns void
     */
    const setSelectedPaymentAmountCustomVal = (val: string): void => {
      selectedPaymentAmountCustom.value = parseInt(val);
    };

    /**
     * After selecting a payment amount from the given options,
     * set it as the default value for custom payment amount.
     */
    watch(
      selectedPaymentAmount,
      (newVal, oldVal) => {
        logger?.debug(
          `Selected payment amount option changed from <${oldVal}>` +
            ` to <${newVal}> for <${i18n.global.t('register.challenge.labelPaymentAmount')}>` +
            ' radio button element.',
        );
        if (newVal !== PaymentAmount.custom) {
          setSelectedPaymentAmountCustomVal(selectedPaymentAmount.value);
          logger?.debug(
            `Set new value <${selectedPaymentAmountCustom.value}> with` +
              ` type <${typeof selectedPaymentAmountCustom.value}> for` +
              ` <${i18n.global.t('register.challenge.labelPaymentAmount')}>` +
              ' radio button element custom option slider element.',
          );
        }
      },
      { immediate: true },
    );

    /**
     * Compute current value based on selected payment subject, amount option and donation
     * @returns {number}
     */
    const computedCurrentValue = computed<number>((): number => {
      switch (selectedPaymentSubject.value) {
        case PaymentSubject.individual:
          logger?.debug(
            `Selected payment subject <${selectedPaymentSubject.value}>,` +
              ` computed current value <${selectedPaymentAmountCustom.value || 0}>.`,
          );
          return selectedPaymentAmountCustom.value || 0;
        case PaymentSubject.voucher:
          if (isVoucherFreeEntry.value) {
            logger?.debug(
              `Selected payment subject <${selectedPaymentSubject.value}>,` +
                ` voucher free entry <${isVoucherFreeEntry.value}>,` +
                ` computed current value <${donationAmount.value || 0}>.`,
            );
            return donationAmount.value || 0;
          } else if (isVoucherValid.value) {
            logger?.debug(
              `Selected payment subject <${selectedPaymentSubject.value}>,` +
                ` computed current value <${selectedPaymentAmountCustom.value || 0}>.`,
            );
            // entry is not free so user selects amount
            return selectedPaymentAmountCustom.value || 0;
          } else {
            // if there is no valid voucher, amount to pay is 0
            return 0;
          }
        case PaymentSubject.company:
        case PaymentSubject.school:
          logger?.debug(
            `Selected payment subject <${selectedPaymentSubject.value}>,` +
              ` computed current value <${donationAmount.value || 0}>.`,
          );
          return donationAmount.value || 0;
        default:
          logger?.debug(
            `Selected payment subject <${selectedPaymentSubject.value}>,` +
              ` computed current value <${0}>.`,
          );
          return 0;
      }
    });
    // track current computed value in store
    watch(
      computedCurrentValue,
      (newVal) => {
        logger?.debug(`Setting store payment amount to <${newVal}>.`);
        registerChallengeStore.setPaymentAmount(newVal);
      },
      { immediate: true },
    );

    const showVoucherElement = () => {
      const show = selectedPaymentSubject.value === PaymentSubject.voucher;
      logger?.debug(`Show voucher element <${show}>.`);
      return show;
    };

    const showPaymentAmountOptionsElement = () => {
      const show = optionsPaymentAmountComputed.value.length > 0;
      logger?.debug(
        `Show payment amount options <${show}> element for` +
          ` <${i18n.global.t('register.challenge.labelPaymentAmount')}> radio button element.`,
      );
      return show;
    };

    const showCompanySchoolElement = () => {
      const show = [PaymentSubject.company, PaymentSubject.school].includes(
        selectedPaymentSubject.value,
      );
      logger?.debug(
        `Show <${selectedPaymentSubject.value}> element <${show}> for` +
          ` selected <${i18n.global.t('register.challenge.labelPaymentSubject')}>` +
          ` radio button element <${selectedPaymentSubject.value}> option.`,
      );
      return show;
    };

    const showCustomPaymentAmountElement = () => {
      const show =
        ((selectedPaymentSubject.value === PaymentSubject.voucher &&
          isVoucherDiscountedEntry.value) ||
          selectedPaymentSubject.value !== PaymentSubject.voucher) &&
        selectedPaymentAmount.value === PaymentAmount.custom;
      logger?.debug(
        `Show custom payment amount <${show}> slider element for` +
          ` <${i18n.global.t('register.challenge.labelPaymentAmount')}>,` +
          ` radio button element with selected <${selectedPaymentAmount.value}> option.`,
      );
      return show;
    };

    const showDonationElement = () => {
      const show =
        (selectedPaymentSubject.value === PaymentSubject.voucher &&
          isVoucherFreeEntry.value) ||
        [PaymentSubject.company, PaymentSubject.school].includes(
          selectedPaymentSubject.value,
        );
      logger?.debug(
        `Show donation element <${show}> for` +
          ` <${i18n.global.t('register.challenge.labelPaymentSubject')}>,` +
          ` radio button element with selected <${selectedPaymentSubject.value}> option.`,
      );
      return show;
    };

    const showOrganizationAdminElement = computed<boolean>(() => {
      const isCorrectPaymentSubject = [
        PaymentSubject.company,
        PaymentSubject.school,
      ].includes(selectedPaymentSubject.value);
      if (hasOrganizationAdmin.value === null) return false;
      if (isUserOrganizationAdmin.value === null) return false;
      const hasOrganizationCoordinator = hasOrganizationAdmin.value === true;
      const isUserCoordinator = isUserOrganizationAdmin.value === true;
      const show =
        isCorrectPaymentSubject &&
        !hasOrganizationCoordinator &&
        !isUserCoordinator;
      logger?.debug(
        `Show organization admin element <${show}>,` +
          ` for payment subject <${selectedPaymentSubject.value}>,` +
          ` and organization has admin <${hasOrganizationCoordinator}>.` +
          ` and user is coordinator <${isUserCoordinator}>`,
      );
      return show;
    });

    // TODO: Update `FormFieldCompany` to use data from `registerChallenge` store.
    const selectedOrganizationName = computed<string>(
      () => registerChallengeStore.getSelectedOrganizationLabel,
    );

    const urlAppDataPrivacyPolicy = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlAppDataPrivacyPolicy,
        defaultLocale,
        i18n,
      );
    });

    return {
      borderRadius,
      computedCurrentValue,
      defaultPaymentAmountMin,
      donationAmount,
      formRegisterCoordinator,
      hasOrganizationAdmin,
      isPaymentWithReward,
      isRegistrationCoordinator,
      optionsPaymentAmountComputed,
      optionsPaymentSubject,
      organizationType,
      paymentAmountMax,
      paymentAmountMin,
      primaryLightColor,
      selectedCompany,
      selectedOrganizationName,
      selectedPaymentAmount,
      selectedPaymentAmountCustom,
      selectedPaymentSubject,
      urlAppDataPrivacyPolicy,
      Currency,
      formatPriceCurrency,
      onUpdateDonation,
      showCompanySchoolElement,
      showCustomPaymentAmountElement,
      showDonationElement,
      showOrganizationAdminElement,
      showPaymentAmountOptionsElement,
      showVoucherElement,
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
      <div
        v-html="
          $t('register.challenge.textPaymentMinimum', {
            amount: formatPriceCurrency(defaultPaymentAmountMin, Currency.CZK),
          })
        "
      />
    </q-banner>
    <!-- Checkbox: With reward toggle -->
    <div class="q-my-lg">
      <q-checkbox
        dense
        v-model="isPaymentWithReward"
        color="primary"
        :true-value="true"
        :false-value="false"
        class="text-grey-10"
        data-cy="checkbox-payment-with-reward"
      >
        {{ $t('register.challenge.labelPaymentWithReward') }}
      </q-checkbox>
    </div>
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
    <!-- Input: Voucher -->
    <div v-if="showVoucherElement()">
      <form-field-voucher />
    </div>
    <!-- Input: Payment amount -->
    <div v-if="showPaymentAmountOptionsElement()" class="q-my-md">
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
        :options="optionsPaymentAmountComputed"
        class="q-mt-sm"
        data-cy="form-field-payment-amount"
      />
    </div>
    <!-- Input: Company -->
    <div v-if="showCompanySchoolElement()">
      <q-separator class="q-my-lg" />
      <!-- Input: Company -->
      <form-field-company
        v-model="selectedCompany"
        :organization-type="organizationType"
        class="text-grey-10"
        data-cy="form-field-company"
      />
      <!-- Text: Company approval -->
      <p
        class="q-mt-lg text-grey-10"
        data-cy="payment-company-text"
        v-html="$t('register.challenge.textOrganization')"
      />
    </div>
    <!-- Input: Custom amount -->
    <div v-if="showCustomPaymentAmountElement()">
      <form-field-slider-number
        v-model="selectedPaymentAmountCustom"
        :min="paymentAmountMin"
        :max="paymentAmountMax"
        class="text-grey-10"
        data-cy="form-field-payment-amount-custom"
      />
    </div>
    <!-- Input: Donation -->
    <div v-if="showDonationElement()">
      <form-field-donation
        class="q-mt-md"
        @update:donation="onUpdateDonation"
        data-cy="form-field-donation"
      />
    </div>
    <!-- Section: Register coordinator -->
    <div v-if="showOrganizationAdminElement" class="q-mt-md">
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
          v-html="
            $t('companyCoordinator.textBecomeCoordinator', {
              organizationName: selectedOrganizationName,
            })
          "
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
                <a
                  :href="urlAppDataPrivacyPolicy"
                  target="_blank"
                  class="text-primary"
                  @click.stop
                  data-cy="form-terms-link"
                >
                  {{ $t('register.coordinator.form.linkPrivacyConsent') }} </a
                >.
              </span>
            </q-checkbox>
          </q-field>
        </div>
      </div>
    </div>
    <!-- Section: Total price -->
    <template v-if="computedCurrentValue">
      <q-separator class="q-my-lg" />
      <div class="flex gap-8 items-baseline" data-cy="total-price">
        <span class="text-grey-8" data-cy="total-price-label">
          {{ $t('global.total') }}:
        </span>
        <span
          class="text-h5 text-grey-10 text-weight-bold"
          data-cy="total-price-value"
        >
          {{ formatPriceCurrency(computedCurrentValue, Currency.CZK) }}
        </span>
      </div>
    </template>
  </div>
</template>
