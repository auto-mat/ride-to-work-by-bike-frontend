<script lang="ts">
/**
 * Show organization IDs
 *
 * @description * Use this component to debug Cypress component/e2e tests
 * Note: Shows organizationId, subsidiaryId, and teamId from registerChallengeStore
 *       Only visible in Cypress testing environment
 *
 * @example
 * <show-organization-ids />
 *
 */

// libraries
import { defineComponent, computed } from 'vue';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

export default defineComponent({
  name: 'ShowOrganizationIds',
  setup() {
    let organizationId;
    let subsidiaryId;
    let teamId;
    let paymentState;
    let isPayuTransactionInitiated;
    let isRegistrationInProgressLocalFlag;
    const showComponent = computed(() => !!window.Cypress);

    if (showComponent.value) {
      const registerChallengeStore = useRegisterChallengeStore();

      organizationId = computed(() => registerChallengeStore.getOrganizationId);
      subsidiaryId = computed(() => registerChallengeStore.getSubsidiaryId);
      teamId = computed(() => registerChallengeStore.getTeamId);
      paymentState = computed(() => registerChallengeStore.getPaymentState);
      isPayuTransactionInitiated = computed(
        () => registerChallengeStore.getIsPayuTransactionInitiated,
      );
      isRegistrationInProgressLocalFlag = computed(
        () => registerChallengeStore.getIsRegistrationInProgressLocalFlag,
      );
    }

    return {
      organizationId,
      subsidiaryId,
      teamId,
      showComponent,
      paymentState,
      isPayuTransactionInitiated,
      isRegistrationInProgressLocalFlag,
    };
  },
});
</script>

<template>
  <div v-if="showComponent" data-cy="debug-register-challenge-ids">
    <div class="text-red text-bold">
      <div data-cy="debug-organization-id">
        DEBUG organization ID
        <span data-cy="debug-organization-id-value">{{ organizationId }}</span>
      </div>
      <div data-cy="debug-subsidiary-id">
        DEBUG subsidiary ID
        <span data-cy="debug-subsidiary-id-value">{{ subsidiaryId }}</span>
      </div>
      <div data-cy="debug-team-id">
        DEBUG team ID <span data-cy="debug-team-id-value">{{ teamId }}</span>
      </div>
      <div data-cy="debug-payment-state">
        DEBUG: payment state
        <span data-cy="debug-payment-state-value">{{ paymentState }}</span>
      </div>
      <div data-cy="debug-is-paid-from-ui">
        DEBUG: is paid from UI
        <span data-cy="debug-is-paid-from-ui-value">{{
          isPayuTransactionInitiated
        }}</span>
      </div>
      <div data-cy="debug-is-registration-in-progress-local-flag">
        DEBUG: is registration in progress local flag
        <span data-cy="debug-is-registration-in-progress-local-flag-value">{{
          isRegistrationInProgressLocalFlag
        }}</span>
      </div>
    </div>
  </div>
</template>
