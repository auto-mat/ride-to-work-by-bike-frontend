<script lang="ts">
/**
 * FormUpdateGender Component
 *
 * @description * Use this component to render a form for updating gender.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `value` (string, required): Gender value.
 * - `onClose` (function, required): Function to close the dialog.
 * - `loading` (boolean, optional): Loading state.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @components
 * - `FormFieldRadioRequired`: Component to render radio buttons.
 *
 * @example
 * <form-update-gender :value="gender" @update:value="onUpdateGender">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6164-25251&t=07BEuitYbnwTVn44-1)
 */

// libraries
import { defineComponent, onMounted, ref } from 'vue';

// components
import FormFieldRadioRequired from './FormFieldRadioRequired.vue';

// composables
import { i18n } from '../../../src/boot/i18n';

// enums
import { Gender } from '../types/Profile';

// types
import { FormOption } from '../types/Form';

export default defineComponent({
  name: 'FormUpdateGender',
  components: {
    FormFieldRadioRequired,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value', 'close'],
  setup(props, { emit }) {
    const inputValue = ref<string>('');

    const genderOptions: FormOption[] = [
      {
        label: i18n.global.t('global.woman'),
        value: Gender.female,
      },
      {
        label: i18n.global.t('global.man'),
        value: Gender.male,
      },
    ];

    onMounted(() => {
      inputValue.value = props.value;
    });

    const closeDialog = (): void => {
      props.onClose();
    };

    const onUpdateGender = (): void => {
      emit('update:value', inputValue.value);
      props.onClose();
    };

    return {
      genderOptions,
      inputValue,
      closeDialog,
      onUpdateGender,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateGender" data-cy="form-update-gender">
    <!-- Label -->
    <label
      for="form-gender"
      class="text-grey-10 text-caption text-bold"
      data-cy="form-label"
    >
      {{ $t('form.labelGender') }}
    </label>
    <!-- Radio group -->
    <form-field-radio-required
      inline
      v-model="inputValue"
      :options="genderOptions"
      class="q-mt-sm"
      data-cy="form-gender"
    />
    <div class="q-mt-xl flex justify-end gap-8">
      <!-- Button: Cancel -->
      <q-btn
        rounded
        unelevated
        outline
        color="primary"
        :label="$t('navigation.discardChanges')"
        @click.prevent="closeDialog"
        data-cy="form-button-cancel"
      />
      <!-- Button: Save -->
      <q-btn
        rounded
        unelevated
        type="submit"
        color="primary"
        :label="$t('navigation.save')"
        :loading="loading"
        data-cy="form-button-save"
      />
    </div>
  </q-form>
</template>
