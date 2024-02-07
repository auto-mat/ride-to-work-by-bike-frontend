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
 * - `FormCardMerch`: Component to render a merch card (option).
 *
 * @example
 * <form-field-list-merch />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=7003%3A32273&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// components
import FormCardMerch from 'src/components/form/FormCardMerch.vue';

// types
import type { FormCardMerchType } from 'src/components/types/Form';

export default defineComponent({
  name: 'FormFieldListMerch',
  components: {
    FormCardMerch,
  },
  setup() {
    const tab = ref('female');

    const selectedGender = ref<string | null>('female');
    const selectedModel = ref<string | null>('1');
    const selectedSize = ref<string | null>(null);

    const isNotMerch = ref<boolean>(false);

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
            label: 'Female',
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

    const femaleOptions = computed((): FormCardMerchType[] => {
      return options.filter((option: FormCardMerchType) => {
        const genderValues = option.gender.map(
          (gender: { value: string }) => gender.value,
        );
        return genderValues.includes('female');
      });
    });

    const maleOptions = computed((): FormCardMerchType[] => {
      return options.filter((option: FormCardMerchType) => {
        const genderValues = option.gender.map(
          (gender: { value: string }) => gender.value,
        );
        return genderValues.includes('male');
      });
    });

    const isSelected = (option: FormCardMerchType): boolean => {
      const isModel = selectedModel.value === option.value;
      const isGender = selectedGender.value === tab.value;
      return isModel && isGender;
    };

    return {
      femaleOptions,
      isNotMerch,
      isSelected,
      maleOptions,
      selectedModel,
      selectedSize,
      selectedGender,
      tab,
    };
  },
});
</script>

<template>
  <q-item tag="label" v-ripple data-cy="no-merch">
    <q-item-section avatar top>
      <q-checkbox dense v-model="isNotMerch" :val="true" color="primary" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-grey-10" data-cy="no-merch-label">{{
        $t('form.merch.labelNoMerch')
      }}</q-item-label>
      <q-item-label class="text-grey-8" caption data-cy="no-merch-hint">
        {{ $t('form.merch.hintNoMerch') }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-card
    v-show="!isNotMerch"
    flat
    class="q-mt-lg"
    style="max-width: 1024px"
    data-cy="list-merch"
  >
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      data-cy="list-merch-tabs"
    >
      <q-tab
        name="female"
        :label="$t('global.female')"
        data-cy="list-merch-tab-female"
      />
      <q-tab
        name="male"
        :label="$t('global.male')"
        data-cy="list-merch-tab-male"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="female" class="q-pa-none">
        <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
          <FormCardMerch
            v-for="option in femaleOptions"
            :option="option"
            :key="`${option.value}-female`"
            :selected="isSelected(option)"
            class="col-12 col-md-6 col-lg-4"
            data-cy="form-card-merch-female"
          >
            <!-- TODO: add form slot for merch customization within dialog -->
          </FormCardMerch>
        </div>
      </q-tab-panel>

      <q-tab-panel name="male">
        <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
          <FormCardMerch
            v-for="option in maleOptions"
            :option="option"
            :key="`${option.value}-female`"
            :selected="isSelected(option)"
            class="col-12 col-md-6 col-lg-4"
            data-cy="form-card-merch-male"
          >
            <!-- TODO: add form slot for merch customization within dialog -->
          </FormCardMerch>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>
