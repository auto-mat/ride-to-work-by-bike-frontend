// libraries
import { ref, watch } from 'vue';

// types
import type {
  FormSelectOption,
  FormSelectTableOption,
} from '../components/types/Form';
import type { Ref } from 'vue';

/**
 * Composable for handling search functionality in select components
 * @param {Ref<FormSelectOption[]|FormSelectTableOption[]>} options - The full list of options to search through
 * @returns {object} - Object containing filtered options and filter function
 */
export const useSelectSearch = (
  options: Ref<FormSelectOption[] | FormSelectTableOption[]>,
) => {
  const optionsFiltered = ref<FormSelectOption[]>([]);

  /**
   * Filter function for select components
   * Upon typing, find strings which contain query entered into the select
   * @param val The search value
   * @param update Function to update the filtered options
   */
  const onFilter = (val: string, update: (fn: () => void) => void) => {
    update(() => {
      const valLowerCase = val.toLocaleLowerCase();
      optionsFiltered.value = options.value.filter(
        (option) => option.label.toLocaleLowerCase().indexOf(valLowerCase) > -1,
      );
    });
  };

  // Watch for changes in source options and update filtered options with empty query
  watch(
    () => options,
    () => {
      optionsFiltered.value = options.value;
    },
    { immediate: true },
  );

  return {
    optionsFiltered,
    onFilter,
  };
};
