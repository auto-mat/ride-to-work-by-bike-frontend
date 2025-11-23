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
    const dateFormatInputMask = 'DD. MM. YYYY';

    const minDateObj = computed(() =>
      props.minDate ? new Date(props.minDate) : null,
    );
    const maxDateObj = computed(() =>
      props.maxDate ? date.endOfDate(new Date(props.maxDate), 'day') : null,
    );

    /**
     * Check if a date object is within the allowed range
     * @param dateObj - Date object to check
     * @returns true if date is within range or no range is set
     *          false if no dateObj is provided
     */
    const checkDateInRange = (dateObj: Date | null): boolean => {
      if (!dateObj) return false;
      if (!minDateObj.value || !maxDateObj.value) return true;
      return date.isBetweenDates(dateObj, minDateObj.value, maxDateObj.value, {
        inclusiveFrom: true,
        inclusiveTo: true,
        onlyDate: true,
      });
    };

    /**
     * Validation function for QInput connected to QDate
     * @param dateStr - Date string as DD. MM. YYYY (input mask format)
     * @returns true if date is within range or no range is set
     *          false if date is out of range or invalid
     */
    const isDateInRange = (dateStr: string): boolean => {
      const dateObj = date.extractDate(dateStr, dateFormatInputMask);
      return checkDateInRange(dateObj);
    };

    /**
     * Options function for QDate component
     * Limits selectable dates to given range
     * @param dateStr - Date string as YYYY/MM/DD (internal QDate format)
     * @returns true if date is selectable
     *          false if date is out of range
     */
    const dateOptions = (dateStr: string): boolean => {
      const dateObj = date.extractDate(dateStr, 'YYYY/MM/DD');
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
      maxDateObj.value ? i18n.global.d(maxDateObj.value, 'numeric') : '',
    );

    return {
      inputValue,
      isFilled,
      isDateInRange,
      dateOptions,
      dateFormatInputMask,
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
        (val) =>
          isDateInRange(val) ||
          $t('form.messageFieldDateOutOfRange', {
            minDate: minDateFormatted,
            maxDate: maxDateFormatted,
          }),
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
              :mask="dateFormatInputMask"
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
