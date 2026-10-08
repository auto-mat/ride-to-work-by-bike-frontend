<script lang="ts">
/**
 * FormInviteToTeam Component
 *
 * @description * Use this component to render a form for inviting team members.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `onClose` (function, required): Function to close the dialog.
 * - `remainingSlots` (number, required): Number of remaining slots in the team.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @example
 * <form-invite-to-team :value="emails" :remaining-slots="remainingSlots" @update:value="onUpdateEmails">
 */

// libraries
import { QForm } from 'quasar';
import { defineComponent, inject, ref } from 'vue';

// components
import FormFieldEmail from '../global/FormFieldEmail.vue';

// composables
import { useApiPostSendTeamMembershipInvitationEmail } from '@/composables/useApiPostSendTeamMembershipInvitationEmail';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'FormInviteToTeam',
  components: {
    FormFieldEmail,
  },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
    remainingSlots: {
      type: Number,
      required: true,
    },
  },
  emits: ['close'],
  setup(props) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const emailAddresses = ref<string[]>(['']);
    const formRef = ref<InstanceType<typeof QForm> | null>(null);
    const closeDialog = (): void => {
      props.onClose();
    };

    const { isLoading, postSendTeamMembershipInvitationEmail } =
      useApiPostSendTeamMembershipInvitationEmail(logger);
    const onUpdateEmails = async (): Promise<void> => {
      if (!formRef.value) return;
      const valid = await formRef.value.validate();
      if (!valid) return;
      const response = await postSendTeamMembershipInvitationEmail({
        email: emailAddresses.value.join(','),
      });
      // if success
      if (response?.team_membership_invitation_email_sended) {
        // clear form
        emailAddresses.value = [''];
        // reset form validation
        formRef.value.resetValidation();
        // close dialog
        props.onClose();
      }
    };

    // handle adding/removing email fields
    const addEmailField = (): void => {
      if (emailAddresses.value.length < props.remainingSlots) {
        emailAddresses.value.push('');
      }
    };

    const removeEmailField = (index: number): void => {
      emailAddresses.value.splice(index, 1);
    };

    return {
      emailAddresses,
      closeDialog,
      onUpdateEmails,
      addEmailField,
      removeEmailField,
      isLoading,
      formRef,
    };
  },
});
</script>

<template>
  <q-form
    ref="formRef"
    @submit.prevent="onUpdateEmails"
    data-cy="form-invite-to-team"
  >
    <!-- Label -->
    <label class="text-grey-10 text-caption text-bold" data-cy="form-label">
      {{ $t('form.labelEmailAddresses') }}
    </label>
    <!-- Email address fields -->
    <div class="q-my-md" data-cy="invite-email-addresses">
      <div
        v-for="(email, index) in emailAddresses"
        :key="index"
        class="q-mt-sm"
      >
        <div class="row">
          <div class="col">
            <!-- Input: Email -->
            <form-field-email
              hide-label
              v-model="emailAddresses[index]"
              :required="true"
              :testing="false"
              data-cy="invite-email-addresses-input"
            />
          </div>
          <!-- Button: Remove email field -->
          <div class="col-auto">
            <q-btn
              v-if="index > 0"
              round
              unelevated
              outline
              text-color="negative"
              icon="close"
              size="8px"
              :title="$t('form.buttonRemoveEmailField')"
              class="q-mt-md q-ml-sm"
              @click="removeEmailField(index)"
              data-cy="remove-email-field"
            />
          </div>
        </div>
      </div>
      <!-- Button: Add email field -->
      <q-btn
        v-if="emailAddresses.length < remainingSlots"
        unelevated
        rounded
        outline
        class="q-mt-md"
        color="primary"
        size="12px"
        @click="addEmailField"
        data-cy="add-email-field"
      >
        <q-icon name="add" size="18px" class="q-mr-xs" />
        {{ $t('form.buttonAddEmailField') }}
      </q-btn>
    </div>
    <div class="q-mt-xl flex justify-end gap-8">
      <!-- Button: Cancel -->
      <q-btn
        rounded
        unelevated
        outline
        color="primary"
        :label="$t('navigation.back')"
        :disable="isLoading"
        @click.prevent="closeDialog"
        data-cy="form-button-cancel"
      />
      <!-- Button: Submit -->
      <q-btn
        rounded
        unelevated
        type="submit"
        color="primary"
        :label="$t('navigation.submit')"
        :loading="isLoading"
        data-cy="form-button-submit"
      />
    </div>
  </q-form>
</template>
