<script lang="ts">
/* Component used to render dialog window which you can fill with custom content
Available slots:
- title
- metadata
- content
- buttons
- image
The content and image are rendered side by side in a scrollable dialog window
Internal Figma link: https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104737&mode=dev
*/

import { defineComponent, computed } from 'vue';

// types
import { DialogCard } from 'components/types';

export default defineComponent({
  name: 'VueDialogCard',
  props: {
    dialog: {
      type: Object as () => DialogCard,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const modalOpened = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
        emit('change');
      },
    });

    return {
      modalOpened,
    };
  },
});
</script>

<template>
  <q-dialog v-model="modalOpened" square data-cy="card-dialog">
    <q-card class="relative-position overflow-visible bg-white">
      <q-card-section class="q-pt-none" data-cy="dialog-header">
        <h3 class="text-h6 q-mt-sm q-pt-xs q-mb-none">
          <slot name="title" />
        </h3>
        <div class="meta flex flex-wrap items-center gap-x-32 gap-y-8 q-mt-sm">
          <slot name="metadata" />
          <!-- <div
            v-for="item in dialog.meta"
            :key="item.description"
            class="flex items-center text-blue-grey-7"
            data-cy="dialog-meta"
          >
            <q-icon
              v-if="item.icon"
              :name="item.icon"
              size="18px"
              class="q-pr-xs"
              color="blue-grey-3"
            />
            {{ item.description }}
          </div> -->
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section
        horizontal
        class="scroll items-center"
        data-cy="dialog-body"
        style="max-height: 50vh; flex-wrap: wrap"
      >
        <div class="col-12 col-md-6 q-px-md q-py-md">
          <slot name="content"></slot>
          <slot name="buttons"></slot>
          <div v-html="dialog.content" data-cy="dialog-content"></div>
          <q-btn
            v-if="dialog.calendar"
            color="black"
            unelevated
            rounded
            class="q-mt-md"
            data-cy="dialog-button"
          >
            <div class="flex items-center no-wrap">
              <q-icon left name="fa-solid fa-calendar-plus" size="xs" />
              <div class="text-center">
                {{ $t('index.cardEvent.addToCalendar') }}
              </div>
            </div>
          </q-btn>
        </div>
        <div v-if="dialog.image" class="col-12 col-md-6 q-px-md q-py-md">
          <slot name="image"></slot>
          <q-img :src="dialog.image" :ratio="1" data-cy="dialog-image" />
        </div>
      </q-card-section>

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

.gap-y-8 {
  row-gap: 8px;
}

.gap-x-32 {
  column-gap: 32px;
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
