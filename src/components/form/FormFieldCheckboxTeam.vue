<script lang="ts">
/**
 * FormFieldCheckboxTeam Component
 *
 * @description * Use this component to render a widget for selecting
 * members from a team.
 *
 * Note: This component is commonly used in `FormCreateInvoice`.
 *
 * @props
 * - `modelValue` (string[], required): The object representing
 *   the selected team members. Part of v-model structure.
 *   It should be of type `string[]`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-checkbox-team v-model="selectedMembers">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106291&t=povrLFpvc5uJh2Td-1)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// composables
import { useFormatPrice } from 'src/composables/useFormatPrice';
import { nextTick } from 'process';

// fixtures
import teamFixture from '../../../test/cypress/fixtures/formCreateInvoiceTeam.json';

export default defineComponent({
  name: 'FormFieldCheckboxTeam',
  props: {
    team: {
      type: Object,
      required: true,
      default: teamFixture,
    },
    modelValue: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isSelectedTeam = ref<boolean>(false);
    const selectedMembers = computed({
      get: (): string[] => {
        return props.modelValue;
      },
      set: (value: string[]): void => {
        emit('update:modelValue', value);
      },
    });

    const { formatPriceCurrency } = useFormatPrice();

    /**
     * Handles member selection.
     * If all members are selected, team is selected.
     * If all members are deselected, team is deselected.
     * @returns void
     */
    const onChangeMember = (): void => {
      // wait for next tick to get the updated value after emitting
      nextTick(() => {
        if (selectedMembers.value.length === props.team.members.length) {
          isSelectedTeam.value = true;
        } else {
          isSelectedTeam.value = false;
        }
      });
    };

    /**
     * Handles team selection.
     * If team is not selected, all members are deselected.
     * If team is selected, all members are selected.
     * @returns void
     */
    const onChangeTeam = (): void => {
      if (!isSelectedTeam.value) {
        selectedMembers.value = [];
      } else {
        selectedMembers.value = props.team.members.map((member) => member.id);
      }
    };

    return {
      isSelectedTeam,
      selectedMembers,
      formatPriceCurrency,
      onChangeMember,
      onChangeTeam,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-checkbox-team">
    <!-- Team name -->
    <h3
      class="text-body1 text-bold text-black q-my-none"
      data-cy="form-field-checkbox-team-title"
    >
      <!-- Checkbox: Select/deselect team -->
      <q-checkbox
        v-model="isSelectedTeam"
        color="primary"
        :label="team.name"
        @update:model-value="onChangeTeam"
        data-cy="form-field-checkbox-team-input"
      />
    </h3>
    <q-list class="row">
      <!-- Team members -->
      <q-item
        class="col-12 col-sm-6"
        dense
        v-for="member in team.members"
        :key="member.id"
        tag="label"
        v-ripple
        data-cy="form-field-checkbox-team-item"
      >
        <q-item-section avatar>
          <!-- Checkbox: Member -->
          <q-checkbox
            v-model="selectedMembers"
            :val="member.id"
            color="primary"
            @update:model-value="onChangeMember"
          />
        </q-item-section>
        <q-item-section>
          <!-- Label: Member -->
          <q-item-label>
            <div class="flex justify-between">
              <span>{{ member.name }}</span>
              <span class="text-weight-bold">{{
                formatPriceCurrency(member.amount, 'CZK')
              }}</span>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
