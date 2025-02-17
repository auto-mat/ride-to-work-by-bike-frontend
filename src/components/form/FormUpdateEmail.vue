<script lang="ts">
/**
 * FormUpdateEmail Component
 *
 * @description * Use this component to render a form for updating email.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `value` (string, required): Email value.
 * - `onClose` (function, required): Function to close the dialog.
 * - `loading` (boolean, optional): Loading state.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @components
 * - `FormFieldEmailRequired` - Component to render email field.
 * - `FormFieldPassword` - Component to render password field.
 *
 * @example
 * <form-update-email :value="email" @update:value="onUpdateEmail">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=07BEuitYbnwTVn44-1)
 */

// libraries
import { computed, defineComponent, onMounted, ref } from 'vue';
import { Notify } from 'quasar';

// components
import FormFieldEmail from '../global/FormFieldEmail.vue';
import FormFieldPassword from '../global/FormFieldPassword.vue';

// composables
import { i18n } from '../../boot/i18n';

// store
import { useLoginStore } from '../../stores/login';

export default defineComponent({
  name: 'FormUpdateEmail',
  components: {
    FormFieldEmail,
    FormFieldPassword,
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
    const password = ref<string>('');

    const loginStore = useLoginStore();
    const currentEmail = computed(() => loginStore.getUserEmail);

    onMounted(() => {
      inputValue.value = props.value;
    });

    const closeDialog = (): void => {
      props.onClose();
    };

    const onUpdateEmail = async (): Promise<void> => {
      // authenticate to confirm password
      const response = await loginStore.login(
        {
          username: currentEmail.value,
          password: password.value,
        },
        {
          redirectAfterLogin: false,
          showErrorMessage: false,
          showSuccessMessage: false,
        },
      );

      if (!response) {
        Notify.create({
          message: i18n.global.t('notify.emailUpdateWrongPassword'),
          color: 'negative',
        });
        return;
      }

      emit('update:value', {
        email: inputValue.value,
        password: password.value,
      });
      props.onClose();
    };

    return {
      inputValue,
      password,
      closeDialog,
      onUpdateEmail,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateEmail" data-cy="form-update-email">
    <!-- Input: Email -->
    <form-field-email v-model="inputValue" data-cy="form-email" />
    <!-- Message: Confirm password to save changes -->
    <p data-cy="form-message">{{ $t('profile.textPasswordConfirm') }}</p>
    <!-- Input: Password -->
    <form-field-password hide-hint v-model="password" data-cy="form-password" />
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
