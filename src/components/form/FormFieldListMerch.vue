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
import { defineComponent, ref } from 'vue';

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

    const formValue = ref();

    const options: FormCardMerchType[] = [
      {
        id: '1',
        title: 'T-Shirt',
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
        material: 'Cotton',
        author: 'Cotton lady',
      },
    ];

    return {
      formValue,
      options,
      tab,
    };
  },
});
</script>

<template>
  <q-card data-cy="form-field-list-merch">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="female" :label="$t('global.female')" />
      <q-tab name="male" :label="$t('global.male')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="female">
        <q-option-group
          v-model="formValue"
          type="radio"
          :options="options"
          class="q-gutter-md"
        >
          <template v-slot:label="opt">
            <FormCardMerch :option="opt as FormCardMerchType"> </FormCardMerch>
          </template>
        </q-option-group>
      </q-tab-panel>

      <q-tab-panel name="male">
        <div class="text-h6">{{ $t('global.male') }}</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
</style>
