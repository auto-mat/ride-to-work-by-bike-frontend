<script lang="ts">
/**
 * FormUpdateNickname Component
 *
 * @description * Use this component to render a form for updating nickname.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `value` (string, required): Nickname value.
 * - `onClose` (function, required): Function to close the dialog.
 * - `loading` (boolean, optional): Loading state.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @example
 * <form-update-nickname :value="nickname" @update:value="onUpdateNickname">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6162-23555&t=31rhAtfu6ZZ8sEf1-1)
 */

// libraries
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'FormUpdateNickname',
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

    onMounted(() => {
      inputValue.value = props.value;
    });

    const closeDialog = (): void => {
      props.onClose();
    };

    const onUpdateNickname = (): void => {
      emit('update:value', inputValue.value);
      props.onClose();
    };

    return {
      inputValue,
      closeDialog,
      onUpdateNickname,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateNickname" data-cy="form-update-nickname">
    <!-- Label -->
    <label
      for="form-nickname"
      class="text-grey-10 text-caption text-bold"
      data-cy="form-label"
    >
      {{ $t('form.labelNicknameOptional') }}
    </label>
    <!-- Input -->
    <q-input
      clearable
      dense
      outlined
      v-model="inputValue"
      lazy-rules
      class="q-mt-sm"
      id="form-nickname"
      name="nickname"
      :hint="$t('form.hintNickname')"
      data-cy="form-input"
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
