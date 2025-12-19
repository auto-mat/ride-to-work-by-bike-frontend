<script lang="ts">
/**
 * RegisterChallengePage Component
 *
 * The `RegisterChallengePage` displays registration process for each challenge
 *
 * @description * Use this component to allow users to register for an
 * individual challenge.
 *
 * @components
 * - `FormFieldSelectTable`: Component to render company select widget.
 * - `FormFieldListMerch`: Component to render list of merch options.
 * - `FormFieldOptionGroup`: Component to render radio buttons.
 * - `FormPersonalDetails`: Component to render personal details form.
 * - `FormSelectOrganization`: Component to render organization select widget.
 * - `LoginRegisterHeader`: Component to render page header.
 * - `TopBarCountdown`: Component to display countdown.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6385%3A26514&mode=dev)
 */

// libraries
import { computed, defineComponent, onMounted, ref } from 'vue';
import { QForm, QStepper, colors } from 'quasar';
import { useRouter } from 'vue-router';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
import { routesConf } from '../router/routes_conf';

// components
import FormFieldListMerch from 'src/components/form/FormFieldListMerch.vue';
import FormFieldOptionGroup from 'src/components/form/FormFieldOptionGroup.vue';
import FormPersonalDetails from 'src/components/form/FormPersonalDetails.vue';
import FormSelectOrganization from 'src/components/form/FormSelectOrganization.vue';
import FormSelectTeam from 'src/components/form/FormSelectTeam.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';
import RegisterChallengePayment from 'src/components/register/RegisterChallengePayment.vue';
import RegisterChallengeSummary from 'src/components/register/RegisterChallengeSummary.vue';
import ShowOrganizationIds from 'src/components/debug/ShowOrganizationIds.vue';
import TopBarCountdown from 'src/components/global/TopBarCountdown.vue';
import RegisterChallengePaymentMessages from '../components/register/RegisterChallengePaymentMessages.vue';

// composables
import { useStepperValidation } from 'src/composables/useStepperValidation';
import { useOrganizations } from 'src/composables/useOrganizations';
import { useCompetitionPhase } from 'src/composables/useCompetitionPhase';

// enums
import { OrganizationType } from 'src/components/types/Organization';
import { PaymentState, PaymentSubject } from 'src/components/enums/Payment';
import { RegisterChallengeStep } from 'src/components/enums/RegisterChallenge';

// stores
import { useChallengeStore } from 'src/stores/challenge';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

export default defineComponent({
  name: 'RegisterChallengePage',
  components: {
    FormFieldListMerch,
    FormFieldOptionGroup,
    FormPersonalDetails,
    FormSelectOrganization,
    FormSelectTeam,
    LoginRegisterHeader,
    RegisterChallengePayment,
    RegisterChallengeSummary,
    ShowOrganizationIds,
    TopBarCountdown,
    RegisterChallengePaymentMessages,
  },
  setup() {
    const challengeMonth = rideToWorkByBikeConfig.challengeMonth;
    const containerFormWidth = rideToWorkByBikeConfig.containerFormWidth;
    const urlDonateJanuaryChallenge =
      rideToWorkByBikeConfig.urlDonateJanuaryChallenge;
    const doneIcon = `img:${
      new URL('../assets/svg/check.svg', import.meta.url).href
    }`;
    // Stepper 1 imgs
    const iconImgSrcStepper1 = `img:${
      new URL('../assets/svg/numeric-1-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper1 = `img:${
      new URL('../assets/svg/numeric-1-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper1 = doneIcon;
    // Stepper 2 imgs
    const iconImgSrcStepper2 = `img:${
      new URL('../assets/svg/numeric-2-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper2 = `img:${
      new URL('../assets/svg/numeric-2-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper2 = doneIcon;
    // Stepper 3 imgs
    const iconImgSrcStepper3 = `img:${
      new URL('../assets/svg/numeric-3-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper3 = `img:${
      new URL('../assets/svg/numeric-3-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper3 = doneIcon;
    // Stepper 4 imgs
    const iconImgSrcStepper4 = `img:${
      new URL('../assets/svg/numeric-4-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper4 = `img:${
      new URL('../assets/svg/numeric-4-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper4 = doneIcon;
    // Stepper 5 imgs
    const iconImgSrcStepper5 = `img:${
      new URL('../assets/svg/numeric-5-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper5 = `img:${
      new URL('../assets/svg/numeric-5-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper5 = doneIcon;
    // Stepper 6 imgs
    const iconImgSrcStepper6 = `img:${
      new URL('../assets/svg/numeric-6-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper6 = `img:${
      new URL('../assets/svg/numeric-6-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper6 = doneIcon;
    // Stepper 7 imgs
    const iconImgSrcStepper7 = `img:${
      new URL('../assets/svg/numeric-7-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper7 = `img:${
      new URL('../assets/svg/numeric-7-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper7 = doneIcon;

    const challengeStore = useChallengeStore();
    const registerChallengeStore = useRegisterChallengeStore();
    const competitionStart = computed(() => challengeStore.getCompetitionStart);

    const isPayuTransactionInitiated = computed(
      () => registerChallengeStore.getIsPayuTransactionInitiated,
    );

    const router = useRouter();

    onMounted(async () => {
      // check if user is organization admin
      if (registerChallengeStore.getIsUserOrganizationAdmin === null) {
        await registerChallengeStore.checkIsUserOrganizationAdmin();
      }
      // make sure price level is loaded
      if (!challengeStore.getPriceLevel.length) {
        await challengeStore.loadPhaseSet();
      }
      await registerChallengeStore.loadRegisterChallengeToStore();
      /**
       * Depending on whether payment is successful,
       * and isPayuTransactionInitiated flag
       * we determine if situation is:
       * - refreshing page after returning from payment
       * - returning to a started payment
       */

      // set isPayuTransactionInitiated to `true` for specific set of tests
      if (
        window.Cypress?.currentTest?.title.includes('set-is-paid-from-ui-true')
      ) {
        registerChallengeStore.setIsPayuTransactionInitiated(true);
      }

      if (
        isPayuTransactionInitiated.value &&
        registerChallengeStore.getIsPaymentSuccessful
      ) {
        // entry-fee/donation was paid - go to payment step
        onContinue();
      } else if (
        isPayuTransactionInitiated.value &&
        !registerChallengeStore.getIsPaymentSuccessful
      ) {
        // trigger a periodic registration data refetch + display message
        registerChallengeStore.startRegisterChallengePeriodicCheck();
        // go to payment step
        onContinue();
      } else if (
        !isPayuTransactionInitiated.value &&
        registerChallengeStore.getIsPaymentSuccessful
      ) {
        // if payment is done, it should always be safe to continue
        onContinue();
      }
      // handle redirect for completed registration
      if (registerChallengeStore.getIsRegistrationComplete) {
        if (router) {
          router.push(routesConf['home']['path']);
        }
      }
    });

    const organizationType = computed({
      get: (): OrganizationType => registerChallengeStore.getOrganizationType,
      set: (value: OrganizationType) => {
        registerChallengeStore.setOrganizationType(value);
      },
    });

    const merchId = computed(
      (): number | null => registerChallengeStore.getMerchId,
    );

    const { getOrganizationLabels } = useOrganizations();
    const organizationStepTitle = computed(() => {
      return getOrganizationLabels(
        registerChallengeStore.getOrganizationType || OrganizationType.company,
      ).labelShort;
    });

    const step = ref(1);
    const stepperRef = ref<typeof QStepper | null>(null);
    const stepCompanyRef = ref<typeof QForm | null>(null);
    const stepParticipationRef = ref<typeof QForm | null>(null);
    const stepPaymentRef = ref<typeof QForm | null>(null);
    const stepPersonalDetailsRef = ref<typeof QForm | null>(null);
    const stepTeamRef = ref<typeof QForm | null>(null);
    const stepMerchRef = ref<typeof QForm | null>(null);
    const { onBack, onContinue } = useStepperValidation({
      step,
      stepperRef,
      stepCompanyRef,
      stepParticipationRef,
      stepPaymentRef,
      stepPersonalDetailsRef,
      stepTeamRef,
      stepMerchRef,
    });

    const onCompleteRegistration = () => {
      if (router) {
        router.push(routesConf['home']['path']);
      }
    };

    // Payment-related logic
    const isPaymentAmount = computed<boolean>((): boolean => {
      return (
        !!registerChallengeStore.getPaymentAmount &&
        registerChallengeStore.getPaymentAmount > 0
      );
    });

    /**
     * Show create order button if:
     * - payment state is not not yet successful and paymentAmount > 0
     */
    const isShownCreateOrderButton = computed<boolean>((): boolean => {
      return (
        !registerChallengeStore.getIsPaymentSuccessful &&
        !!isPaymentAmount.value
      );
    });

    const isShownPaymentNextStepButton = computed<boolean>((): boolean => {
      return !isShownCreateOrderButton.value;
    });

    /**
     * Explicit conditions for enabling a pass
     * - paymentState is successful
     * - paymentSubject = company or school
     * - paymentSubject = voucher and voucher discount = 100
     */
    const isEnabledPaymentNextStepButton = computed(() => {
      const paymentSubject = registerChallengeStore.getPaymentSubject;
      const voucher = registerChallengeStore.getVoucher;
      // conditions
      const isPaymentDone = registerChallengeStore.getIsPaymentSuccessful;
      const isPaymentCompanyOrSchool =
        registerChallengeStore.getIsPaymentSubjectOrganization;
      const isVoucherFreeEntry =
        paymentSubject === PaymentSubject.voucher &&
        voucher?.valid &&
        voucher?.discount === 100;
      // composite condition
      return (
        isPaymentDone ||
        (isPaymentCompanyOrSchool && !isPaymentAmount.value) ||
        isVoucherFreeEntry
      );
    });

    const isPeriodicCheckInProgress = computed<boolean>(
      () => registerChallengeStore.getIsPeriodicCheckInProgress,
    );

    const isLoadingPayuOrder = computed(() => {
      return registerChallengeStore.isLoadingPayuOrder;
    });

    const isLoadingRegisterChallenge = computed(() => {
      return registerChallengeStore.isLoadingRegisterChallenge;
    });

    const onSubmitPayment = async () => {
      /**
       * If payment subject is voucher, we need to submit the payment step
       * before creating the PayU order. This will ensure that voucher
       * data is stored in the registration
       */
      if (registerChallengeStore.getPaymentSubject === PaymentSubject.voucher) {
        if (!stepPaymentRef.value) return;
        // validate payment step
        const isValidPayment: boolean = await stepPaymentRef.value.validate();
        if (isValidPayment) {
          await registerChallengeStore.submitStep(
            RegisterChallengeStep.payment,
          );
        }
      }
      // create PayU order
      await registerChallengeStore.createPayuOrder();
    };

    const contactEmail = rideToWorkByBikeConfig.contactEmail;
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
    const { getPaletteColor, lighten } = colors;
    const primaryColor = getPaletteColor('primary');
    const primaryLightColor = lighten(primaryColor, 90);

    const isRegistrationEntryFeePaidViaPayu = computed((): boolean => {
      const isEntryFeePaid =
        registerChallengeStore.getIsPaymentSuccessful &&
        registerChallengeStore.getIsPaymentCategoryEntryFee;
      const isNoAdmission =
        registerChallengeStore.getPaymentState === PaymentState.noAdmission;
      return isEntryFeePaid || isNoAdmission;
    });

    const isPriceLevelEmpty = computed(
      (): boolean => challengeStore.getPriceLevel.length === 0,
    );

    const isRegistrationComplete = computed(
      (): boolean => registerChallengeStore.getIsRegistrationComplete,
    );

    const secondsToWaitDef = ref(
      rideToWorkByBikeConfig.checkRegisterChallengeStatusMaxRepetitions *
        rideToWorkByBikeConfig.checkRegisterChallengeStatusIntervalSeconds,
    );

    const secondsToWait = computed(() => {
      return secondsToWaitDef;
    });

    const payCheckWaitLoadingTimer = setInterval(() => {
      if (secondsToWaitDef.value <= 0 || !isPeriodicCheckInProgress.value) {
        clearInterval(payCheckWaitLoadingTimer);
      }
      secondsToWaitDef.value -= 1;
    }, 1000);

    const { isBeforeCompetitionStart } = useCompetitionPhase();

    const hostnameUrlDonateJanuaryChallenge = new URL(
      urlDonateJanuaryChallenge,
    );

    return {
      borderRadius,
      contactEmail,
      challengeMonth,
      containerFormWidth,
      step,
      stepperRef,
      stepCompanyRef,
      stepPaymentRef,
      stepParticipationRef,
      stepPersonalDetailsRef,
      stepTeamRef,
      stepMerchRef,
      iconImgSrcStepper1,
      activeIconImgSrcStepper1,
      doneIconImgSrcStepper1,
      iconImgSrcStepper2,
      activeIconImgSrcStepper2,
      doneIconImgSrcStepper2,
      iconImgSrcStepper3,
      activeIconImgSrcStepper3,
      doneIconImgSrcStepper3,
      iconImgSrcStepper4,
      activeIconImgSrcStepper4,
      doneIconImgSrcStepper4,
      iconImgSrcStepper5,
      activeIconImgSrcStepper5,
      doneIconImgSrcStepper5,
      iconImgSrcStepper6,
      activeIconImgSrcStepper6,
      doneIconImgSrcStepper6,
      iconImgSrcStepper7,
      activeIconImgSrcStepper7,
      doneIconImgSrcStepper7,
      merchId,
      isBeforeCompetitionStart,
      isPaymentAmount,
      isPeriodicCheckInProgress,
      isPriceLevelEmpty,
      isRegistrationComplete,
      isRegistrationEntryFeePaidViaPayu,
      isShownCreateOrderButton,
      isShownPaymentNextStepButton,
      isEnabledPaymentNextStepButton,
      isLoadingPayuOrder,
      isLoadingRegisterChallenge,
      onSubmitPayment,
      organizationType,
      organizationStepTitle,
      onBack,
      onContinue,
      onCompleteRegistration,
      primaryLightColor,
      registerChallengeStore,
      competitionStart,
      secondsToWait,
      urlDonateJanuaryChallenge,
      hostnameUrlDonateJanuaryChallenge,
    };
  },
});
</script>

<template>
  <top-bar-countdown
    v-if="isBeforeCompetitionStart"
    :release-date="competitionStart"
    data-cy="top-bar-countdown"
  />
  <q-page padding>
    <div class="q-px-lg">
      <!-- Page header -->
      <login-register-header data-cy="login-register-header" />
      <!-- Container -->
      <div
        class="q-mx-auto q-mt-xl"
        :style="{ 'max-width': containerFormWidth }"
      >
        <show-organization-ids />
        <!-- Page title -->
        <h1
          class="text-h5 text-bold text-white q-my-none"
          data-cy="login-register-title"
        >
          {{
            $t(`register.challenge.titleRegisterToChallenge.${challengeMonth}`)
          }}
        </h1>

        <q-stepper
          animated
          header-nav
          vertical
          keep-alive
          ref="stepperRef"
          v-model="step"
          color="primary"
          class="bg-transparent q-py-none q-mt-lg"
          style="box-shadow: none"
          data-cy="stepper"
        >
          <!-- Step: Personal details -->
          <q-step
            :name="1"
            :title="$t('register.challenge.titleStepPersonalDetails')"
            :icon="iconImgSrcStepper1"
            :active-icon="activeIconImgSrcStepper1"
            :done-icon="doneIconImgSrcStepper1"
            :done="step > 1"
            :header-nav="step > 1"
            class="bg-white"
            data-cy="step-1"
          >
            <q-form ref="stepPersonalDetailsRef">
              <form-personal-details data-cy="form-personal-details" />
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                color="primary"
                :label="$t('navigation.continue')"
                :loading="isLoadingRegisterChallenge"
                @click="onContinue"
                data-cy="step-1-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Payment -->
          <q-step
            :name="2"
            :title="$t('register.challenge.titleStepPayment')"
            :icon="iconImgSrcStepper2"
            :active-icon="activeIconImgSrcStepper2"
            :done-icon="doneIconImgSrcStepper2"
            :done="step > 2"
            :header-nav="step > 2"
            class="relative-position bg-white q-mt-lg"
            data-cy="step-2"
          >
            <!-- Form: Payment -->
            <q-form ref="stepPaymentRef">
              <!-- Payment messages -->
              <register-challenge-payment-messages
                :is-payment-step="true"
                data-cy="payment-messages"
              />
              <!-- Banner: Free registration (shown ONLY when priceLevel is empty) -->
              <q-banner
                v-if="isPriceLevelEmpty"
                class="q-pa-md text-primary"
                :style="{ backgroundColor: primaryLightColor, borderRadius }"
                data-cy="banner-free-registration"
              >
                <div
                  v-html="
                    $t('register.challenge.textFreeRegistration', {
                      url: urlDonateJanuaryChallenge,
                      linkText: hostnameUrlDonateJanuaryChallenge.hostname,
                    })
                  "
                  data-cy="text-free-registration"
                />
              </q-banner>
              <template v-if="!isPriceLevelEmpty">
                <!-- Text entry fee paid (displayed after PayU payment has been made) -->
                <div
                  v-if="isRegistrationEntryFeePaidViaPayu"
                  v-html="
                    $t('register.challenge.textRegistrationPaid', {
                      contactEmail,
                    })
                  "
                  data-cy="step-2-paid-message"
                />
                <!-- Payment form -->
                <register-challenge-payment
                  v-if="!isRegistrationEntryFeePaidViaPayu"
                />
              </template>
            </q-form>
            <!-- Navigation -->
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                color="primary"
                :label="$t('navigation.back')"
                :disable="isLoadingRegisterChallenge || isLoadingPayuOrder"
                @click="onBack"
                data-cy="step-2-back"
              />
              <q-btn
                v-if="isShownCreateOrderButton"
                unelevated
                rounded
                color="primary"
                :disable="!isPaymentAmount"
                :label="$t('register.challenge.buttonSubmitPayment')"
                :loading="isLoadingRegisterChallenge || isLoadingPayuOrder"
                @click="onSubmitPayment"
                class="q-ml-sm"
                data-cy="step-2-submit-payment"
              />
              <q-btn
                v-if="isShownPaymentNextStepButton"
                unelevated
                rounded
                color="primary"
                :disable="!isEnabledPaymentNextStepButton"
                :label="$t('navigation.continue')"
                :loading="isLoadingRegisterChallenge"
                @click="onContinue"
                class="q-ml-sm"
                data-cy="step-2-continue"
              />
            </q-stepper-navigation>
            <!-- Loader -->
            <q-inner-loading
              :showing="isPeriodicCheckInProgress"
              color="primary"
              :label="
                $t('register.challenge.textWaitingForPaymentLoader', {
                  seconds: secondsToWait.value,
                })
              "
              label-class="text-primary"
              label-style="max-width: 200px; font-weight: 600;"
              data-cy="waiting-for-payment-loader"
            />
          </q-step>
          <!-- Step: Organization type -->
          <q-step
            :name="3"
            :title="$t('register.challenge.titleStepParticipation')"
            :icon="iconImgSrcStepper3"
            :active-icon="activeIconImgSrcStepper3"
            :done-icon="doneIconImgSrcStepper3"
            :done="step > 3"
            :header-nav="step > 3"
            class="bg-white q-mt-lg"
            data-cy="step-3"
          >
            <q-form ref="stepParticipationRef">
              <p class="q-mb-md">
                {{ $t('form.participation.titleParticipation') }}
              </p>
              <form-field-option-group
                name="participation"
                label="form.labelParticipation"
              />
              <p class="q-mt-lg q-mb-none">
                {{ $t('form.participation.hintPariticipation') }}
              </p>
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                :disable="isLoadingRegisterChallenge"
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                data-cy="step-3-back"
              />
              <q-btn
                unelevated
                rounded
                @click="onContinue"
                color="primary"
                :label="$t('navigation.continue')"
                :loading="isLoadingRegisterChallenge"
                class="q-ml-sm"
                data-cy="step-3-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Company -->
          <q-step
            :name="4"
            :title="organizationStepTitle"
            :icon="iconImgSrcStepper4"
            :active-icon="activeIconImgSrcStepper4"
            :done-icon="doneIconImgSrcStepper4"
            :done="step > 4"
            :header-nav="step > 4"
            class="bg-white q-mt-lg"
            data-cy="step-4"
          >
            <q-form ref="stepCompanyRef">
              <form-select-organization />
            </q-form>
            <q-stepper-navigation>
              <div class="flex justify-end">
                <q-btn
                  unelevated
                  rounded
                  outline
                  @click="onBack"
                  color="primary"
                  :disable="isLoadingRegisterChallenge"
                  :label="$t('navigation.back')"
                  data-cy="step-4-back"
                />
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  :label="$t('navigation.continue')"
                  :loading="isLoadingRegisterChallenge"
                  @click="onContinue"
                  class="q-ml-sm"
                  data-cy="step-4-continue"
                />
              </div>
              <div
                class="flex items-center gap-8 q-mt-md"
                data-cy="step-4-info"
              >
                <q-icon name="info" size="18px" color="primary" />
                <p class="q-mt-none q-mb-none text-caption text-grey-7">
                  {{ $t('form.company.textCoordinator') }}
                </p>
              </div>
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Team -->
          <q-step
            :name="5"
            :title="$t('register.challenge.titleStepTeam')"
            :icon="iconImgSrcStepper5"
            :active-icon="activeIconImgSrcStepper5"
            :done-icon="doneIconImgSrcStepper5"
            :done="step > 5"
            :header-nav="step > 5"
            class="bg-white q-mt-lg"
            data-cy="step-5"
          >
            <q-form ref="stepTeamRef">
              <form-select-team data-cy="form-select-team" />
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                :disable="isLoadingRegisterChallenge"
                data-cy="step-5-back"
              />
              <q-btn
                unelevated
                rounded
                color="primary"
                :label="$t('navigation.continue')"
                :loading="isLoadingRegisterChallenge"
                @click="onContinue"
                class="q-ml-sm"
                data-cy="step-5-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Merch -->
          <q-step
            :name="6"
            :title="$t('register.challenge.titleStepMerch')"
            :icon="iconImgSrcStepper6"
            :active-icon="activeIconImgSrcStepper6"
            :done-icon="doneIconImgSrcStepper6"
            :done="step > 6"
            :header-nav="step > 6"
            class="bg-white q-mt-lg"
            data-cy="step-6"
          >
            <q-form ref="stepMerchRef">
              <form-field-list-merch />
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                :disable="isLoadingRegisterChallenge"
                data-cy="step-6-back"
              />
              <q-btn
                unelevated
                rounded
                color="primary"
                :disable="!merchId"
                :loading="isLoadingRegisterChallenge"
                :label="$t('navigation.continue')"
                @click="onContinue"
                class="q-ml-sm"
                data-cy="step-6-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Summary -->
          <q-step
            :name="7"
            :title="$t('register.challenge.titleStepSummary')"
            :icon="iconImgSrcStepper7"
            :active-icon="activeIconImgSrcStepper7"
            :done-icon="doneIconImgSrcStepper7"
            :done="step > 7"
            :header-nav="step > 7"
            class="bg-white q-mt-lg"
            data-cy="step-7"
          >
            <register-challenge-payment-messages data-cy="summary-messages" />
            <!-- Content: Summary -->
            <register-challenge-summary />
            <!-- Buttons: Summary -->
            <q-stepper-navigation class="flex justify-end">
              <!-- Button: Back -->
              <q-btn
                unelevated
                rounded
                outline
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                data-cy="step-7-back"
              />
              <!-- Button: Complete registration -->
              <q-btn
                v-if="isRegistrationComplete"
                unelevated
                rounded
                color="primary"
                :label="$t('form.buttonCompleteRegistration')"
                @click="onCompleteRegistration"
                class="q-ml-sm"
                data-cy="step-7-continue"
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
// hide vertical line between steps
:deep(.q-stepper--vertical .q-stepper__dot:before),
:deep(.q-stepper--vertical .q-stepper__dot:after) {
  display: none;
}
// add rounded corners
:deep(.q-stepper__step) {
  border-radius: 16px;
}
// override step padding
:deep(.q-stepper__tab) {
  padding: 24px 24px;
}
:deep(.q-stepper__step-inner) {
  padding: 8px 24px 24px;
}
// override separate rule for last step padding
:deep(.q-stepper--vertical .q-stepper__step:last-child .q-stepper__step-inner) {
  padding-bottom: 24px;
}
// larger step dot (number)
:deep(.q-stepper__dot) {
  font-size: 38px;
  width: 38px;
  height: 38px;
  max-width: 38px;
  background-color: #fff;
  margin-right: 16px;
}
// larger step title
:deep(.q-stepper__title) {
  color: $grey-10;
  font-size: 16px;
  font-weight: 700;
}
:deep(.q-stepper__tab--done) {
  padding-right: 48px;
}
:deep(.q-stepper__tab--done:after) {
  content: '';
  position: absolute;
  background-image: url('../assets/svg/edit.svg');
  width: 24px;
  height: 24px;
  right: 24px;
}
</style>
