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
 *
 * @example
 * <onboarding-stepper />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105047&mode=dev)
 */

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'OnboardingStepper',
  setup() {
    const step = ref<number>(1);

    return {
      step,
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
    data-cy="onboarding-stepper"
  >
    <!-- Step: Video -->
    <q-step
      :name="1"
      title="Select campaign settings"
      icon="settings"
      :done="step > 1"
      :style="{ 'max-width': '560px' }"
    >
      <div>
        <h2
          class="text-h5 text-weight-bold text-black q-my-none"
          data-cy="step1-title"
        >
          {{ $t('onboarding.step1.title') }}
        </h2>
        <p
          v-html="$t('onboarding.step1.description')"
          class="text-subtitle2 q-mt-lg"
          data-cy="step1-description"
        />
        <div class="q-mt-lg">
          <q-video
            :ratio="16 / 9"
            src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
          />
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
      <div>
        <h2
          class="text-h5 text-weight-bold text-black q-my-none"
          data-cy="step1-title"
        >
          {{ $t('onboarding.step2.title') }}
        </h2>
      </div>
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation>
        <template v-if="step === 1"> </template>
        <template v-if="step === 2"> </template>
        <q-btn
          @click="$refs.stepper.next()"
          color="primary"
          :label="step === 4 ? 'Finish' : 'Continue'"
        />
        <q-btn
          v-if="step > 1"
          flat
          color="primary"
          @click="$refs.stepper.previous()"
          label="Back"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<style lang="scss">
// hide vertical line between steps
.q-stepper {
  box-shadow: none;
}
</style>
