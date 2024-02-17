<script lang="ts">
/**
 * FormFieldListMerch Component
 *
 * The `FormFieldListMerch`
 *
 * @description * Use this component to render a list of t-shirts.
 *
 * Note: This component is commonly used in `FormRegisterChallenge`.
 *
 * @props
 * - `formValue` (FormMerchFields, required): The object representing form state.
 *   It should be of type `FormMerchFields`.
 *
 * @events
 * - `update:formValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Component to display dialog.
 * - `FormCardMerch`: Component to render a merch card (option).
 * - `FormFieldRadioRequired`: Component to render radio buttons.
 *
 * @example
 * <form-field-list-merch />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=7003%3A32273&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// components
import DialogDefault from 'src/components/global/DialogDefault.vue';
import FormCardMerch from 'src/components/form/FormCardMerch.vue';
import FormFieldRadioRequired from 'src/components/form/FormFieldRadioRequired.vue';

// types
import type { FormCardMerchType, FormOption } from 'src/components/types/Form';

export default defineComponent({
  name: 'FormFieldListMerch',
  components: {
    DialogDefault,
    FormCardMerch,
    FormFieldRadioRequired,
  },
  setup() {
    // selected options
    const selectedGender = ref<string>('female');
    const selectedOptionId = ref<string>('1');
    const selectedSize = ref<string>('');

    // show merch checkbox
    const isNotMerch = ref<boolean>(false);

    // dialog
    const isOpen = ref<boolean>(false);

    // options
    const options: FormCardMerchType[] = [
      {
        value: '1',
        label: 'T-Shirt',
        image: 'https://cdn.quasar.dev/img/mountains.jpg',
        dialogTitle: 'T-Shirt',
        dialogImages: [
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
        ],
        dialogDescription: 'T-Shirt',
        gender: [
          {
            label: 'Female',
            value: 'female',
          },
          {
            label: 'Male',
            value: 'male',
          },
        ],
        sizes: [
          {
            label: 'S',
            value: 'S',
          },
          {
            label: 'M',
            value: 'M',
          },
          {
            label: 'L',
            value: 'L',
          },
        ],
        material: 'Bavlna',
        author: 'Cotton lady',
      },
      {
        value: '2',
        label: 'T-Shirt',
        image: 'https://cdn.quasar.dev/img/mountains.jpg',
        dialogTitle: 'T-Shirt',
        dialogImages: [
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
        ],
        dialogDescription: 'T-Shirt',
        gender: [
          {
            label: 'Female',
            value: 'female',
          },
        ],
        sizes: [
          {
            label: 'S',
            value: 'S',
          },
        ],
        material: 'Bavlna',
        author: 'Jaromír 99',
      },
    ];
    const optionsGender: FormOption[] = [
      {
        label: 'Female',
        value: 'female',
      },
      {
        label: 'Male',
        value: 'male',
      },
    ];
    const optionsFemale = computed((): FormCardMerchType[] => {
      return options.filter((option: FormCardMerchType) => {
        const genderValues = option.gender.map(
          (gender: FormOption) => gender.value,
        );
        return genderValues.includes('female');
      });
    });
    const optionsMale = computed((): FormCardMerchType[] => {
      return options.filter((option: FormCardMerchType) => {
        const genderValues = option.gender.map(
          (gender: FormOption) => gender.value,
        );
        return genderValues.includes('male');
      });
    });

    const selectedOption = computed((): FormCardMerchType | undefined => {
      return options.find((option: FormCardMerchType) => {
        return option.value === selectedOptionId.value;
      });
    });

    const isSelected = (option: FormCardMerchType): boolean => {
      const isModel = selectedOptionId.value === option.value;
      return isModel;
    };

    const onOptionSelect = (option: FormCardMerchType): void => {
      selectedOptionId.value = option.value;
      isOpen.value = true;
    };

    return {
      optionsFemale,
      isNotMerch,
      isOpen,
      optionsGender,
      optionsMale,
      selectedOption,
      selectedOptionId,
      selectedSize,
      selectedGender,
      onOptionSelect,
      isSelected,
    };
  },
});
</script>

<template>
  <!-- Checkbox: No merch -->
  <q-item tag="label" v-ripple data-cy="no-merch">
    <q-item-section avatar top>
      <q-checkbox dense v-model="isNotMerch" :val="true" color="primary" />
    </q-item-section>
    <q-item-section>
      <!-- Checkbox title -->
      <q-item-label class="text-grey-10" data-cy="no-merch-label">{{
        $t('form.merch.labelNoMerch')
      }}</q-item-label>
      <!-- Checkbox hint -->
      <q-item-label class="text-grey-8" caption data-cy="no-merch-hint">
        {{ $t('form.merch.hintNoMerch') }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <!-- Tabs: Merch -->
  <q-card
    v-show="!isNotMerch"
    flat
    class="q-mt-lg"
    style="max-width: 1024px"
    data-cy="list-merch"
  >
    <!-- Tab buttons -->
    <q-tabs
      v-model="selectedGender"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      data-cy="list-merch-tabs"
    >
      <!-- Button: Female -->
      <q-tab
        name="female"
        :label="$t('global.female')"
        data-cy="list-merch-tab-female"
      />
      <!-- Button: Male -->
      <q-tab
        name="male"
        :label="$t('global.male')"
        data-cy="list-merch-tab-male"
      />
    </q-tabs>

    <q-separator />

    <!-- Tab panels -->
    <q-tab-panels v-model="selectedGender" animated>
      <!-- Tab panel: Female -->
      <q-tab-panel name="female" class="q-pa-none">
        <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
          <!-- Card: Merch (includes dialog) -->
          <FormCardMerch
            v-for="option in optionsFemale"
            :option="option"
            :key="`${option.value}-female`"
            :selected="isSelected(option)"
            class="col-12 col-md-6 col-lg-4"
            data-cy="form-card-merch-female"
            @select-option="onOptionSelect(option)"
          >
            <!-- TODO: add form slot for merch customization within dialog -->
            <!-- Radio: Gender (corresponds to selected tab) -->
            <form-field-radio-required
              inline
              v-model="selectedGender"
              :options="optionsGender"
              label="Varianta"
            />
            <!-- Radio: Size -->
            <form-field-radio-required
              v-model="selectedSize"
              :options="option.sizes"
              label="Velikost"
            />
          </FormCardMerch>
        </div>
      </q-tab-panel>

      <!-- Tab panel: Male -->
      <q-tab-panel name="male">
        <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
          <!-- Card: Merch (includes dialog) -->
          <FormCardMerch
            v-for="option in optionsMale"
            :option="option"
            :key="`${option.value}-female`"
            :selected="isSelected(option)"
            class="col-12 col-md-6 col-lg-4"
            data-cy="form-card-merch-male"
            @select-option="onOptionSelect(option)"
          >
            <!-- TODO: add form slot for merch customization within dialog -->
          </FormCardMerch>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Dialog -->
    <dialog-default v-model="isOpen">
      <template #content>
        <!-- Merch Image Slider -->
        <!-- Merch Description -->
        <!-- Merch Variant -->
        <!-- Merch Size -->
      </template>
    </dialog-default>
  </q-card>
</template>
