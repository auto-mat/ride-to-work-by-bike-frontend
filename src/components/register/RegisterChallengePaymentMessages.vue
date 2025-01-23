<script lang="ts">
/**
 * RegisterChallengePaymentMessages Component
 *
 * @description Use this component to display messages related to the payment
 * process. Displayed on the Payment step of the `RegisterChallengePage`.
 *
 * @props
 * - `is-payment-step` (boolean): Whether component is used on the Payment step
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
  props: {
    isPaymentStep: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const registerChallengeStore = useRegisterChallengeStore();

    const isDonationPaidViaPayu = computed<boolean>((): boolean => {
      return (
        props.isPaymentStep &&
        registerChallengeStore.getIsPaymentSuccessful &&
        registerChallengeStore.getIsPaymentCategoryDonation
      );
    });

    const isPayuPaymentFailed = computed((): boolean => {
      return (
        props.isPaymentStep && registerChallengeStore.getIsPaymentUnsuccessful
      );
    });

    const isWaitingForPayuPaymentConfirmation = computed<boolean>(
      (): boolean => {
        return (
          props.isPaymentStep &&
          registerChallengeStore.getIsPayuTransactionInitiated &&
          registerChallengeStore.getPaymentState === PaymentState.none
        );
      },
    );

    const isWaitingForConfirmation = computed<boolean>((): boolean => {
      const isStateWaiting =
        registerChallengeStore.getPaymentState === PaymentState.waiting;
      const isPaymentDonationWithSubjectOrganization =
        registerChallengeStore.getIsPaymentSubjectOrganization &&
        registerChallengeStore.getPaymentCategory === PaymentCategory.donation;
      return isStateWaiting || isPaymentDonationWithSubjectOrganization;
    });

    // displays messsage on payment step for user to select team
    const isWaitingForPaymentConfirmation = computed<boolean>((): boolean => {
      return props.isPaymentStep && isWaitingForConfirmation.value;
    });

    // displays message on summary step - payment waiting for coordinator approval
    const isWaitingForCoordinator = computed<boolean>((): boolean => {
      return (
        !props.isPaymentStep &&
        isWaitingForConfirmation.value &&
        registerChallengeStore.hasOrganizationAdmin === true
      );
    });

    // displays message on summary step - organization has no coordinator
    const isWaitingForConfirmationAndNoCoordinator = computed<boolean>(
      (): boolean => {
        return (
          !props.isPaymentStep &&
          isWaitingForConfirmation.value &&
          registerChallengeStore.hasOrganizationAdmin === false
        );
      },
    );

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      isDonationPaidViaPayu,
      isPayuPaymentFailed,
      isWaitingForConfirmationAndNoCoordinator,
      isWaitingForCoordinator,
      isWaitingForPaymentConfirmation,
      isWaitingForPayuPaymentConfirmation,
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
      class="bg-warning text-grey-10 q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-payu-waiting-for-payment"
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

    <!-- Payment step message: "select team for confirmation" -->
    <q-banner
      v-if="isWaitingForPaymentConfirmation"
      class="bg-warning text-grey-10 q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-waiting-for-confirmation"
    >
      {{ $t('register.challenge.textRegistrationWaitingForConfirmation') }}
    </q-banner>

    <!-- Summary step message: Waiting for coordinator confirmation -->
    <q-banner
      v-if="isWaitingForCoordinator"
      class="bg-warning text-grey-10 q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-waiting-for-coordinator"
    >
      {{ $t('register.challenge.textRegistrationWaitingForCoordinator') }}
    </q-banner>

    <!-- Summary step message: Waiting for confirmation + organization has no coordinator -->
    <q-banner
      v-if="isWaitingForConfirmationAndNoCoordinator"
      class="bg-warning text-grey-10 q-mb-md"
      :style="{ borderRadius }"
      data-cy="registration-waiting-for-confirmation-no-coordinator"
    >
      {{
        $t(
          'register.challenge.textRegistrationWaitingForConfirmationNoCoordinator',
        )
      }}
    </q-banner>
  </div>
</template>
