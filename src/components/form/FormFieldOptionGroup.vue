<script lang="ts">
/**
 * FormFieldOptionGroup Component
 *
 * The `FormFieldOptionGroup` displays option group input.
 *
 * @description * Use this component to render option groups with icon title
 * and description in the form of cards.
 *
 * Note: This component is commonly used in `FormRegisterChallenge`.
 *
 * @props
 * - `modelValue` (string, required): The object representing user input.
 * - `name` (string, required): The name used for id and test selectors.
 * - `label` (string, required): The translation key for the label.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-option-group v-model="value" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5350%3A24169&mode=dev)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent, computed } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

// types
import { ConfigGlobal } from '../types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);

export default defineComponent({
  name: 'FormFieldOptionGroup',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled } = useValidation();

    const options = [
      {
        label: 'S kolegy z práce',
        description: 'Svolení zaměstnavatele nepotřebujete',
        value: 'option-1',
        icon: 'favorite',
      },
      {
        label: 'Se spolužáky ze školy',
        description: 'Svolení školy nepotřebujete',
        value: 'option-2',
        icon: 'flight_takeoff',
      },
      {
        label: 'S rodinou či přáteli',
        value: 'option-3',
        icon: 'flight_land',
      },
    ];

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    const { getPaletteColor } = colors;
    const grey3 = getPaletteColor('grey-3');
    const primary = getPaletteColor('primary');

    return {
      borderRadius,
      grey3,
      inputValue,
      options,
      primary,
      isFilled,
    };
  },
});
</script>

<template>
  <q-field
    dense
    borderless
    hide-bottom-space
    :model-value="inputValue"
    :rules="[(val) => !!val || $t('form.messageOptionRequired')]"
  >
    <q-option-group
      v-model="inputValue"
      type="radio"
      :options="options"
      class="q-gutter-md"
      data-cy="form-field-option-group"
    >
      <!-- Custom option content -->
      <template v-slot:label="opt">
        <div
          class="full-width row items-center bg-white q-py-md q-px-md"
          :class="[opt.value === inputValue ? '' : 'bg-white']"
          :style="{
            'border-radius': borderRadius,
            'border-width': '1px',
            'border-style': 'solid',
            'border-color': opt.value === inputValue ? primary : grey3,
          }"
          data-cy="form-field-option"
        >
          <!-- First column: Icon -->
          <div v-if="opt.label" class="col-auto q-mr-sm">
            <q-avatar
              round
              class="bg-blue-grey-2"
              data-cy="form-field-option-icon"
            >
              <q-icon :name="opt.icon" color="grey-9" size="24px" />
            </q-avatar>
          </div>
          <!-- Second column: Label -->
          <div class="col" data-cy="form-field-option-title">
            <div v-if="opt.label" class="text-body1 text-black">
              {{ opt.label }}
            </div>
            <div v-if="opt.description" class="text-caption text-black">
              {{ opt.description }}
            </div>
          </div>
          <!-- Third column: Check -->
          <div class="col-auto q-ml-md">
            <q-avatar round size="24px" data-cy="form-field-option-check">
              <q-icon
                v-show="opt.value === inputValue"
                name="done"
                color="primary"
                size="24px"
              />
            </q-avatar>
          </div>
        </div>
      </template>
    </q-option-group>
  </q-field>
</template>

<style scoped lang="scss">
// hide radio button
:deep(.q-radio__inner) {
  display: none;
}
:deep(.q-radio) {
  width: 100%;
}
:deep(.q-radio__label) {
  width: 100%;
}
</style>
