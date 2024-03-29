<script lang="ts">
/**
 * OnboardingStepper Component
 *
 * @description * Use this component to display an onboarding widget.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `FormInviteFriends`: Component to render form for inviting friends.
 *
 * @example
 * <onboarding-stepper />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105047&mode=dev)
 */

// libraries
import { QStepper } from 'quasar';
import { defineComponent, ref } from 'vue';

// components
import FormInviteFriends from 'components/form/FormInviteFriends.vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

export default defineComponent({
  name: 'OnboardingStepper',
  components: {
    FormInviteFriends,
  },
  setup() {
    const step = ref<number>(1);
    const stepper = ref<InstanceType<typeof QStepper> | null>(null);

    const iconSize = 18;

    const { urlVideoOnboarding } = rideToWorkByBikeConfig;

    return {
      iconSize,
      step,
      stepper,
      urlVideoOnboarding,
    };
  },
});
</script>

<template>
  <q-stepper
    animated
    keep-alive
    v-model="step"
    ref="stepper"
    color="primary"
    header-class="hidden"
    style="max-width: 800px"
    data-cy="onboarding-stepper"
  >
    <!-- Step: Video -->
    <q-step
      :name="1"
      title="Select campaign settings"
      icon="settings"
      :done="step > 1"
    >
      <div data-cy="onboading-step1">
        <h2
          class="text-h5 text-weight-bold text-black q-my-none"
          data-cy="step1-title"
        >
          {{ $t('onboarding.titleStep1') }}
        </h2>
        <p
          v-html="$t('onboarding.descriptionStep1')"
          class="text-subtitle2 text-grey-10 q-mt-lg"
          data-cy="step1-description"
        />
        <div class="q-mt-lg" data-cy="step1-video">
          <q-video :ratio="16 / 9" :src="urlVideoOnboarding" />
        </div>
      </div>
    </q-step>

    <!-- Step: Add friends -->
    <q-step
      :name="2"
      title="Create an ad group"
      icon="create_new_folder"
      :done="step > 2"
    >
      <div data-cy="onboading-step2">
        <h2
          class="text-h5 text-weight-bold text-black q-my-none"
          data-cy="step2-title"
        >
          {{ $t('onboarding.titleStep2') }}
        </h2>
        <form-invite-friends class="q-mt-lg" data-cy="form-invite-friends" />
      </div>
    </q-step>

    <!-- Bottom navigation buttons between stepper pages -->
    <template v-slot:navigation>
      <q-stepper-navigation>
        <template v-if="step === 1">
          <div class="full-width flex items-center justify-between">
            <q-btn
              outline
              unelevated
              rounded
              color="primary"
              :label="$t('navigation.skip')"
              data-cy="button-skip"
            />
            <q-btn
              outline
              unelevated
              rounded
              color="primary"
              :label="$t('navigation.continue')"
              @click="stepper?.next()"
              data-cy="button-continue"
            >
              <q-icon name="arrow_forward" :size="iconSize" class="q-ml-sm" />
            </q-btn>
          </div>
        </template>
        <template v-if="step === 2">
          <div class="full-width flex items-center justify-between">
            <q-btn
              outline
              unelevated
              rounded
              color="primary"
              @click="stepper?.previous()"
              data-cy="button-back"
            >
              <q-icon name="arrow_back" :size="iconSize" class="q-mr-sm" />
              {{ $t('navigation.back') }}
            </q-btn>
            <q-btn
              unelevated
              rounded
              color="primary"
              :label="$t('navigation.done')"
              data-cy="button-done"
            >
            </q-btn>
          </div>
        </template>
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<style lang="scss">
// remove shadow from steps
.q-stepper {
  box-shadow: none;
}
</style>
