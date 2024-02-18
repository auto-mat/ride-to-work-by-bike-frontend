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
    const selectedOption = ref<FormCardMerchType | null>(null);
    const selectedSize = ref<string>('');

    // show merch checkbox
    const isNotMerch = ref<boolean>(false);

    // dialog
    const isOpen = ref<boolean>(false);

    // options
    const options: FormCardMerchType[] = [
      {
        value: '1',
        label: 'Tričko 2023',
        image: 'https://cdn.quasar.dev/img/mountains.jpg',
        dialogTitle: 'Tričko Do práce na kole 2023',
        dialogImages: [
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
        ],
        dialogDescription:
          '<p>Biobavlna, originální ilustrace od oceňované výtvarnice a navíc podpora cyklodopravy. To je triko Do práce na kole. Pro pány v klasickém střihu, pro dámy v lehce projmutém.</p><p>"Všem, co jezdí do práce na kole: Jste frajeři a frajerky," vzkazuje autorka designu. A k samotnému motivu dodává: "Když jezdím v létě na kole po Praze, tak svého psa Jonáše, který jinak chodí všude se mnou, musím nechat doma…Tak jen sním o tom, jaké by měl kolo, kdyby na něm uměl, a jak by si jízdu s vlajícíma ušima užíval."</p>',
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
        label: 'Tričko 2022',
        image: 'https://cdn.quasar.dev/img/mountains.jpg',
        dialogTitle: 'Tričko Do práce na kole 2022',
        dialogImages: [
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
          'https://cdn.quasar.dev/img/mountains.jpg',
        ],
        dialogDescription:
          '<p>Biobavlna, originální ilustrace od oceňované výtvarnice a navíc podpora cyklodopravy. To je triko Do práce na kole. Pro pány v klasickém střihu, pro dámy v lehce projmutém.</p><p>"Všem, co jezdí do práce na kole: Jste frajeři a frajerky," vzkazuje autorka designu. A k samotnému motivu dodává: "Když jezdím v létě na kole po Praze, tak svého psa Jonáše, který jinak chodí všude se mnou, musím nechat doma…Tak jen sním o tom, jaké by měl kolo, kdyby na něm uměl, a jak by si jízdu s vlajícíma ušima užíval."</p>',
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

    const isSelected = (option: FormCardMerchType): boolean => {
      return selectedOption.value?.value === option.value;
    };

    const onOptionSelect = (option: FormCardMerchType): void => {
      selectedOption.value = option;
      isOpen.value = true;
    };

    return {
      optionsFemale,
      isNotMerch,
      isOpen,
      optionsGender,
      optionsMale,
      selectedOption,
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
          />
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
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Dialog -->
    <dialog-default v-model="isOpen">
      <template #title>
        <!-- Merch Title -->
        <span v-if="selectedOption">{{ selectedOption.dialogTitle }}</span>
      </template>
      <template #content>
        <div v-if="selectedOption">
          <!-- Merch Image Slider -->
          <!-- Merch Description -->
          <div v-html="selectedOption.dialogDescription"></div>
          <!-- Merch Gender -->
          <div class="q-pt-sm">
            <span class="text-caption text-weight-medium text-grey-10">{{
              $t('form.merch.labelVariant')
            }}</span>
            <form-field-radio-required
              inline
              v-model="selectedGender"
              :options="selectedOption.gender"
              class="q-mt-sm"
            />
          </div>
          <!-- Merch Size -->
          <div class="q-pt-sm">
            <span
              class="text-caption text-weight-medium text-grey-10"
              v-if="selectedGender === 'female'"
              >{{ $t('form.merch.labelSizeFemale') }}</span
            >
            <span
              class="text-caption text-weight-medium text-grey-10"
              v-if="selectedGender === 'male'"
              >{{ $t('form.merch.labelSizeMale') }}</span
            >
            <form-field-radio-required
              inline
              v-model="selectedSize"
              :options="selectedOption.sizes"
              class="q-mt-sm"
            />
          </div>
        </div>
      </template>
    </dialog-default>
  </q-card>
</template>
