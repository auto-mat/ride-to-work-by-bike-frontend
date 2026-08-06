<script lang="ts">
/**
 * FormUpdateOccupation Component
 *
 * @description * Use this component to render a form for updating occupation.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `value` (number | null, required): Occupation ID value.
 * - `onClose` (function, required): Function to close the dialog.
 * - `loading` (boolean, optional): Loading state.
 *
 * @events
 * - `update:value`: Emitted when value successfully changes.
 *
 * @example
 * <form-update-occupation :value="138" @update:value="onUpdateOccupation">
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
  name: 'FormUpdateOccupation',
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

    const occupations = computed<FormSelectOptionNumberValue[]>(
      () => store.getOccupations,
    );

    const isLoadingOccupations = computed(() => store.isLoadingOccupations);

    const {
      optionsFiltered: filteredOccupations,
      onFilter: filterOccupations,
    } = useSelectSearch(occupations);

    const selectedOccupation = computed<FormSelectOptionNumberValue | null>({
      get: () => {
        if (occupations.value?.length && inputValue.value != null) {
          return (
            occupations.value.find(
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
      if (!store.getOccupations.length) {
        await store.loadOccupationsToStore(logger);
      }
    });

    const onCloseDialog = (): void => {
      props.onClose();
    };

    const onUpdateOccupation = (): void => {
      emit('update:value', inputValue.value);
      onCloseDialog();
    };

    return {
      occupations,
      filteredOccupations,
      filterOccupations,
      selectedOccupation,
      isLoadingOccupations,
      onCloseDialog,
      onUpdateOccupation,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateOccupation" data-cy="form-update-occupation">
    <!-- Label -->
    <label
      for="form-occupation"
      class="text-grey-10 text-caption text-bold"
      data-cy="form-label"
    >
      {{ $t('form.labelOccupation') }}
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
      v-model="selectedOccupation"
      :options="filteredOccupations"
      :loading="isLoadingOccupations"
      :disable="isLoadingOccupations"
      :rules="[(val) => val != null || $t('form.messageFieldRequired')]"
      @filter="filterOccupations"
      id="form-occupation"
      class="q-mt-sm"
      data-cy="form-occupation-select"
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
