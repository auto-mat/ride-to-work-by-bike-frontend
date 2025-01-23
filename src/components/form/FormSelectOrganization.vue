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

// enums
import { OrganizationLevel, OrganizationType } from '../types/Organization';

// types
import type { FormSelectOption } from '../types/Form';
import type { Logger } from '../types/Logger';
import type { PostOrganizationResponse } from '../types/apiOrganization';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// composables
import { useApiGetOrganizations } from 'src/composables/useApiGetOrganizations';

export default defineComponent({
  name: 'FormSelectOrganization',
  components: {
    FormFieldSelectTable,
    FormFieldCompanyAddress,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const formFieldSelectTableRef = ref<typeof FormFieldSelectTable | null>(
      null,
    );

    const registerChallengeStore = useRegisterChallengeStore();
    const { mapOrganizationToOption } = useApiGetOrganizations(logger);

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
      set: (value: number | null) => {
        /**
         * Reset teamId if new value is different from current value
         * to avoid reset on component mount.
         */
        logger?.debug(
          `Subsidiary ID change to <${value}>, current value is <${registerChallengeStore.getSubsidiaryId}>.`,
        );
        if (value !== registerChallengeStore.getSubsidiaryId) {
          registerChallengeStore.setTeamId(null);
          logger?.debug(
            'Subsidiary ID change, reset' +
              ` team ID <${registerChallengeStore.getTeamId}>.`,
          );
        }
        // set new subsidiaryId value
        registerChallengeStore.setSubsidiaryId(value);
      },
    });

    const isLoading = computed(
      () => registerChallengeStore.isLoadingOrganizations,
    );
    const organizations = computed(
      () => registerChallengeStore.getOrganizations,
    );
    const options = computed<FormSelectOption[]>(() =>
      organizations.value.map(mapOrganizationToOption),
    );

    watch(
      organizationType,
      async (newValue: OrganizationType) => {
        logger?.debug(`Organization type updated to <${newValue}>`);
        if (newValue) {
          await registerChallengeStore.loadOrganizationsToStore(logger);
          logger?.info('All organizations data was loaded from the API.');
        }
      },
      { immediate: true },
    );

    const onOrganizationIdChange = (): void => {
      // reset subsidiaryId on organizationId change
      registerChallengeStore.setSubsidiaryId(null);
      logger?.debug(
        'Organization ID change, reset' +
          ` subsidiary ID <${registerChallengeStore.getSubsidiaryId}>.`,
      );
      // reset teamId on organizationId change
      registerChallengeStore.setTeamId(null);
      logger?.debug(
        'Organization ID change, reset' +
          ` team ID <${registerChallengeStore.getTeamId}>.`,
      );
    };

    const onCloseAddSubsidiaryDialog = () => {
      if (formFieldSelectTableRef.value) {
        // Run organization validation proccess before open add subsidiary dialog
        logger?.info('Run select organization widget validation process.');
        formFieldSelectTableRef.value.selectOrganizationRef.validate();
      }
    };

    /**
     * Prepend new organization option event handler
     * @param {PostOrganizationResponse} data - The new organization data.
     */
    const onCreateOption = (data: PostOrganizationResponse) => {
      const newOrganization = data;
      logger?.debug(
        `Add new organization to organizations options <${JSON.stringify(newOrganization, null, 2)}>.`,
      );
      const updatedOrganizations = [newOrganization, ...organizations.value];
      registerChallengeStore.setOrganizations(updatedOrganizations);
      logger?.debug(
        `Organizations options updated to <${JSON.stringify(updatedOrganizations, null, 2)}>.`,
      );
    };

    return {
      formFieldSelectTableRef,
      isLoading,
      organizationId,
      options,
      subsidiaryId,
      OrganizationLevel,
      organizationType,
      onCloseAddSubsidiaryDialog,
      onCreateOption,
      onOrganizationIdChange,
    };
  },
});
</script>

<template>
  <div data-cy="form-select-organization">
    <form-field-select-table
      ref="formFieldSelectTableRef"
      v-model="organizationId"
      :loading="isLoading"
      :options="options"
      :organization-level="OrganizationLevel.organization"
      :organization-type="organizationType"
      :data-organization-type="organizationType"
      @create:option="onCreateOption"
      @update:model-value="onOrganizationIdChange"
      data-cy="form-select-table-company"
    />
    <form-field-company-address
      v-model="subsidiaryId"
      data-cy="form-company-address"
      @close:addSubsidiaryDialog="onCloseAddSubsidiaryDialog"
    />
  </div>
</template>
