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
      >
        <q-step
          :name="1"
          :title="$t('register.challenge.titleStepPersonalDetails')"
          icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 42 42'%3E%3Ccircle cx='21' cy='21' r='21' fill='%2343449C' stroke='%23fff' stroke-width='3'/%3E%3Cpath fill='%23fff' d='M18.102 17.472V14.61h4.986v13.14h-3.204V17.472h-1.782Z'/%3E%3C/svg%3E"
          active-icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 42 42'%3E%3Ccircle cx='21' cy='21' r='21' fill='%2343449C' stroke='%23fff' stroke-width='3'/%3E%3Cpath fill='%23fff' d='M18.102 17.472V14.61h4.986v13.14h-3.204V17.472h-1.782Z'/%3E%3C/svg%3E"
          done-icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 38 38'%3E%3Crect width='38' height='38' fill='%23A0D7C4' rx='19'/%3E%3Cpath stroke='%2343449C' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m11.5 19 5 4.5 10-9'/%3E%3C/svg%3E"
          :done="step > 1"
          class="bg-white"
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
          icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 42 42'%3E%3Ccircle cx='21' cy='21' r='21' stroke='%23fff' stroke-width='3'/%3E%3Ccircle cx='21' cy='21' r='20' fill='%23fff' stroke='%2343449C' stroke-width='1.5'/%3E%3Cpath fill='%2343449C' d='M16.56 25.284a66.663 66.663 0 0 0 3.33-2.844 11.322 11.322 0 0 0 1.728-1.962c.468-.684.702-1.35.702-1.998 0-.492-.114-.876-.342-1.152-.228-.276-.57-.414-1.026-.414-.456 0-.816.174-1.08.522-.252.336-.378.816-.378 1.44h-2.97c.024-1.02.24-1.872.648-2.556.42-.684.966-1.188 1.638-1.512.684-.324 1.44-.486 2.268-.486 1.428 0 2.502.366 3.222 1.098.732.732 1.098 1.686 1.098 2.862 0 1.284-.438 2.478-1.314 3.582-.876 1.092-1.992 2.16-3.348 3.204h4.86v2.502H16.56v-2.286Z'/%3E%3C/svg%3E"
          active-icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 42 42'%3E%3Ccircle cx='21' cy='21' r='21' fill='%2343449C' /%3E%3Cpath fill='%23fff' d='M16.56 25.284a66.663 66.663 0 0 0 3.33-2.844 11.322 11.322 0 0 0 1.728-1.962c.468-.684.702-1.35.702-1.998 0-.492-.114-.876-.342-1.152-.228-.276-.57-.414-1.026-.414-.456 0-.816.174-1.08.522-.252.336-.378.816-.378 1.44h-2.97c.024-1.02.24-1.872.648-2.556.42-.684.966-1.188 1.638-1.512.684-.324 1.44-.486 2.268-.486 1.428 0 2.502.366 3.222 1.098.732.732 1.098 1.686 1.098 2.862 0 1.284-.438 2.478-1.314 3.582-.876 1.092-1.992 2.16-3.348 3.204h4.86v2.502H16.56v-2.286Z'/%3E%3C/svg%3E"
          done-icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 38 38'%3E%3Crect width='38' height='38' fill='%23A0D7C4' rx='19'/%3E%3Cpath stroke='%2343449C' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m11.5 19 5 4.5 10-9'/%3E%3C/svg%3E"
          :done="step > 2"
          class="bg-white q-mt-lg"
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
          icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 42 42'%3E%3Ccircle cx='21' cy='21' r='21' stroke='%23fff' stroke-width='3'/%3E%3Ccircle cx='21' cy='21' r='20' fill='%23fff' stroke='%2343449C' stroke-width='1.5'/%3E%3Cpath fill='%2343449C' d='M16.469 18.318c.048-1.284.468-2.274 1.26-2.97.792-.696 1.866-1.044 3.222-1.044.9 0 1.668.156 2.304.468.648.312 1.134.738 1.458 1.278a3.37 3.37 0 0 1 .504 1.818c0 .792-.198 1.44-.594 1.944-.396.492-.858.828-1.386 1.008v.072c.684.228 1.224.606 1.62 1.134.396.528.594 1.206.594 2.034 0 .744-.174 1.404-.522 1.98-.336.564-.834 1.008-1.494 1.332-.648.324-1.422.486-2.322.486-1.44 0-2.592-.354-3.456-1.062-.852-.708-1.302-1.776-1.35-3.204h2.988c.012.528.162.948.45 1.26.288.3.708.45 1.26.45.468 0 .828-.132 1.08-.396.264-.276.396-.636.396-1.08 0-.576-.186-.99-.558-1.242-.36-.264-.942-.396-1.746-.396H19.6v-2.502h.576c.612 0 1.104-.102 1.476-.306.384-.216.576-.594.576-1.134 0-.432-.12-.768-.36-1.008s-.57-.36-.99-.36c-.456 0-.798.138-1.026.414-.216.276-.342.618-.378 1.026h-3.006Z'/%3E%3C/svg%3E"
          active-icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 42 42'%3E%3Ccircle cx='21' cy='21' r='21' fill='%2343449C' stroke='%23fff' stroke-width='3'/%3E%3Cpath fill='%23fff' d='M16.469 18.318c.048-1.284.468-2.274 1.26-2.97.792-.696 1.866-1.044 3.222-1.044.9 0 1.668.156 2.304.468.648.312 1.134.738 1.458 1.278a3.37 3.37 0 0 1 .504 1.818c0 .792-.198 1.44-.594 1.944-.396.492-.858.828-1.386 1.008v.072c.684.228 1.224.606 1.62 1.134.396.528.594 1.206.594 2.034 0 .744-.174 1.404-.522 1.98-.336.564-.834 1.008-1.494 1.332-.648.324-1.422.486-2.322.486-1.44 0-2.592-.354-3.456-1.062-.852-.708-1.302-1.776-1.35-3.204h2.988c.012.528.162.948.45 1.26.288.3.708.45 1.26.45.468 0 .828-.132 1.08-.396.264-.276.396-.636.396-1.08 0-.576-.186-.99-.558-1.242-.36-.264-.942-.396-1.746-.396H19.6v-2.502h.576c.612 0 1.104-.102 1.476-.306.384-.216.576-.594.576-1.134 0-.432-.12-.768-.36-1.008s-.57-.36-.99-.36c-.456 0-.798.138-1.026.414-.216.276-.342.618-.378 1.026h-3.006Z'/%3E%3C/svg%3E"
          done-icon="img:data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 38 38'%3E%3Crect width='38' height='38' fill='%23A0D7C4' rx='19'/%3E%3Cpath stroke='%2343449C' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m11.5 19 5 4.5 10-9'/%3E%3C/svg%3E"
          :done="step > 3"
          class="bg-white q-mt-lg"
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
              flat
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
