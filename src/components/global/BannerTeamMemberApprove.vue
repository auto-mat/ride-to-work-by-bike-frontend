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
import { colors } from 'quasar';
import { computed, defineComponent, ref } from 'vue';

// components
import DialogDefault from './DialogDefault.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { TeamMemberStatus } from '../enums/TeamMember';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useChallengeStore } from '../../stores/challenge';

// types
import type { ExtendedMemberResults } from '../types/Results';
import type { MemberResults } from '../types/Results';

// composables
import { useApiPutMyTeam } from '../../composables/useApiPutMyTeam';
import { i18n } from '../../boot/i18n';

export default defineComponent({
  name: 'BannerTeamMemberApprove',
  components: {
    DialogDefault,
  },
  setup() {
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;
    const isDialogOpen = ref<boolean>(false);
    const memberDecisions = ref<
      Map<number, TeamMemberStatus.approved | TeamMemberStatus.denied>
    >(new Map<number, TeamMemberStatus.approved | TeamMemberStatus.denied>());

    const registerChallengeStore = useRegisterChallengeStore();
    const challengeStore = useChallengeStore();
    const { updateTeamMemberStatus, isLoading } = useApiPutMyTeam(null);
    const { t } = i18n.global;

    const openDialog = (): void => {
      isDialogOpen.value = true;
      // reset member decisions when opening dialog
      memberDecisions.value = new Map();
    };

    const remainingApprovalSlots = computed<number>((): number => {
      const myTeam = registerChallengeStore.getMyTeam;
      if (!myTeam) return 0;

      const maxTeamMembers = challengeStore.getMaxTeamMembers;
      if (!maxTeamMembers) return 0;

      return maxTeamMembers - myTeam.member_count;
    });

    const onSave = async (): Promise<void> => {
      // generate the payload from the memberDecisions map
      const payload = Array.from(memberDecisions.value.entries()).map(
        ([id, status]) => ({
          id,
          approved_for_team: status,
        }),
      );
      // if no changes were made, close the dialog
      if (payload.length === 0) {
        isDialogOpen.value = false;
        return;
      }
      // submit the changes
      await updateTeamMemberStatus(payload);
      // reload team data after successful update
      await registerChallengeStore.loadMyTeamToStore(null);
      isDialogOpen.value = false;
    };

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
        // get the number of members set for approval
        const currentApprovals = Array.from(
          memberDecisions.value.values(),
        ).filter((s) => s === TeamMemberStatus.approved).length;
        // if this is the last slot, reject the remaining undecided members
        if (currentApprovals + 1 >= remainingApprovalSlots.value) {
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
      // If team is full, don't show the banner
      if (isTeamFull.value) return false;

      // Otherwise, show if user is not approved or if there are pending members
      return (
        !isApproved.value || (isApproved.value && pendingMembersCount.value > 0)
      );
    });

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
      $t: t,
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
          class="col-12 col-sm-auto"
          src="~assets/svg/banner-routes.svg"
          width="70px"
          height="102px"
          alt=""
          aria-hidden="true"
          data-cy="banner-team-member-approve-image"
        />
        <!-- Title -->
        <h3
          class="col-12 col-sm text-h5 text-weight-bold q-my-none"
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
      </div>

      <!-- Button section -->
      <div
        v-if="isApproved && pendingMembersCount > 0"
        class="col-12 flex items-center justify-end q-py-sm q-px-xl"
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

    <!-- Dialog: Approve Members -->
    <dialog-default v-model="isDialogOpen" data-cy="dialog-approve-members">
      <!-- Title -->
      <template #title>
        {{ $t('bannerTeamMemberApprove.dialogTitle') }}
      </template>
      <!-- Content -->
      <template #content>
        <div class="q-pa-md">
          <!-- Member List -->
          <div class="q-mb-lg">
            <div
              v-for="member in pendingMembers"
              :key="member.id"
              class="q-mb-md"
            >
              <div class="row items-center q-col-gutter-md">
                <!-- Member Info -->
                <div class="col">
                  <div class="text-subtitle1 text-weight-medium">
                    {{ member.name }}
                  </div>
                  <div class="text-caption text-grey-7">
                    {{ member.email }}
                  </div>
                </div>
                <!-- Decision Buttons -->
                <div class="col-auto">
                  <q-btn-group rounded>
                    <q-btn
                      outline
                      :color="
                        memberDecisions.get(member.id) ===
                        TeamMemberStatus.approved
                          ? 'positive'
                          : 'grey'
                      "
                      @click="
                        handleMemberDecision(
                          member.id,
                          TeamMemberStatus.approved,
                        )
                      "
                      :label="$t('bannerTeamMemberApprove.buttonDialogApprove')"
                      :disable="
                        remainingApprovalSlots <= 0 &&
                        !memberDecisions.get(member.id)
                      "
                    />
                    <q-btn
                      outline
                      :color="
                        memberDecisions.get(member.id) ===
                        TeamMemberStatus.denied
                          ? 'negative'
                          : 'grey'
                      "
                      @click="
                        handleMemberDecision(member.id, TeamMemberStatus.denied)
                      "
                      :label="$t('bannerTeamMemberApprove.buttonDialogDeny')"
                    />
                  </q-btn-group>
                </div>
              </div>
            </div>
          </div>

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
        </div>
      </template>
    </dialog-default>
  </div>
</template>
