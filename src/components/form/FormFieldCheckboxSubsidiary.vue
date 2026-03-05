<script lang="ts">
/**
 * FormFieldCheckboxSubsidiary Component
 *
 * @description * Use this component to render a widget for selecting
 * all teams and members from a subsidiary.
 *
 * Note: This component is commonly used in `FormCreateInvoice`.
 *
 * @props
 * - `modelValue` (object, required): The object representing
 *   the selected members grouped by team. Part of v-model structure.
 *   It should be of type `{ [teamId: number]: number[] }`.
 * - `subsidiary` (InvoiceSubsidiary, required): The subsidiary object
 *   containing teams and members.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-checkbox-subsidiary
 *   v-model="selectedMembers"
 *   :subsidiary="subsidiary"
 * />
 */

// libraries
import { defineComponent, onMounted, ref } from 'vue';
import { nextTick } from 'process';

// components
import FormFieldCheckboxTeam from './FormFieldCheckboxTeam.vue';

// types
import type { InvoiceSubsidiary } from '../types/Invoice';

// fixtures
import invoiceFixture from '../../../test/cypress/fixtures/formCreateInvoice.json';

export default defineComponent({
  name: 'FormFieldCheckboxSubsidiary',
  components: { FormFieldCheckboxTeam },
  props: {
    subsidiary: {
      type: Object as () => InvoiceSubsidiary,
      required: true,
      default: invoiceFixture.subsidiaries[0],
    },
    modelValue: {
      type: Object as () => { [key: number]: number[] },
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // expanded by default
    const isExpanded = ref<boolean>(true);
    const isSubsidiaryChecked = ref<boolean>(false);

    /**
     * Get the array of selected payment IDs for a specific team
     * @param {number} teamId
     * @returns {number[]}
     */
    const getTeamSelections = (teamId: number): number[] => {
      return props.modelValue?.[teamId] || [];
    };
    /**
     * Get all payment IDs that belong to a specific team
     * @param {number} teamId
     * @returns {number[]}
     */
    const getAllTeamPaymentIds = (teamId: number): number[] => {
      const team = props.subsidiary.teams.find((t) => t.id === teamId);
      if (!team) return [];
      return team.members.map((member) => member.payment.id);
    };
    /**
     * Check if a specific team is fully selected
     * @param {number} teamId
     * @returns {boolean}
     */
    const isTeamFullySelected = (teamId: number): boolean => {
      const allPaymentIds = getAllTeamPaymentIds(teamId);
      const selectedIds = getTeamSelections(teamId);
      if (allPaymentIds.length === 0) return false;
      return allPaymentIds.length === selectedIds.length;
    };
    /**
     * Check if all teams in subsidiary are fully selected
     * @returns {boolean}
     */
    const areAllTeamsFullySelected = (): boolean => {
      if (props.subsidiary.teams.length === 0) return false;
      return props.subsidiary.teams.every((team) =>
        isTeamFullySelected(team.id),
      );
    };
    /**
     * Update the subsidiary checkbox state based on team selections
     * @returns {void}
     */
    const updateSubsidiaryCheckboxState = (): void => {
      isSubsidiaryChecked.value = areAllTeamsFullySelected();
    };
    /**
     * Emit updated selections to parent component
     * @param {object} updatedSelections
     * @returns {void}
     */
    const emitSelectionUpdate = (updatedSelections: {
      [key: number]: number[];
    }): void => {
      emit('update:modelValue', updatedSelections);
    };
    /**
     * Handle when a team's selection changes
     * Updates the selections object and recalculates subsidiary checkbox state
     * @param {number} teamId
     * @param {number[]} paymentIds
     */
    const handleTeamSelectionChange = (
      teamId: number,
      paymentIds: number[],
    ): void => {
      const updatedSelections = { ...props.modelValue };
      updatedSelections[teamId] = paymentIds;
      // emit updated selection
      emitSelectionUpdate(updatedSelections);
      // update subsidiary checkbox after Vue updates
      nextTick(() => {
        updateSubsidiaryCheckboxState();
      });
    };
    /**
     * Select all teams in the subsidiary
     * @returns {void}
     */
    const selectAllTeams = (): void => {
      const updatedSelections = { ...props.modelValue };
      // select all team payments
      props.subsidiary.teams.forEach((team) => {
        const allPaymentIds = team.members.map((member) => member.payment.id);
        updatedSelections[team.id] = allPaymentIds;
      });
      // emit updated selection
      emitSelectionUpdate(updatedSelections);
    };
    /**
     * Deselect all teams in the subsidiary
     * @returns {void}
     */
    const deselectAllTeams = (): void => {
      const updatedSelections = { ...props.modelValue };
      // clear all team payments
      props.subsidiary.teams.forEach((team) => {
        updatedSelections[team.id] = [];
      });
      // emit updated selection
      emitSelectionUpdate(updatedSelections);
    };
    /**
     * Handle subsidiary checkbox toggle
     * @param {boolean} isChecked
     * @returns {void}
     */
    const handleSubsidiaryCheckboxToggle = (isChecked: boolean): void => {
      if (isChecked) {
        selectAllTeams();
      } else {
        deselectAllTeams();
      }
    };

    onMounted(() => {
      updateSubsidiaryCheckboxState();
    });

    return {
      isExpanded,
      isSubsidiaryChecked,
      getTeamSelections,
      handleTeamSelectionChange,
      handleSubsidiaryCheckboxToggle,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-checkbox-subsidiary">
    <q-expansion-item v-model="isExpanded" dense default-opened>
      <template #header>
        <div
          class="row full-width items-center"
          data-cy="form-field-checkbox-subsidiary-expansion-header"
        >
          <h3
            class="text-body1 text-bold text-black q-my-none"
            data-cy="form-field-checkbox-subsidiary-title"
          >
            <!-- Checkbox: Select/deselect subsidiary -->
            <q-checkbox
              v-model="isSubsidiaryChecked"
              color="primary"
              :label="subsidiary.name"
              @update:model-value="handleSubsidiaryCheckboxToggle"
              data-cy="form-field-checkbox-subsidiary-input"
            />
          </h3>
        </div>
      </template>
      <!-- Teams within subsidiary -->
      <div class="q-pl-md">
        <form-field-checkbox-team
          v-for="team in subsidiary.teams"
          :key="team.id"
          class="q-gutter-col-sm"
          :team="team"
          :model-value="getTeamSelections(team.id)"
          @update:model-value="
            (value) => handleTeamSelectionChange(team.id, value)
          "
          data-cy="form-field-checkbox-team"
        />
      </div>
    </q-expansion-item>
  </div>
</template>

<style lang="css" scoped>
:deep(.q-expansion-item__container > .q-item) {
  padding: 0;
}
</style>
