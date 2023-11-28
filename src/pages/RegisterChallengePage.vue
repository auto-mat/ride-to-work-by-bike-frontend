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

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// components
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'RegisterChallengePage',
  components: {
    LoginRegisterHeader,
  },
  setup() {
    const step = ref(1);

    const challengeMonth = rideToWorkByBikeConfig.challengeMonth;
    const containerWidth = rideToWorkByBikeConfig.containerWidth;

    return {
      challengeMonth,
      containerWidth,
      step,
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
          v-model="step"
          vertical
          color="primary"
          class="bg-transparent q-py-none q-mt-lg"
          style="box-shadow: none"
          animated
          data-cy="stepper"
        >
          <!-- Step: Personal details -->
          <q-step
            :name="1"
            :title="$t('register.challenge.titleStepPersonalDetails')"
            icon="img:src/assets/svg/numeric-1-outline.svg"
            active-icon="img:src/assets/svg/numeric-1-fill.svg"
            done-icon="img:src/assets/svg/check.svg"
            :done="step > 1"
            class="bg-white"
            data-cy="step-1"
          >
            Content of step 1
            <q-stepper-navigation>
              <q-btn
                unelevated
                rounded
                @click="step = 2"
                color="primary"
                :label="$t('navigation.continue')"
                data-cy="step-1-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Payment -->
          <q-step
            :name="2"
            :title="$t('register.challenge.titleStepPayment')"
            icon="img:src/assets/svg/numeric-2-outline.svg"
            active-icon="img:src/assets/svg/numeric-2-fill.svg"
            done-icon="img:src/assets/svg/check.svg"
            :done="step > 2"
            class="bg-white q-mt-lg"
            data-cy="step-2"
          >
            Content of step 2
            <q-stepper-navigation>
              <q-btn
                unelevated
                rounded
                @click="step = 3"
                color="primary"
                :label="$t('navigation.continue')"
                data-cy="step-2-continue"
              />
              <q-btn
                unelevated
                rounded
                outline
                @click="step = 1"
                color="primary"
                :label="$t('navigation.back')"
                class="q-ml-sm"
                data-cy="step-2-back"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Participation -->
          <q-step
            :name="3"
            :title="$t('register.challenge.titleStepParticipation')"
            icon="img:src/assets/svg/numeric-3-outline.svg"
            active-icon="img:src/assets/svg/numeric-3-fill.svg"
            done-icon="img:src/assets/svg/check.svg"
            :done="step > 3"
            class="bg-white q-mt-lg"
            data-cy="step-3"
          >
            Content of step 3
            <q-stepper-navigation>
              <q-btn
                unelevated
                rounded
                @click="step = 4"
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
            icon="img:src/assets/svg/numeric-4-outline.svg"
            active-icon="img:src/assets/svg/numeric-4-fill.svg"
            done-icon="img:src/assets/svg/check.svg"
            :done="step > 4"
            class="bg-white q-mt-lg"
            data-cy="step-4"
          >
            Content of step 4
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
                @click="step = 3"
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
