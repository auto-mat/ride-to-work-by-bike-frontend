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

export type FormPersonalDetailsFields = {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  gender: string;
  newsletter: string[];
  terms: boolean;
};

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

    const onUpdate = () => {
      // wait for next tick to emit the value after update
      nextTick(() => {
        emit('update:formValues', personalDetails);
      });
    };

    return {
      personalDetails,
      onUpdate,
    };
  },
});
</script>

<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.firstName"
          name="firstName"
          label="form.labelFirstName"
          autocomplete="given-name"
          data-cy="form-personal-details-first-name"
          @update:model-value="onUpdate"
        />
      </div>
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.lastName"
          name="lastName"
          label="form.labelLastName"
          autocomplete="family-name"
          data-cy="form-personal-details-last-name"
          @update:model-value="onUpdate"
        />
      </div>
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
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
