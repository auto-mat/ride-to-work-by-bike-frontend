<script lang="ts">
/**
 * FormCardMerch Component
 *
 * The `FormCardMerch` is used in FormFieldOptionGroup to show merch options.
 *
 * @description * Use this component to display options in the form.
 *
 * Note: This component is commonly used in `FormFieldOptionGroup`.
 *
 * @props
 * - `option` (object, required): The object representing the option.
 *   It should be of type `object` with the following properties:
 *   - dialogDescription (string)
 *   - dialogImages (Array<string>)
 *   - dialogTitle (string)
 *   - image (string)
 *   - title (string)
 *   - sizes (Array)
 *   - gender (Array)
 *   - author (string)
 *   - material (string)
 *
 * @events
 * - `update:formValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `form`: For displaying form (size options) within dialog.
 *
 * @components
 * - `DialogDefault`: Component to display dialog.
 *
 * @example
 * <form-card-merch />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103131&mode=dev)
 */

import { defineComponent, ref } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// types
import type { FormCardMerch } from 'src/components/types/Form';

export default defineComponent({
  name: 'FormCardMerch',
  props: {
    option: {
      type: Object as () => FormCardMerch,
      required: true,
    },
  },
  setup() {
    const isOpen = ref<boolean>(false);

    const borderRadius: string = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
      isOpen,
    };
  },
});
</script>

<template>
  <q-card
    flat
    bordered
    :style="{ 'border-radius': borderRadius, 'max-width': '400px' }"
    data-cy="form-card-merch"
  >
    <q-card-section class="q-pa-md" data-cy="form-card-merch-top">
      <!-- Image -->
      <q-img ratio="1.33" :src="option.image" data-cy="form-card-merch-image" />
      <!-- Title -->
      <h3
        class="text-body1 text-black text-weight-bold q-my-md"
        data-cy="form-card-merch-title"
      >
        {{ option.title }}
      </h3>
      <!-- Parameters -->
      <dl class="q-mt-sm" data-cy="form-card-merch-parameters">
        <div class="flex q-gutter-x-xs">
          <dt>{{ $t('form.merch.labelSizes') }}:</dt>
          <dd class="text-weight-bold">
            <span v-for="(size, index) in option.sizes" :key="size.value">
              {{ size.label
              }}<span v-if="index < option.sizes.length - 1">, </span>
            </span>
          </dd>
        </div>
        <div class="flex q-gutter-x-xs">
          <dt>{{ $t('form.merch.labelAuthor') }}:</dt>
          <dd class="text-weight-bold">{{ option.author }}</dd>
        </div>
        <div class="flex q-gutter-x-xs">
          <dt>{{ $t('form.merch.labelMaterial') }}:</dt>
          <dd class="text-weight-bold">{{ option.material }}</dd>
        </div>
      </dl>
    </q-card-section>
    <!-- Separator -->
    <q-separator />
    <q-card-section
      class="full-width flex items-center justify-center q-pa-sm"
      data-cy="form-card-merch-button"
    >
      <!-- Button: more info -->
      <q-btn
        flat
        rounded
        class="full-width"
        @click.prevent="isOpen = true"
        data-cy="button-more-info"
      >
        {{ $t('navigation.moreInfo') }}
      </q-btn>
    </q-card-section>
  </q-card>
</template>
