<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';

// Component used to render dialog window which you can fill with custom content
// Allows to switch between states
// Available states:
// - default
// - form
// Available slots:
// - title
// - content
// Exposed v-slot props
// - state
// - setState
// - reset
// The content and image are rendered side by side in a scrollable dialog window
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
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
        emit('change');
      },
    });

    const setState = (value: 'form' | 'default'): void => {
      activeState.value = value;
    };

    const reset = () => {
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
