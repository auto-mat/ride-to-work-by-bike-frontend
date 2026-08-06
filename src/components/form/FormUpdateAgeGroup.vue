<script lang="ts">
/**
 * FormUpdateAgeGroup Component
 *
 * @description * Use this component to render a form for updating age group.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `value` (number | null, required): Age group ID value.
 * - `onClose` (function, required): Function to close the dialog.
 * - `loading` (boolean, optional): Loading state.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @example
 * <form-update-age-group :value="1990" @update:value="onUpdateAgeGroup">
 */

// libraries
import { computed, defineComponent, inject, onMounted, ref } from 'vue';

// composables
import { useSelectSearch } from 'src/composables/useSelectSearch';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { FormSelectOptionNumberValue } from '../types/Form';
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'FormUpdateAgeGroup',
  props: {
    value: {
      type: [Number, null],
      required: false,
      default: null,
    },
    onClose: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const store = useRegisterChallengeStore();
    const inputValue = ref<number | null>(null);

    const ageGroups = computed<FormSelectOptionNumberValue[]>(
      () => store.getAgeGroups,
    );

    const isLoadingAgeGroups = computed(() => store.isLoadingAgeGroups);

    const { optionsFiltered: filteredAgeGroups, onFilter: filterAgeGroups } =
      useSelectSearch(ageGroups);

    const selectedAgeGroup = computed<FormSelectOptionNumberValue | null>({
      get: () => {
        if (ageGroups.value?.length && inputValue.value != null) {
          return (
            ageGroups.value.find(
              (option) => option.value === inputValue.value,
            ) || null
          );
        }
        return null;
      },
      set: (newValue) => {
        inputValue.value = newValue?.value ?? null;
      },
    });

    onMounted(async () => {
      inputValue.value = props.value;
      // load options if not already loaded
      if (!store.getAgeGroups.length) {
        await store.loadAgeGroupsToStore(logger);
      }
    });

    const onCloseDialog = (): void => {
      props.onClose();
    };

    const onUpdateAgeGroup = (): void => {
      emit('update:value', inputValue.value);
      onCloseDialog();
    };

    return {
      ageGroups,
      filteredAgeGroups,
      filterAgeGroups,
      selectedAgeGroup,
      isLoadingAgeGroups,
      onCloseDialog,
      onUpdateAgeGroup,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateAgeGroup" data-cy="form-update-age-group">
    <!-- Label -->
    <label
      for="form-age-group"
      class="text-grey-10 text-caption text-bold"
      data-cy="form-label"
    >
      {{ $t('form.labelAgeGroup') }}
    </label>
    <!-- Select -->
    <q-select
      dense
      outlined
      use-input
      hide-selected
      fill-input
      hide-bottom-space
      input-debounce="0"
      v-model="selectedAgeGroup"
      :options="filteredAgeGroups"
      :loading="isLoadingAgeGroups"
      :disable="isLoadingAgeGroups"
      :rules="[(val) => val != null || $t('form.messageFieldRequired')]"
      @filter="filterAgeGroups"
      id="form-age-group"
      class="q-mt-sm"
      data-cy="form-age-group-select"
    />
    <div class="q-mt-xl flex justify-end gap-8">
      <!-- Button: Cancel -->
      <q-btn
        rounded
        unelevated
        outline
        color="primary"
        :label="$t('navigation.discardChanges')"
        @click.prevent="onCloseDialog"
        data-cy="form-button-cancel"
      />
      <!-- Button: Save -->
      <q-btn
        rounded
        unelevated
        type="submit"
        color="primary"
        :label="$t('navigation.save')"
        :loading="loading"
        data-cy="form-button-save"
      />
    </div>
  </q-form>
</template>
