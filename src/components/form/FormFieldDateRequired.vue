<script lang="ts">
/**
 * FormFieldDateRequired Component
 *
 * @description * Use this component to display a required date field.
 *
 * Note: This component is commonly used in `FormCompanyChallenge`.
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 * - `bgColor` (string, default: 'transparent'): The background color of the
 * - `name` (string, required): The name used for id and test selectors.
 * - `label` (string, required): The translation key for the label.
 * - `labelShort` (string): The translation key for the short label.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-date-required v-model="date" bg-color="white" name="date" :label="$t('form.labelDate')" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106325&t=Osf58JD9vxDJlHaW-1)
 */

// libraries
import { computed, defineComponent } from 'vue';
import { date } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';
import { useValidation } from '../../composables/useValidation';

export default defineComponent({
  name: 'FormFieldDateRequired',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String as () => 'white' | 'transparent',
      default: 'transparent',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    labelShort: {
      type: String,
    },
    minDate: {
      type: String,
      default: '',
    },
    maxDate: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const inputValue = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled } = useValidation();

    const dateFormat = 'DD. MM. YYYY';
    const qDateFormat = 'YYYY/MM/DD';

    /**
     * Cached boundary dates as Date objects
     * Computed once and reused for all validations
     */
    const minDateObj = computed(() =>
      props.minDate ? new Date(props.minDate) : null,
    );

    const maxDateObj = computed(() => {
      if (!props.maxDate) return null;
      const dateObj = new Date(props.maxDate);
      // Set to end of day (23:59:59.999) to make boundary truly inclusive
      return date.endOfDate(dateObj, 'day');
    });

    /**
     * Check if a date object is within the allowed range
     * @param dateObj - Date object to check
     * @returns true if date is within range or no range is set
     */
    const checkDateInRange = (dateObj: Date | null): boolean => {
      if (!dateObj) return false;
      if (!minDateObj.value && !maxDateObj.value) return true;
      if (!minDateObj.value || !maxDateObj.value) return true;

      // Use Quasar's isBetweenDates like challenge.ts does
      return date.isBetweenDates(dateObj, minDateObj.value, maxDateObj.value, {
        inclusiveFrom: true,
        inclusiveTo: true,
        onlyDate: true,
      });
    };

    /**
     * Check if date string is within allowed range (for QInput validation)
     * @param dateStr - Date string in DD. MM. YYYY format
     * @returns true if date is within range or no range is set
     */
    const isDateInRange = (dateStr: string): boolean => {
      if (!dateStr) return false;
      // Don't use date.isValid() on the string - it uses Date.parse() which doesn't recognize our format
      const dateObj = date.extractDate(dateStr, dateFormat);
      if (!dateObj) return false;
      return checkDateInRange(dateObj);
    };

    /**
     * Options function for QDate component
     * Limits selectable dates to the specified range
     * @param dateStr - Date string in YYYY/MM/DD format (QDate format)
     * @returns true if date is selectable
     */
    const dateOptions = (dateStr: string): boolean => {
      if (!props.minDate && !props.maxDate) return true;
      const dateObj = date.extractDate(dateStr, qDateFormat);
      if (!dateObj) return true;
      return checkDateInRange(dateObj);
    };

    /**
     * Formatted dates for display in error messages
     * Uses i18n 'numeric' format from dateTimeFormatsAllLocales config
     */
    const minDateFormatted = computed(() =>
      minDateObj.value ? i18n.global.d(minDateObj.value, 'numeric') : '',
    );

    const maxDateFormatted = computed(() =>
      props.maxDate ? i18n.global.d(new Date(props.maxDate), 'numeric') : '',
    );

    return {
      inputValue,
      isFilled,
      isDateInRange,
      dateOptions,
      minDateFormatted,
      maxDateFormatted,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-date">
    <!-- Label -->
    <label
      :for="`form-${name}`"
      class="text-grey-10 text-caption text-bold"
      :data-cy="`form-${name}-label`"
    >
      {{ $t(label) }}
    </label>

    <!-- Input -->
    <q-input
      dense
      outlined
      hide-bottom-space
      v-model="inputValue"
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: labelShort ? $t(labelShort) : $t(label),
          }),
        ...(minDate || maxDate
          ? [
              (val) =>
                isDateInRange(val) ||
                $t('form.messageFieldDateOutOfRange', {
                  minDate: minDateFormatted,
                  maxDate: maxDateFormatted,
                }),
            ]
          : []),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      :id="`form-${name}`"
      :name="name"
      mask="##. ##. ####"
      :data-cy="`form-${name}-input`"
    >
      <template v-slot:prepend>
        <q-icon
          name="event"
          class="cursor-pointer"
          :data-cy="`form-${name}-icon`"
        >
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              dense
              minimal
              outlined
              mask="DD. MM. YYYY"
              v-model="inputValue"
              color="primary"
              :options="dateOptions"
              data-cy="form-date-picker"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
