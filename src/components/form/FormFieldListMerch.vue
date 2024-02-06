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

    const selectedModel = ref<string | null>(null);
    const selectedSize = ref<string | null>(null);
    const selectedGender = ref<string | null>(null);

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

    return {
      selectedModel,
      selectedSize,
      selectedGender,
      femaleOptions,
      isNotMerch,
      maleOptions,
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
        data-cy="list-merch-tab"
      />
      <q-tab name="male" :label="$t('global.male')" data-cy="list-merch-tab" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="female">
        <q-option-group
          v-model="formValue"
          type="radio"
          :options="femaleOptions"
          class="option-grid"
          data-cy="list-merch-option-group"
        >
          <template v-slot:label="options">
            <FormCardMerch
              :option="options as FormCardMerchType"
              data-cy="form-card-merch"
            >
              <!-- TODO: add form slot for merch customization within dialog -->
            </FormCardMerch>
          </template>
        </q-option-group>
      </q-tab-panel>

      <q-tab-panel name="male">
        <q-option-group
          v-model="formValue"
          type="radio"
          :options="maleOptions"
          class="option-grid"
          data-cy="list-merch-option-group"
        >
          <template v-slot:label="options">
            <FormCardMerch :option="options as FormCardMerchType">
              <!-- TODO: add form slot for merch customization within dialog -->
            </FormCardMerch>
          </template>
        </q-option-group>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
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
// override default q-gutter-x-sm
:deep(.option-grid > *) {
  margin: 0;
}
.option-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0;
}
@media (max-width: $breakpoint-sm-max) {
  .option-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
