<script lang="ts">
/**
 * TeamMembersList Component
 *
 * @description Displays a list of team members with their approval status.
 * Responsive layout - side by side on desktop, stacked on mobile.
 *
 * Note: This component is used in the `ProfileDetails` component.
 *
 * @example
 * <team-members-list />
 */

// libraries
import { defineComponent, computed } from 'vue';

// composables
import { useTeamMemberApprovalStatus } from '../../composables/useTeamMemberApprovalStatus';
import { i18n } from '../../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { ExtendedMemberResults } from '../types/Results';

// utils
import { getGenderLabel } from '../../utils/get_gender_label';

export default defineComponent({
  name: 'TeamMembersList',
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();

    const teamMembers = computed<ExtendedMemberResults[]>(
      (): ExtendedMemberResults[] => {
        const myTeam = registerChallengeStore.getMyTeam;
        if (!myTeam) return [];
        return myTeam.members as ExtendedMemberResults[];
      },
    );

    const { getStatusLabel, getStatusColor, getStatusIcon } =
      useTeamMemberApprovalStatus();

    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;

    return {
      borderRadius,
      getGenderLabel,
      getStatusLabel,
      getStatusColor,
      getStatusIcon,
      i18n,
      teamMembers,
    };
  },
});
</script>

<template>
  <div data-cy="team-members-list">
    <!-- Title -->
    <h3
      class="text-h6 text-weight-bold text-grey-10 q-mt-none q-mb-md"
      data-cy="team-members-list-title"
    >
      {{ $t('teamMembersList.titleMembers') }}
    </h3>
    <!-- List -->
    <q-list bordered separator :style="{ borderRadius }">
      <!-- Member -->
      <q-item
        v-for="member in teamMembers"
        :key="member.id"
        data-cy="team-member-item"
      >
        <div class="full-width row gap-4 items-center">
          <!-- Name -->
          <div class="col-12 col-lg-3">
            <b data-cy="team-member-name">{{ member.name }}</b>
          </div>
          <!-- Email -->
          <div class="col-12 col-lg-4">
            <a
              data-cy="team-member-email"
              href="mailto:{{ member.email }}"
              class="text-primary"
              >{{ member.email }}</a
            >
          </div>
          <!-- Gender -->
          <div v-if="member.sex" class="col-12 col-sm">
            <q-icon
              v-if="member.sex"
              :name="member.sex"
              :color="member.sex == 'male' ? 'blue' : 'red'"
              size="xs"
              data-cy="team-member-gender"
            ></q-icon>
          </div>
          <!-- Approval status -->
          <div class="col-12 col-sm-auto">
            <q-chip
              :color="getStatusColor(member)"
              :icon="getStatusIcon(member)"
              class="q-ma-none"
              data-cy="team-member-status-chip"
            >
              {{ getStatusLabel(member) }}
            </q-chip>
          </div>
        </div>
      </q-item>
    </q-list>
  </div>
</template>
