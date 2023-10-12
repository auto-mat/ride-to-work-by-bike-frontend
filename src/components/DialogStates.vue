<script lang="ts">
/**
 * DialogStates Component
 *
 * The `DialogStates` component renders a dialog with customizable content and
 * switchable states.
 *
 * @description
 * This component offers slots for title and content, and exposes methods to
 * control and switch between different dialog states.
 *
 * @slots
 * - `title`: For the title of the dialog.
 * - `content`: For the main content of the dialog. This slot also provides
 *   props for managing dialog states:
 *     - `state`
 *     - `setState`
 *     - `reset`
 *
 * @props
 * - `modelValue` (Boolean, required): Controls the visibility of the dialog.
 *
 * @events
 * - `update:modelValue`: Emitted when the dialog's visibility changes.
 * - `change`: Generic event for state changes.
 *
 * @example
 * <dialog-states v-model="isOpen">
 *   <template #title>
 *     <!-- Title content here -->
 *   </template>
 *   <template #content="{ state, setState, reset }">
 *     <!-- Main content here -->
 *   </template>
 * </dialog-states>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=1611%3A17872&mode=dev)
 */

import { defineComponent, ref, computed, Ref } from 'vue';

export default defineComponent({
  name: 'DialogStates',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const STATES = ['default', 'form'];

    const activeState: Ref<'default' | 'form'> = ref('default');

    const dialogOpen = computed({
      get: (): boolean => props.modelValue,
      set: (value: boolean): void => {
        emit('update:modelValue', value);
        emit('change');
      },
    });

    const setState = (value: 'form' | 'default'): void => {
      activeState.value = value;
    };

    const reset = (): void => {
      setState('default');
      dialogOpen.value = false;
    };

    return {
      STATES,
      dialogOpen,
      activeState,
      setState,
      reset,
    };
  },
});
</script>

<template>
  <q-dialog square persistent v-model="dialogOpen" data-cy="dialog-states">
    <q-card class="full-width relative-position overflow-visible bg-white">
      <!-- Dialog header -->
      <q-card-section data-cy="dialog-header" class="row">
        <!-- Navigation button: Default state (arrow) -->
        <q-btn
          v-if="activeState !== 'default'"
          round
          unelevated
          size="xs"
          color="transparent"
          class="q-mr-sm"
          @click.prevent="setState('default')"
        >
          <q-icon name="west" size="xs" color="black" />
        </q-btn>
        <!-- Title -->
        <h3 class="text-h6 q-my-none">
          <slot
            name="title"
            :state="activeState"
            :setState="setState"
            :reset="reset"
          />
        </h3>
      </q-card-section>

      <q-separator />

      <!-- Dialog body -->
      <q-card-section
        class="scroll items-center q-pa-none"
        data-cy="dialog-content"
        style="max-height: 50vh; flex-wrap: wrap"
      >
        <div class="q-py-md">
          <!-- Content for state Default -->
          <slot
            name="content"
            :state="activeState"
            :setState="setState"
            :reset="reset"
          ></slot>
        </div>
      </q-card-section>

      <!-- Button close dialog -->
      <q-card-actions
        class="-top-21 -right-21 inline-block absolute-top-right q-px-none q-py-none"
        data-cy="dialog-close"
      >
        <q-btn
          v-close-popup
          round
          unelevated
          color="blue-grey-1"
          icon="close"
          size="14px"
          class="text-blue-grey-10"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
// show overlapping close button
.q-dialog__inner > div {
  overflow: visible !important;
}

.-top-21 {
  top: -21px;
}

.-right-21 {
  right: -21px;
}
</style>
