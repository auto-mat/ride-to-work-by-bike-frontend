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
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed within the `LoginLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6385%3A26514&mode=dev)
 */

// libraries
import { defineComponent, ref } from 'vue';
import { QForm, QStepper } from 'quasar';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// components
import FormFieldOptionGroup from 'src/components/form/FormFieldOptionGroup.vue';
import FormPersonalDetails from 'src/components/form/FormPersonalDetails.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

// composables
import { useStepperValidation } from 'src/composables/useStepperValidation';

// types
import type { FormPersonalDetailsFields } from 'src/components/types/Form';

export default defineComponent({
  name: 'RegisterChallengePage',
  components: {
    FormFieldOptionGroup,
    FormPersonalDetails,
    LoginRegisterHeader,
  },
  setup() {
    const challengeMonth = rideToWorkByBikeConfig.challengeMonth;
    const containerWidth = rideToWorkByBikeConfig.containerWidth;
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

    const personalDetails = ref<FormPersonalDetailsFields>({
      firstName: '',
      lastName: '',
      nickname: '',
      gender: '',
      email: '',
      newsletter: [],
      terms: false,
    });

    const participation = ref<string>('');

    const step = ref(1);
    const stepperRef = ref<typeof QStepper | null>(null);
    const stepCompanyRef = ref<typeof QForm | null>(null);
    const stepParticipationRef = ref<typeof QForm | null>(null);
    const stepPaymentRef = ref<typeof QForm | null>(null);
    const stepPersonalDetailsRef = ref<typeof QForm | null>(null);

    const { onBack, onContinue } = useStepperValidation({
      step,
      stepperRef,
      stepCompanyRef,
      stepParticipationRef,
      stepPaymentRef,
      stepPersonalDetailsRef,
    });

    return {
      challengeMonth,
      containerWidth,
      step,
      stepperRef,
      stepCompanyRef,
      stepPaymentRef,
      stepParticipationRef,
      stepPersonalDetailsRef,
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
      participation,
      personalDetails,
      onBack,
      onContinue,
    };
  },
});
</script>

<template>
  <q-page padding class="bg-secondary">
    <div class="q-px-lg">
      <!-- Page header -->
      <login-register-header data-cy="login-register-header" />

      <!-- Container -->
      <div class="q-mx-auto q-mt-xl" :style="{ 'max-width': containerWidth }">
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
          vertical
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
            class="bg-white"
            data-cy="step-1"
          >
            <q-form ref="stepPersonalDetailsRef">
              <form-personal-details
                :form-values="personalDetails"
                @update:form-values="personalDetails = $event"
              />
            </q-form>
            <q-stepper-navigation>
              <q-btn
                unelevated
                rounded
                color="primary"
                :label="$t('navigation.continue')"
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
            class="bg-white q-mt-lg"
            data-cy="step-2"
          >
            <q-form ref="stepPaymentRef"> Content of step 2 </q-form>
            <q-stepper-navigation>
              <q-btn
                unelevated
                rounded
                color="primary"
                :label="$t('navigation.continue')"
                @click="onContinue"
                data-cy="step-2-continue"
              />
              <q-btn
                unelevated
                rounded
                outline
                color="primary"
                class="q-ml-sm"
                :label="$t('navigation.back')"
                @click="onBack"
                data-cy="step-2-back"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Participation -->
          <q-step
            :name="3"
            :title="$t('register.challenge.titleStepParticipation')"
            :icon="iconImgSrcStepper3"
            :active-icon="activeIconImgSrcStepper3"
            :done-icon="doneIconImgSrcStepper3"
            :done="step > 3"
            class="bg-white q-mt-lg"
            data-cy="step-3"
          >
            <q-form ref="stepParticipationRef">
              <p class="q-mb-md">
                {{ $t('form.participation.titleParticipation') }}
              </p>
              <form-field-option-group
                v-model="participation"
                name="participation"
                label="form.labelParticipation"
              />
              <p class="q-mt-lg q-mb-none">
                {{ $t('form.participation.hintPariticipation') }}
              </p>
            </q-form>
            <q-stepper-navigation>
              <q-btn
                unelevated
                rounded
                @click="onContinue"
                color="primary"
                :label="$t('navigation.continue')"
                data-cy="step-3-continue"
              />
              <q-btn
                unelevated
                rounded
                outline
                @click="step = 2"
                color="primary"
                :label="$t('navigation.back')"
                class="q-ml-sm"
                data-cy="step-3-back"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Company -->
          <q-step
            :name="4"
            :title="$t('register.challenge.titleStepCompany')"
            :icon="iconImgSrcStepper4"
            :active-icon="activeIconImgSrcStepper4"
            :done-icon="doneIconImgSrcStepper4"
            :done="step > 4"
            class="bg-white q-mt-lg"
            data-cy="step-4"
          >
            <q-form ref="stepCompanyRef"> Content of step 4 </q-form>
            <q-stepper-navigation>
              <q-btn
                unelevated
                rounded
                color="primary"
                :label="$t('navigation.continue')"
                data-cy="step-4-continue"
              />
              <q-btn
                unelevated
                rounded
                outline
                @click="onContinue"
                color="primary"
                :label="$t('navigation.back')"
                class="q-ml-sm"
                data-cy="step-4-back"
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
</style>
