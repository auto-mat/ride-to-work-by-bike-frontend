<script lang="ts">
/**
 * DialogCard Component
 *
 * The `DialogCard` component is used to render a dialog window that can be
 * customized with various slots.
 *
 * It provides slots for the following content:
 *
 * - `title`: For the title of the dialog.
 * - `metadata`: For additional metadata or information.
 * - `content`: For the main content of the dialog.
 * - `buttons`: For action buttons.
 * - `image`: For displaying an image alongside the content.
 *
 * The `content` and `image` slots are rendered side by side within
 * a scrollable dialog window (on desktop screens).
 *
 * @props
 * - `modelValue` (Boolean, required): Controls the visibility of the dialog.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure
 * - `change`: Emitted when the dialog is closed or opened
 *
 * @example
 * <dialog-card>
 *   <template #title>
 *     <!-- Title content here -->
 *   </template>
 *   <template #metadata>
 *     <!-- Metadata content here -->
 *   </template>
 *   <template #content>
 *     <!-- Main content here -->
 *   </template>
 *   <template #buttons>
 *     <!-- Action buttons here -->
 *   </template>
 *   <template #image>
 *     <!-- Image content here -->
 *   </template>
 * </dialog-card>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104737&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'DialogCard',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const dialogOpen = computed({
      get: (): boolean => props.modelValue,
      set: (value: boolean): void => {
        emit('update:modelValue', value);
        emit('change');
      },
    });

    return {
      dialogOpen,
    };
  },
});
</script>

<template>
  <q-dialog square persistent v-model="dialogOpen" data-cy="dialog-card">
    <q-card class="relative-position overflow-visible bg-white">
      <!-- Section: Card header -->
      <q-card-section class="q-pt-none" data-cy="dialog-header">
        <!-- Title -->
        <h3 class="text-h6 q-mt-sm q-pt-xs q-mb-none">
          <slot v-if="$slots.title" name="title" />
        </h3>
        <!-- Metadata -->
        <div>
          <slot v-if="$slots.metadata" name="metadata" />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Section: Card body -->
      <q-card-section
        horizontal
        class="scroll items-center"
        data-cy="dialog-body"
        style="max-height: 50vh; flex-wrap: wrap"
      >
        <!-- Left column: Content -->
        <div class="col-12 col-md-6 q-px-md q-py-md" data-cy="dialog-col-left">
          <!-- Content -->
          <slot v-if="$slots.content" name="content"></slot>
          <!-- Buttons -->
          <slot v-if="$slots.buttons" name="buttons"></slot>
        </div>
        <!-- Right column: Image -->
        <div class="col-12 col-md-6 q-px-md q-py-md" data-cy="dialog-col-right">
          <!-- Image -->
          <slot v-if="$slots.image" name="image"></slot>
        </div>
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
