<script lang="ts">
/**
 * RegisterChallengePaymentMessages Component
 *
 * @description Use this component to display messages related to the payment
 * process. Displayed on the Payment step of the `RegisterChallengePage`.
 *
 * @example
 * <register-challenge-payment-messages />
 */

// libraries
import { defineComponent, computed } from 'vue';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// enums
import { PaymentState } from '../../components/enums/Payment';
import { PaymentCategory } from '../types/ApiPayu';

export default defineComponent({
  name: 'RegisterChallengePaymentMessages',
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();

    const isDonationFailed = computed<boolean>((): boolean => {
      return (
        registerChallengeStore.getIsPaymentUnsuccessful &&
        registerChallengeStore.getIsPaymentCategoryDonation
      );
    });
    const isDonationPaidViaPayu = computed<boolean>((): boolean => {
      const isPaymentStateSuccess = [
        PaymentState.noAdmission,
        PaymentState.done,
      ].includes(registerChallengeStore.getPaymentState);
      const isPaymentCategoryDonation = [
        PaymentCategory.donation,
        PaymentCategory.entryFeeDonation,
      ].includes(registerChallengeStore.getPaymentCategory);
      return isPaymentStateSuccess && isPaymentCategoryDonation;
    });

    const isPayuPaymentFailed = computed((): boolean => {
      return registerChallengeStore.getIsPaymentUnsuccessful;
    });

    const isWaitingForPayuPaymentConfirmation = computed<boolean>(
      (): boolean => {
        return (
          registerChallengeStore.getIsPayuTransactionInitiated &&
          registerChallengeStore.getPaymentState === PaymentState.none
        );
      },
    );

    const isShownRegistrationWaitingMessage = computed<boolean>((): boolean => {
      const isStateWaiting =
        registerChallengeStore.getPaymentState === PaymentState.waiting;
      const isPaymentDonationWithSubjectOrganization =
        registerChallengeStore.getIsPaymentSubjectOrganization &&
        registerChallengeStore.getPaymentCategory === PaymentCategory.donation;
      return isStateWaiting || isPaymentDonationWithSubjectOrganization;
    });

    return {
      isDonationFailed,
      isDonationPaidViaPayu,
      isPayuPaymentFailed,
      isWaitingForPayuPaymentConfirmation,
      isShownRegistrationWaitingMessage,
      registerChallengeStore,
    };
  },
});
</script>

<template>
  <div>
    <!-- Message: Waiting for PayU payment confirmation -->
    <q-banner
      v-if="isWaitingForPayuPaymentConfirmation"
      class="bg-warning text-white q-mt-md"
      data-cy="registration-waiting-for-payment-confirmation-message"
    >
      <template v-slot:avatar>
        <q-icon name="pending" />
      </template>
      {{ $t('register.challenge.textPayuWaitingForPayment') }}
    </q-banner>

    <!-- Message: Entry fee payment declined by PayU -->
    <q-banner
      v-if="isPayuPaymentFailed"
      class="bg-negative text-white q-mt-md"
      data-cy="registration-payu-payment-failed"
    >
      <template v-slot:avatar>
        <q-icon name="error" />
      </template>
      {{ $t('register.challenge.textPayuPaymentFailed') }}
    </q-banner>

    <!-- Message: Donation payment successful -->
    <q-banner
      v-if="isDonationPaidViaPayu"
      class="bg-positive text-white q-mt-md"
      data-cy="registration-donation-payment-successful"
    >
      {{ $t('register.challenge.textDonationPaymentSuccessful') }}
    </q-banner>

    <!-- Message: Waiting for coordinator confirmation of entry fee payment -->
    <q-banner
      v-if="isShownRegistrationWaitingMessage"
      class="bg-warning text-white q-mt-md"
      data-cy="registration-waiting-for-coordinator-message"
    >
      <template v-slot:avatar>
        <q-icon name="pending" />
      </template>
      {{ $t('register.challenge.textRegistrationWaitingForConfirmation') }}
    </q-banner>
  </div>
</template>
