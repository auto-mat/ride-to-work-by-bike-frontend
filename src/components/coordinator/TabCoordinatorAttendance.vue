<script lang="ts">
/**
 * TabCoordinatorAttendance Component
 *
 * @description * Use this component to show attendance tab on the Coordinator page.
 *
 * @components
 * - `HeaderOrganization`: Component to display a header with organization information.
 * - `TableAttendance`: Component to display a table with attendance information.
 *
 * @example
 * <tab-coordinator-attendance />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104524&t=cE89xyWvJn6O0GHe-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import HeaderOrganization from './HeaderOrganization.vue';
import TableAttendance from './TableAttendance.vue';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { Organization } from '../types/Organization';

export default defineComponent({
  name: 'TabCoordinatorAttendance',
  components: {
    HeaderOrganization,
    TableAttendance,
  },
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();

    const organizationName = computed((): string => {
      const org = registerChallengeStore.getOrganizations.find(
        (organization) =>
          organization.id === registerChallengeStore.getOrganizationId,
      );
      if (org) {
        return org.name;
      }
      return '';
    });

    // TODO: Load dynamic data
    const organization = computed((): Organization => {
      return {
        address: undefined,
        description: undefined,
        id: 123,
        identificationNumber: '87654321',
        organizationType: registerChallengeStore.getOrganizationType,
        title: organizationName.value,
        subsidiaries: [
          {
            id: 123,
            teams: [],
            title: 'Test',
          },
        ],
      };
    });

    return {
      organization,
    };
  },
});
</script>

<template>
  <div>
    <header-organization :organization="organization" class="q-mt-sm" />
    <table-attendance class="q-mt-xl" />
  </div>
</template>
