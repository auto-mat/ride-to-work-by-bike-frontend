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
 * - `selected` (boolean, required): Whether or not option shows as selected.
 *
 * @events
 * - `select-option`: Emitted when user selects an option.
 *
 * @example
 * <form-card-merch />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103131&mode=dev)
 */

import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// types
import type { MerchandiseCard } from '../types/Merchandise';

export default defineComponent({
  name: 'FormCardMerch',
  props: {
    option: {
      type: Object as () => MerchandiseCard,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['select-option'],
  setup(props, { emit }) {
    const borderRadius: string = rideToWorkByBikeConfig.borderRadiusCard;
    const borderRadiusSmall: string =
      rideToWorkByBikeConfig.borderRadiusCardSmall;

    const selectOption = (option: MerchandiseCard) => {
      // only emit if option is not selected
      if (!props.selected) {
        emit('select-option', option);
      }
    };

    return {
      borderRadius,
      borderRadiusSmall,
      selectOption,
      props,
    };
  },
});
</script>

<template>
  <q-card
    flat
    :style="{ 'border-radius': borderRadius, 'max-width': '400px' }"
    class="q-pa-md"
    data-cy="form-card-merch"
    :data-selected="selected ? 'true' : 'false'"
  >
    <q-card-section class="q-pa-none" data-cy="form-card-merch-top">
      <!-- Image -->
      <q-img
        ratio="1.33"
        :src="props.option.image"
        data-cy="form-card-merch-image"
        :style="{ 'border-radius': borderRadiusSmall }"
      />
      <!-- Title -->
      <h3
        class="text-body1 text-black text-weight-bold q-my-sm"
        data-cy="form-card-merch-title"
      >
        <a
          href="#"
          class="text-black"
          @click.prevent="selectOption(option)"
          data-cy="form-card-merch-link"
          >{{ option.label }}</a
        >
      </h3>
      <!-- Parameters -->
      <dl class="q-my-sm" data-cy="form-card-merch-parameters">
        <div class="flex q-gutter-x-xs">
          <dt>{{ $t('form.merch.labelSizes') }}:</dt>
          <dd v-if="option.sizeOptions" class="text-weight-bold">
            <span v-for="(size, index) in option.sizeOptions" :key="size.label">
              {{ size.label }}
              <span v-if="index < option.sizeOptions.length - 1">, </span>
            </span>
          </dd>
        </div>
        <div class="flex q-gutter-x-xs">
          <dt>{{ $t('form.merch.labelAuthor') }}:</dt>
          <dd v-if="option.author" class="text-weight-bold">
            {{ option.author }}
          </dd>
        </div>
        <div class="flex q-gutter-x-xs">
          <dt>{{ $t('form.merch.labelMaterial') }}:</dt>
          <dd v-if="option.material" class="text-weight-bold">
            {{ option.material }}
          </dd>
        </div>
      </dl>
    </q-card-section>
    <q-card-section
      class="full-width flex items-center justify-center q-pa-none"
      data-cy="form-card-merch-button"
    >
      <!-- Button: more info -->
      <q-btn
        v-if="!selected"
        unelevated
        rounded
        outline
        color="primary"
        class="full-width"
        @click.prevent="selectOption(option)"
        data-cy="button-more-info"
      >
        {{ $t('navigation.select') }}
      </q-btn>
      <q-btn
        v-if="selected"
        unelevated
        rounded
        color="secondary"
        text-color="primary"
        icon-right="done"
        class="full-width"
        :disable="true"
        data-cy="button-selected"
      >
        {{ $t('navigation.selected') }}
      </q-btn>
    </q-card-section>
  </q-card>
</template>
