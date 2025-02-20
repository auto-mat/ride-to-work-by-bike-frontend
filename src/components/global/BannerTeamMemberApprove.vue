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

// types
interface TeamMember {
  id: number;
  name: string;
  email: string;
}

// TODO: Remove these constants when integrating with store
const DUMMY_DATA = {
  isApproved: true,
  pendingMembersCount: 3,
  pendingMembers: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
  ] as TeamMember[],
};

export default defineComponent({
  name: 'BannerTeamMemberApprove',
  components: {
    DialogDefault,
  },
  setup() {
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;
    const isDialogOpen = ref(false);
    const memberDecisions = ref(
      new Map<number, TeamMemberStatus.approved | TeamMemberStatus.denied>(),
    );

    const openDialog = () => {
      isDialogOpen.value = true;
    };

    const onSave = () => {
      // TODO: Implement save functionality
      isDialogOpen.value = false;
    };

    const isApproved = computed(() => {
      return DUMMY_DATA.isApproved;
    });

    const pendingMembersCount = computed(() => {
      return DUMMY_DATA.pendingMembersCount;
    });

    const isBannerVisible = computed(() => {
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
      // TODO: Remove when integrating with store
      ...DUMMY_DATA,
      isApproved,
      isBannerVisible,
      pendingMembersCount,
      TeamMemberStatus,
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
                        memberDecisions.set(
                          member.id,
                          TeamMemberStatus.approved,
                        )
                      "
                      :label="$t('bannerTeamMemberApprove.buttonDialogApprove')"
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
                        memberDecisions.set(member.id, TeamMemberStatus.denied)
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
            >
              {{ $t('navigation.discard') }}
            </q-btn>
            <q-btn
              rounded
              unelevated
              color="primary"
              @click="onSave"
              data-cy="dialog-button-submit"
            >
              {{ $t('navigation.save') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
