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
import HelpButton from 'components/HelpButton.vue';
import LanguageSwitcher from 'components/LanguageSwitcher.vue';

export default defineComponent({
  name: 'RegisterChallengePage',
  components: {
    HelpButton,
    LanguageSwitcher,
  },
  setup() {
    const step = ref(1);

    return {
      step,
      rideToWorkByBikeConfig,
    };
  },
});
</script>

<template>
  <q-page padding class="bg-secondary">
    <div class="q-px-lg">
      <!-- Page header -->
      <!-- TODO: Extract into a component -->
      <div class="flex items-center justify-between q-py-lg">
        <!-- RTWBB logo -->
        <img
          class="logo"
          src="~assets/svg/logo.svg"
          :alt="$t('index.logoAltText')"
          :title="$t('header.siteTitle')"
          data-cy="logo"
        />
        <div class="flex items-center gap-32">
          <!-- Help icon link for displaying modal dialog -->
          <help-button size="13px" color="primary" />
          <!-- Language switcher -->
          <language-switcher variant="light" />
        </div>
      </div>
      <q-stepper
        v-model="step"
        vertical
        color="primary"
        class="bg-transparent"
        style="box-shadow: none"
        animated
        data-cy="stepper"
      >
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
            />
          </q-stepper-navigation>
        </q-step>

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
            />
            <q-btn
              unelevated
              rounded
              outline
              @click="step = 1"
              color="primary"
              :label="$t('navigation.back')"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          :title="$t('register.challenge.titleStepParticipation')"
          icon="img:src/assets/svg/numeric-3-outline.svg"
          active-icon="img:src/assets/svg/numeric-3-fill.svg"
          :done="step > 3"
          class="bg-white q-mt-lg"
          data-cy="step-3"
        >
          Content of step 3

          <q-stepper-navigation>
            <q-btn
              unelevated
              rounded
              color="primary"
              :label="$t('navigation.continue')"
            />
            <q-btn
              unelevated
              rounded
              outline
              @click="step = 2"
              color="primary"
              :label="$t('navigation.back')"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.logo {
  height: 80px;
}
// hide vertical line
:deep(.q-stepper--vertical .q-stepper__dot:before),
:deep(.q-stepper--vertical .q-stepper__dot:after) {
  display: none;
}
// rounded corners
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
// step title
:deep(.q-stepper__title) {
  color: $grey-10;
  font-size: 16px;
  font-weight: 700;
}
</style>
