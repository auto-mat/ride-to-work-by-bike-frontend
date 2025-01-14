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

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
import { PaymentState } from '../../components/enums/Payment';
import { PaymentCategory } from '../types/ApiPayu';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

export default defineComponent({
  name: 'RegisterChallengePaymentMessages',
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();

    const isDonationPaidViaPayu = computed<boolean>((): boolean => {
      return (
        registerChallengeStore.getIsPaymentSuccessful &&
        registerChallengeStore.getIsPaymentCategoryDonation
      );
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

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
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
      class="bg-warning text-white q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-waiting-for-payment-confirmation-message"
    >
      {{ $t('register.challenge.textPayuWaitingForPayment') }}
    </q-banner>

    <!-- Message: Entry fee payment declined by PayU -->
    <q-banner
      v-if="isPayuPaymentFailed"
      class="bg-negative text-white q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-payu-payment-failed"
    >
      {{ $t('register.challenge.textPayuPaymentFailed') }}
    </q-banner>

    <!-- Message: Donation payment successful -->
    <q-banner
      v-if="isDonationPaidViaPayu"
      class="bg-positive text-white q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-donation-payment-successful"
    >
      {{ $t('register.challenge.textDonationPaymentSuccessful') }}
    </q-banner>

    <!-- Message: Waiting for coordinator confirmation of entry fee payment -->
    <q-banner
      v-if="isShownRegistrationWaitingMessage"
      class="bg-warning text-white q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-waiting-for-coordinator-message"
    >
      {{ $t('register.challenge.textRegistrationWaitingForConfirmation') }}
    </q-banner>
  </div>
</template>
