<script lang="ts">
/**
 * BannerTeamMemberApprove Component
 *
 * @description * Use this component to show a banner for team member approval status.
 * The banner shows different content based on the user's approval status and number
 * of pending approvals.
 *
 * @components
 * - `DialogDefault`: Component to render the approval dialog
 *
 * @example
 * <banner-team-member-approve />
 */

// libraries
import { colors, Notify } from 'quasar';
import { computed, defineComponent, inject, ref } from 'vue';

// components
import DialogDefault from './DialogDefault.vue';

// composables
import { i18n } from '../../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { TeamMemberStatus } from '../enums/TeamMember';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useChallengeStore } from '../../stores/challenge';

// types
import type { ExtendedMemberResults } from '../types/Results';
import type { Logger } from '../types/Logger';
import type { MemberResults } from '../types/Results';

// composables
import { useApiPutMyTeam } from '../../composables/useApiPutMyTeam';

export default defineComponent({
  name: 'BannerTeamMemberApprove',
  components: {
    DialogDefault,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;
    const isDialogOpen = ref<boolean>(false);
    const memberDecisions = ref<
      Map<number, TeamMemberStatus.approved | TeamMemberStatus.denied>
    >(new Map<number, TeamMemberStatus.approved | TeamMemberStatus.denied>());

    const registerChallengeStore = useRegisterChallengeStore();
    const challengeStore = useChallengeStore();
    const { updateTeamMemberStatus, isLoading } = useApiPutMyTeam(null);

    const openDialog = (): void => {
      isDialogOpen.value = true;
      // reset member decisions when opening dialog
      memberDecisions.value = new Map();
      /**
       * If, for some reason, the team is full but we still have pending members
       * mark them all as denied.
       */
      if (isTeamFull.value && pendingMembersCount.value > 0) {
        logger?.debug('Team is full and there are pending members');
        pendingMembers.value.forEach((member) => {
          memberDecisions.value.set(member.id, TeamMemberStatus.denied);
        });
        logger?.debug(
          `Pending members deined. Member decisions <${memberDecisions.value.size}>`,
        );
      }
    };

    const remainingApprovalSlots = computed<number>((): number => {
      const myTeam = registerChallengeStore.getMyTeam;
      if (!myTeam) return 0;

      const maxTeamMembers = challengeStore.getMaxTeamMembers;
      if (!maxTeamMembers) return 0;

      // get the number of members set for approval
      const currentApprovals = Array.from(
        memberDecisions.value.values(),
      ).filter((s) => s === TeamMemberStatus.approved).length;

      return maxTeamMembers - myTeam.member_count - currentApprovals;
    });

    /**
     * Handle the member decision
     * Assign the status to the member and handle the logic related to the max
     * number of members allowed.
     * @param {number} memberId - The id of the member
     * @param {TeamMemberStatus.approved | TeamMemberStatus.denied} status
     *   - The status of the member
     */
    const handleMemberDecision = (
      memberId: number,
      status: TeamMemberStatus.approved | TeamMemberStatus.denied,
    ): void => {
      // if trying to approve and no slots left, do nothing
      if (
        status === TeamMemberStatus.approved &&
        remainingApprovalSlots.value <= 0
      ) {
        return;
      }
      // if approving a member would exceed the limit, reject other undecided members
      if (status === TeamMemberStatus.approved) {
        // if this is the last slot, reject the remaining undecided members
        if (remainingApprovalSlots.value === 1) {
          // auto-reject remaining undecided members
          pendingMembers.value.forEach((member) => {
            // for all members not yet selected and except the current one
            if (
              !memberDecisions.value.has(member.id) &&
              member.id !== memberId
            ) {
              // set the status to denied
              memberDecisions.value.set(member.id, TeamMemberStatus.denied);
            }
          });
        }
      }
      // set the status for the current member
      memberDecisions.value.set(memberId, status);
    };

    const isApproved = computed<boolean>((): boolean => {
      const myTeam = registerChallengeStore.getMyTeam;
      if (!myTeam) return false;

      const currentUser = myTeam.members.find(
        (member: MemberResults) => member.is_me,
      ) as MemberResults as ExtendedMemberResults;
      if (!currentUser) return false;

      return currentUser.approved_for_team === TeamMemberStatus.approved;
    });

    const pendingMembersCount = computed<number>((): number => {
      const myTeam = registerChallengeStore.getMyTeam;
      return myTeam?.unapproved_member_count || 0;
    });

    const pendingMembers = computed<ExtendedMemberResults[]>(
      (): ExtendedMemberResults[] => {
        const myTeam = registerChallengeStore.getMyTeam;
        if (!myTeam) return [];

        return (myTeam.members as ExtendedMemberResults[]).filter(
          (member) => member.approved_for_team === TeamMemberStatus.undecided,
        );
      },
    );

    const isTeamFull = computed<boolean>((): boolean => {
      const myTeam = registerChallengeStore.getMyTeam;
      if (!myTeam) return false;

      const maxTeamMembers = challengeStore.getMaxTeamMembers;
      if (!maxTeamMembers) return false;

      return myTeam.member_count >= maxTeamMembers;
    });

    const isBannerVisible = computed<boolean>((): boolean => {
      // if user is not approved, show the banner
      if (!isApproved.value) return true;
      // if user is approved, show the banner if there are pending members
      return isApproved.value && pendingMembersCount.value > 0;
    });

    const onSave = async (): Promise<void> => {
      if (!registerChallengeStore.getTeamId) {
        Notify.create({
          message: i18n.global.t('putMyTeam.messageTeamIdNotAvailable'),
          color: 'negative',
        });
        return;
      }
      // generate the payload from the memberDecisions map
      const payload = Array.from(memberDecisions.value.entries()).map(
        ([id, status]) => {
          // if the member is denied, send team field `null`
          if (status === TeamMemberStatus.denied) {
            return {
              id,
              approved_for_team: status,
              team: null,
            };
          }
          // if the member is not denied do not send the team field
          return {
            id,
            approved_for_team: status,
          };
        },
      );
      // if no changes were made, close the dialog
      if (payload.length === 0) {
        isDialogOpen.value = false;
        return;
      }
      // submit the changes
      await updateTeamMemberStatus(registerChallengeStore.getTeamId, payload);
      // reload team data after successful update
      await registerChallengeStore.loadMyTeamToStore(null);
      isDialogOpen.value = false;
    };

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const secondary = getPaletteColor('secondary');
    const secondaryOpacity = changeAlpha(
      secondary,
      rideToWorkByBikeConfig.colorSecondaryBackgroundOpacity,
    );

    return {
      borderRadius,
      isDialogOpen,
      memberDecisions,
      openDialog,
      onSave,
      secondaryOpacity,
      isApproved,
      isBannerVisible,
      pendingMembersCount,
      pendingMembers,
      TeamMemberStatus,
      remainingApprovalSlots,
      handleMemberDecision,
      isLoading,
    };
  },
});
</script>

<template>
  <div
    v-if="isBannerVisible"
    class="text-grey-10"
    :style="{
      borderRadius,
      backgroundColor: secondaryOpacity,
    }"
    data-cy="banner-team-member-approve"
  >
    <div class="row justify-between q-py-sm">
      <!-- Section: Title -->
      <div
        class="col-12 flex gap-24 items-center q-py-sm q-px-lg"
        data-cy="banner-team-member-approve-section-title"
      >
        <!-- Image -->
        <q-img
          class="col-12 col-md-auto"
          src="~assets/svg/banner-routes.svg"
          width="70px"
          height="102px"
          alt=""
          aria-hidden="true"
          data-cy="banner-team-member-approve-image"
        />
        <!-- Title -->
        <h3
          class="col-12 col-md text-h5 text-weight-bold q-my-none"
          style="text-wrap: balance"
          data-cy="banner-team-member-approve-title"
        >
          <!-- Approved members -->
          <span v-if="isApproved">
            {{ $t('bannerTeamMemberApprove.textMembersToApprove') }}
          </span>
          <!-- Waiting for approval -->
          <span v-else>
            {{ $t('bannerTeamMemberApprove.textWaitingForApproval') }}
          </span>
        </h3>
        <!-- Button section -->
        <div
          v-if="isApproved && pendingMembersCount > 0"
          class="col-12 col-md-auto flex items-center justify-end q-py-sm"
          data-cy="banner-team-member-approve-section-button"
        >
          <q-btn
            rounded
            unelevated
            color="primary"
            size="16px"
            text-color="white"
            class="q-pa-md text-weight-bold"
            @click="openDialog"
            data-cy="banner-team-member-approve-button"
          >
            {{ $t('bannerTeamMemberApprove.buttonApproveMembers') }}
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Dialog: Approve Members -->
    <dialog-default v-model="isDialogOpen" data-cy="dialog-approve-members">
      <!-- Title -->
      <template #title>
        {{ $t('bannerTeamMemberApprove.dialogTitle') }}
      </template>
      <!-- Content -->
      <template #content>
        <!-- Member List -->
        <div class="q-mb-lg">
          <div
            v-for="member in pendingMembers"
            :key="member.id"
            class="q-mb-md"
            data-cy="dialog-approve-members-member"
          >
            <div class="row items-center q-col-gutter-md">
              <!-- Member Info -->
              <div class="col-12 col-sm">
                <div
                  class="text-subtitle1 text-weight-medium"
                  data-cy="dialog-approve-members-member-name"
                >
                  {{ member.name }}
                </div>
              </div>
              <!-- Decision Buttons -->
              <div class="col-12 col-sm-auto">
                <q-btn
                  rounded
                  unelevated
                  :outline="
                    memberDecisions.get(member.id) !== TeamMemberStatus.approved
                  "
                  :color="
                    memberDecisions.get(member.id) === TeamMemberStatus.approved
                      ? 'positive'
                      : 'primary'
                  "
                  @click="
                    handleMemberDecision(member.id, TeamMemberStatus.approved)
                  "
                  :label="$t('bannerTeamMemberApprove.buttonDialogApprove')"
                  :disable="
                    remainingApprovalSlots <= 0 &&
                    memberDecisions.get(member.id) !== TeamMemberStatus.approved
                  "
                  class="q-mr-sm"
                  data-cy="dialog-approve-members-button-approve"
                />
                <q-btn
                  rounded
                  unelevated
                  :outline="
                    memberDecisions.get(member.id) !== TeamMemberStatus.denied
                  "
                  :color="
                    memberDecisions.get(member.id) === TeamMemberStatus.denied
                      ? 'negative'
                      : 'primary'
                  "
                  @click="
                    handleMemberDecision(member.id, TeamMemberStatus.denied)
                  "
                  :label="$t('bannerTeamMemberApprove.buttonDialogDeny')"
                  data-cy="dialog-approve-members-button-deny"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Separator -->
        <q-separator
          class="q-my-md"
          style="margin-left: -16px; margin-right: -16px"
        />
        <!-- Action Buttons -->
        <div class="flex justify-end gap-8">
          <q-btn
            rounded
            unelevated
            outline
            color="primary"
            @click="isDialogOpen = false"
            data-cy="dialog-button-cancel"
            :disable="isLoading"
          >
            {{ $t('navigation.discard') }}
          </q-btn>
          <q-btn
            rounded
            unelevated
            color="primary"
            @click="onSave"
            data-cy="dialog-button-submit"
            :loading="isLoading"
          >
            {{ $t('navigation.save') }}
          </q-btn>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
