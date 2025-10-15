<script lang="ts">
/**
 * HeaderOrganization Component
 *
 * @description * Use this component to display information about an
 * organization.
 * Note: This component is commonly used on `CompanyCoordinatorPage`.
 *
 * @emits
 * - `export`: Emitted when the user clicks on the export button.
 *   It should have no payload and be handled in the parent component.
 *
 * @example
 * <header-organization />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104524&t=imgBE8Jw7Jgty90T-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// stores
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// types
import type {
  AdminOrganisation,
  AdminSubsidiary,
} from '../types/AdminOrganisation';

export default defineComponent({
  name: 'HeaderOrganization',
  emits: ['export'],
  setup() {
    const adminOrganisationStore = useAdminOrganisationStore();

    const currentAdminOrganisation = computed((): AdminOrganisation => {
      return adminOrganisationStore.getCurrentAdminOrganisation ?? {};
    });

    const organizationTitle = computed((): string => {
      return currentAdminOrganisation.value.name ?? '';
    });

    const organizationId = computed((): number => {
      return currentAdminOrganisation.value.ico ?? 0;
    });

    const subsidiaries = computed((): AdminSubsidiary[] => {
      return currentAdminOrganisation.value.subsidiaries ?? [];
    });

    const subsidiariesCount = computed((): number => {
      return subsidiaries.value.length;
    });

    // provides total count of members of all teams in all subsidiaries
    const membersCount = computed((): number => {
      if (!subsidiaries.value.length) {
        return 0;
      }
      return subsidiaries.value.reduce((totalMembers, subsidiary): number => {
        const subsidiaryMembers = subsidiary.teams.reduce(
          (teamTotal, team): number => {
            const teamMemberCount =
              team.members_without_paid_entry_fee_by_org_coord.length +
              team.members_with_paid_entry_fee_by_org_coord.length +
              team.other_members.length;
            return teamTotal + teamMemberCount;
          },
          0,
        );
        return totalMembers + subsidiaryMembers;
      }, 0);
    });

    return {
      organizationId,
      organizationTitle,
      subsidiariesCount,
      membersCount,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-y-md items-center" data-cy="header-organization">
    <!-- Organization data -->
    <div class="col-12 col-sm row q-col-gutter-x-md">
      <div class="col-auto q-mr-md">
        <q-avatar square size="96px" data-cy="header-organization-image">
          <q-icon
            color="secondary"
            name="svguse:icons/drawer_menu/icons.svg#lucide-building"
            size="96px"
            data-cy="header-organization-image-icon"
          />
        </q-avatar>
      </div>
      <div class="col">
        <div class="q-pt-sm" data-cy="header-organization-data">
          <!-- Title -->
          <h3
            class="text-h5 text-weight-bold q-my-none"
            data-cy="header-organization-title"
          >
            {{ organizationTitle }}
          </h3>
          <!-- Metadata -->
          <div class="row text-subtitle2 q-col-gutter-x-lg q-mt-xs">
            <!-- Organization ID -->
            <div v-if="organizationId" class="col-auto q-py-sm">
              {{ $t('coordinator.labelOrganizationId') }}:
              {{ organizationId }}
            </div>
            <!-- Branch -->
            <q-chip
              color="transparent"
              icon="mdi-office-building"
              data-cy="header-organization-branch-count"
            >
              {{ subsidiariesCount }}
              {{ $t('coordinator.labelBranches', subsidiariesCount) }}
            </q-chip>
            <!-- Members -->
            <q-chip
              color="transparent"
              icon="mdi-account"
              data-cy="header-organization-member-count"
            >
              {{ membersCount }}
              {{ $t('coordinator.labelMembers', membersCount) }}
            </q-chip>
          </div>
        </div>
      </div>
    </div>
    <!-- Button: Export -->
    <div class="col-12 col-sm-auto">
      <q-btn
        unelevated
        rounded
        outline
        color="primary"
        class="flex items-center"
        data-cy="header-organization-button-export"
        @click.prevent="$emit('export')"
      >
        <q-icon name="mdi-download" size="18px" class="q-mr-sm" />
        {{ $t('coordinator.buttonExportMembers') }}
      </q-btn>
    </div>
  </div>
</template>
