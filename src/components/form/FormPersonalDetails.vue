<script lang="ts">
/**
 * FormPersonalDetails Component
 *
 * The `FormPersonalDetails`
 *
 * @description * Use this component to display contact details form.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @props
 * - `modelValue` (Object, required): Reactive object representing form state.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render name, surname, nickname...
 * - `FormFieldRadioRequired`: Component to render gender radio buttons.
 *
 * @example
 * <form-personal-details />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A102976&mode=dev)
 */

import { defineComponent, nextTick } from 'vue';

// components
import FormFieldTextRequired from 'components/global/FormFieldTextRequired.vue';

// types
import {
  FormOption,
  FormPersonalDetailsFields,
} from 'src/components/types/Form';

export default defineComponent({
  name: 'FormPersonalDetails',
  components: {
    FormFieldTextRequired,
  },
  props: {
    formValues: {
      type: Object as () => FormPersonalDetailsFields,
      required: true,
    },
  },
  emits: ['update:formValues'],
  setup(props, { emit }) {
    const personalDetails: FormPersonalDetailsFields = props.formValues;

    const newsletterOptions: FormOption[] = [
      {
        label: 'form.personalDetails.labelNewsletterAll',
        value: 'all',
      },
      {
        label: 'form.personalDetails.labelNewsletterChallenges',
        value: 'challenges',
      },
      {
        label: 'form.personalDetails.labelNewsletterEvents',
        value: 'events',
      },
      {
        label: 'form.personalDetails.labelNewsletterMobility',
        value: 'mobility',
      },
    ];

    const genderOptions: FormOption[] = [
      {
        label: 'global.man',
        value: 'male',
      },
      {
        label: 'global.woman',
        value: 'female',
      },
    ];

    const onUpdate = (): void => {
      // wait for next tick to emit the value after update
      nextTick((): void => {
        emit('update:formValues', personalDetails);
      });
    };

    return {
      genderOptions,
      newsletterOptions,
      personalDetails,
      onUpdate,
    };
  },
});
</script>

<template>
  <div>
    <div class="row q-col-gutter-md">
      <!-- Input: First name -->
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.firstName"
          name="firstName"
          label="form.labelFirstName"
          autocomplete="given-name"
          @update:model-value="onUpdate"
          data-cy="form-personal-details-first-name"
        />
      </div>
      <!-- Input: Last name -->
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.lastName"
          name="lastName"
          label="form.labelLastName"
          autocomplete="family-name"
          @update:model-value="onUpdate"
          data-cy="form-personal-details-last-name"
        />
      </div>
      <!-- Input: Nickname -->
      <div class="col-12">
        <div data-cy="form-personal-details-nickname">
          <label
            for="form-nickname"
            class="text-grey-10 text-caption text-bold"
          >
            {{ $t('form.labelNicknameOptional') }}
          </label>
          <q-input
            dense
            outlined
            type="text"
            v-model="personalDetails.nickname"
            name="nickname"
            :hint="$t('form.hintNickname')"
            id="form-nickname"
            class="q-mt-sm"
            @change="onUpdate"
          />
        </div>
      </div>
      <!-- Input: Gender -->
      <div class="col-12" data-cy="form-personal-details-gender">
        <!-- Label -->
        <label for="form-gender" class="text-grey-10 text-caption text-bold">
          {{ $t('form.personalDetails.titleGender') }}
        </label>
        <!-- Radio group -->
        <q-option-group
          dense
          inline
          id="form-gender"
          v-model="personalDetails.gender"
          :options="genderOptions"
          :rules="[(val: string) => !!val || $t('form.messageOptionRequired')]"
          color="primary"
          type="radio"
          class="q-gutter-md q-mt-xs"
          data-cy="form-gender-input"
        >
          <!-- Default slot: label (used so that label is translated dynamically) -->
          <template v-slot:label="option">
            {{ $t(option.label) }}
          </template>
        </q-option-group>
      </div>
      <!-- Input: Newsletter -->
      <div class="col-12" data-cy="form-personal-details-newsletter">
        <!-- Label -->
        <label for="form-gender" class="text-grey-10 text-caption text-bold">
          {{ $t('form.personalDetails.titleNewsletter') }}
        </label>
        <!-- Checkbox group -->
        <q-option-group
          dense
          v-model="personalDetails.newsletter"
          :options="newsletterOptions"
          color="primary"
          type="checkbox"
          class="q-gutter-md q-mt-xs"
          data-cy="form-newsletter-input"
        >
          <!-- Default slot: label (used so that label is translated dynamically) -->
          <template v-slot:label="option">
            {{ $t(option.label) }}
          </template>
        </q-option-group>
      </div>
      <!-- Input: confirm consent -->
      <div class="col-12" data-cy="form-personal-details-terms">
        <q-field
          dense
          borderless
          hide-bottom-space
          :model-value="personalDetails.terms"
          :rules="[(val) => !!val || $t('form.messageTermsRequired')]"
        >
          <q-checkbox
            dense
            id="form-personal-details-terms"
            v-model="personalDetails.terms"
            color="primary"
            :true-value="true"
            :false-value="false"
            rules="required"
            class="text-grey-10"
            data-cy="form-terms-input"
          >
            <!-- Default slot: label -->
            <span>
              {{ $t('form.labelTerms') }}
              <!-- Link: terms -->
              <!-- TODO: Link to terms page -->
              <a href="#" target="_blank" class="text-primary">{{
                $t('form.linkTerms')
              }}</a
              >.
            </span>
          </q-checkbox>
        </q-field>
      </div>
    </div>
  </div>
</template>
