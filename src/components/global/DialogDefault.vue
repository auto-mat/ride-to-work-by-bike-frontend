<script lang="ts">
/**
 * DialogDefault Component
 *
 * The `DialogDefault` component is used to render a dialog window that can be
 * customized with various slots.
 *
 * It provides slots for the following content:
 *
 * - `title`: For the title of the dialog.
 * - `content`: For the main content of the dialog.
 *
 * @props
 * - `modelValue` (Boolean, required): Controls the visibility of the dialog.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure
 *
 * @example
 * <dialog-default>
 *   <template v-slot:title>
 *     <!-- Title content here -->
 *   </template>
 *   <template v-slot:content>
 *     <!-- Main content here -->
 *   </template>
 * </dialog-default>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6014%3A46223&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'DialogDefault',
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['change', 'form-submit', 'update:modelValue'],
  setup(props, { emit }) {
    // determines if dialog window is open
    const isOpen = computed({
      get: (): boolean => props.modelValue,
      set: (value: boolean): void => {
        emit('update:modelValue', value);
      },
    });

    return {
      isOpen,
    };
  },
});
</script>

<template>
  <q-dialog square persistent v-model="isOpen" data-cy="dialog-form">
    <q-card
      class="relative-position overflow-visible bg-white"
      style="min-width: 50vw"
    >
      <!-- Section: Card header -->
      <q-card-section class="q-pt-none" data-cy="dialog-header">
        <!-- Title -->
        <h3 v-if="$slots.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">
          <slot name="title" />
        </h3>
        <!-- Metadata -->
        <div v-if="$slots.metadata">
          <slot name="metadata" />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Section: Card body -->
      <q-card-section
        v-if="$slots.content || $slots.buttons"
        :horizontal="horizontal"
        class="scroll items-center"
        data-cy="dialog-body"
        style="max-height: 70vh; flex-wrap: wrap"
      >
        <!-- Content -->
        <slot v-if="$slots.content" name="content"></slot>
      </q-card-section>

      <!-- Button: Close dialog -->
      <q-card-actions
        class="dialog-close__wrapper inline-block absolute-top-right q-px-none q-py-none"
      >
        <q-btn
          v-close-popup
          round
          unelevated
          color="blue-grey-1"
          icon="close"
          class="dialog-close text-grey-10"
          data-cy="dialog-close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.q-dialog__inner > div {
  overflow: visible !important;
}

.dialog-close__wrapper {
  top: -19px;
  right: -19px;
}

.dialog-close {
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
}
</style>
