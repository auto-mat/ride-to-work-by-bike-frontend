<script lang="ts">
/**
 * RegisterChallengeSummary Component
 *
 * @description A summary component that displays the registration details.
 * Renders data from the `loginStore` and `registerChallengeStore`.
 * Used in `RegisterChallengePage` as the last step to review entered data.
 *
 * @example
 * <register-challenge-summary />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8488-42833&t=htgS0Jki0uk9vGfl-1)
 */

// libraries
import { computed, defineComponent, inject, onMounted } from 'vue';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useLoginStore } from '../../stores/login';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'RegisterChallengeSummary',
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerChallengeStore = useRegisterChallengeStore();
    const loginStore = useLoginStore();

    const email = computed(() => loginStore.getUserEmail);
    const personalDetails = computed(
      () => registerChallengeStore.getPersonalDetails,
    );
    const organizationLabel = computed(
      () => registerChallengeStore.getSelectedOrganizationLabel,
    );
    const subsidiaryLabel = computed(
      () => registerChallengeStore.getSelectedSubsidiaryLabel,
    );
    const teamLabel = computed(
      () => registerChallengeStore.getSelectedTeamLabel,
    );
    const merchandiseLabel = computed(
      () => registerChallengeStore.getSelectedMerchandiseLabel,
    );
    const merchandiseDescription = computed(
      () => registerChallengeStore.getSelectedMerchandiseDescription,
    );
    const subsidiaryAddress = computed(
      () => registerChallengeStore.getSelectedSubsidiaryAddress,
    );

    // confirm registration is complete by setting local flag
    onMounted(() => {
      if (
        registerChallengeStore.getIsRegistrationComplete &&
        registerChallengeStore.getIsRegistrationInProgressLocalFlag
      ) {
        logger?.debug(
          `Setting current isRegistrationInProgressLocalFlag state from <${registerChallengeStore.getIsRegistrationInProgressLocalFlag}> to <false>.`,
        );
        registerChallengeStore.setIsRegistrationInProgressLocalFlag(false);
        logger?.debug(
          `Current isRegistrationInProgressLocalFlag state set to <${registerChallengeStore.getIsRegistrationInProgressLocalFlag}>.`,
        );
      }
    });

    return {
      personalDetails,
      email,
      organizationLabel,
      subsidiaryLabel,
      teamLabel,
      merchandiseLabel,
      merchandiseDescription,
      subsidiaryAddress,
    };
  },
});
</script>

<template>
  <div class="text-grey-10" data-cy="register-challenge-summary">
    <!-- Personal Details Section -->
    <div class="q-mb-lg" data-cy="summary-personal">
      <h3 class="text-body1 text-weight-bold text-grey-10 q-my-none">
        {{ $t('register.challenge.titleStepPersonalDetails') }}
      </h3>
      <div>
        <!-- Email -->
        <div v-if="email" class="q-mt-sm" data-cy="summary-personal-email">
          {{ email }}
        </div>
        <!-- Full name -->
        <div
          v-if="personalDetails.firstName || personalDetails.lastName"
          class="q-mt-sm"
          data-cy="summary-personal-name"
        >
          {{ personalDetails.firstName }} {{ personalDetails.lastName }}
        </div>
        <!-- Gender -->
        <div
          v-if="personalDetails.gender"
          class="q-mt-sm"
          data-cy="summary-personal-gender"
        >
          {{ $t('register.challenge.labelGender') }}:
          {{ $t(`register.challenge.textGender.${personalDetails.gender}`) }}
        </div>
      </div>
    </div>

    <!-- Participation Section -->
    <div class="q-mb-lg" data-cy="summary-participation">
      <h3 class="text-body1 text-weight-bold q-my-none">
        {{ $t('register.challenge.titleStepParticipation') }}
      </h3>
      <div>
        <div
          v-if="teamLabel"
          class="q-mt-sm"
          data-cy="summary-participation-team"
        >
          {{ teamLabel }}
        </div>
        <div
          v-if="organizationLabel"
          class="q-mt-sm"
          data-cy="summary-participation-organization"
        >
          {{ organizationLabel }}
        </div>
      </div>
    </div>

    <!-- Merch Section -->
    <div class="q-mb-lg" data-cy="summary-merch">
      <h3 class="text-body1 text-weight-bold q-my-none">
        {{ $t('register.challenge.titleStepMerch') }}
      </h3>
      <div>
        <div
          v-if="merchandiseLabel"
          class="q-mt-sm"
          data-cy="summary-merch-label"
        >
          {{ merchandiseLabel }}
        </div>
        <div
          v-if="merchandiseDescription"
          class="q-mt-sm"
          data-cy="summary-merch-description"
        >
          {{ merchandiseDescription }}
        </div>
      </div>
    </div>

    <!-- Delivery Address Section -->
    <div class="q-mb-lg" data-cy="summary-delivery">
      <h3 class="text-body1 text-weight-bold q-my-none">
        {{ $t('register.challenge.titleDeliveryAddress') }}
      </h3>
      <div>
        <div
          v-if="subsidiaryAddress"
          class="q-mt-sm"
          data-cy="summary-delivery-address"
        >
          {{ subsidiaryAddress }}
        </div>
      </div>
    </div>
  </div>
</template>
