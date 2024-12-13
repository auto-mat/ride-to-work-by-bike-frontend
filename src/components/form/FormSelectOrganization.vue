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
import { defineComponent, computed, inject, watch, ref } from 'vue';

// components
import FormFieldSelectTable from '../form/FormFieldSelectTable.vue';
import FormFieldCompanyAddress from '../form/FormFieldCompanyAddress.vue';

// composables
import { useApiGetOrganizations } from 'src/composables/useApiGetOrganizations';

// types
import { OrganizationLevel, OrganizationType } from '../types/Organization';
import { Logger } from '../types/Logger';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

export default defineComponent({
  name: 'FormSelectOrganization',
  components: {
    FormFieldSelectTable,
    FormFieldCompanyAddress,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const opts = ref([]);
    const { options, isLoading, loadOrganizations } =
      useApiGetOrganizations(logger);

    const registerChallengeStore = useRegisterChallengeStore();

    const organizationType = computed(
      (): OrganizationType => registerChallengeStore.getOrganizationType,
    );

    const organizationId = computed<number | null>({
      get: (): number | null =>
        registerChallengeStore.getOrganizationId
          ? registerChallengeStore.getOrganizationId
          : null,
      set: (value: number | null) =>
        registerChallengeStore.setOrganizationId(value),
    });

    const subsidiaryId = computed<number | null>({
      get: (): number | null => registerChallengeStore.getSubsidiaryId,
      set: (value: number | null) =>
        registerChallengeStore.setSubsidiaryId(value),
    });
    watch(
      organizationType,
      (newValue: OrganizationType) => {
        logger?.debug(`Organization type updated to <${newValue}>`);
        if (newValue) {
          loadOrganizations(newValue).then(() => {
            logger?.info('All organizations data was loaded from the API.');
            // Lazy loading
            opts.value = options;
          });
        }
      },
      { immediate: true },
    );

    return {
      isLoading,
      organizationId,
      opts,
      subsidiaryId,
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
      :loading="isLoading"
      :options="opts.value"
      :organization-level="OrganizationLevel.organization"
      :organization-type="organizationType"
      :data-organization-type="organizationType"
      data-cy="form-select-table-company"
    />
    <form-field-company-address
      v-model="subsidiaryId"
      data-cy="form-company-address"
    />
  </div>
</template>
