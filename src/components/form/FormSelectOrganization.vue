<script lang="ts">
/**
 * FormSelectOrganization Component
 *
 * @description * Use this component to render a widget for selecting an
 * organization and branch address.
 *
 * Used in `RegisterChallengePage`.
 *
 * @components
 * - `FormFieldSelectTable`: Component to render a table of organizations.
 * - `FormFieldCompanyAddress`: Component to render a form for company address.
 *
 * @example
 * <form-select-organization />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6485-29122&t=WSuLWOqmq7XPPNnt-1)
 */

// libraries
import { defineComponent, computed } from 'vue';

// components
import FormFieldSelectTable from '../form/FormFieldSelectTable.vue';
import FormFieldCompanyAddress from '../form/FormFieldCompanyAddress.vue';

// composables
import { useSelectedOrganization } from 'src/composables/useSelectedOrganization';

// fixtures
import formOrganizationOptions from '../../../test/cypress/fixtures/formOrganizationOptions.json';

// types
import {
  Organization,
  OrganizationLevel,
  OrganizationType,
} from '../types/Organization';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

export default defineComponent({
  name: 'FormSelectOrganization',
  components: {
    FormFieldSelectTable,
    FormFieldCompanyAddress,
  },
  setup() {
    const organizations: Organization[] =
      formOrganizationOptions as Organization[];

    const registerChallengeStore = useRegisterChallengeStore();

    const organizationType = computed(
      (): OrganizationType =>
        registerChallengeStore.getOrganizationType ?? OrganizationType.company,
    );

    const {
      selectedAddress,
      addressOptions,
      organizationId,
      organizationOptions,
    } = useSelectedOrganization(organizations);

    return {
      selectedAddress,
      addressOptions,
      organizationId,
      organizationOptions,
      OrganizationLevel,
      organizationType,
    };
  },
});
</script>

<template>
  <div data-cy="form-select-organization">
    <form-field-select-table
      v-model="organizationId"
      :organization-level="OrganizationLevel.organization"
      :organization-type="organizationType"
      :options="organizationOptions"
      data-cy="form-select-table-company"
      :data-organization-type="organizationType"
    />
    <form-field-company-address
      v-model="selectedAddress"
      :options="addressOptions"
      data-cy="form-company-address"
    />
  </div>
</template>
