<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: 'VueCardDialog',
  props: {
    dialog: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      required: true,
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const modalOpened = computed({
      get() {
        return props.opened
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    return {
      modalOpened
    }
  }
})
</script>

<template>
  <q-dialog v-model="modalOpened" square data-cy="card-dialog">
    <q-card class="relative-position overflow-visible">
      <q-card-section class="q-pt-none" data-cy="dialog-header">
        <h3 v-if="dialog.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">
          {{ dialog.title }}
        </h3>
        <div
          v-if="dialog.meta.length"
          class="meta flex flex-wrap items-center gap-x-32 gap-y-8 q-mt-sm"
        >
          <div
            v-for="item in dialog.meta"
            :key="item.description"
            class="flex items-center text-blue-grey-7"
            data-cy="dialog-meta"
          >
            <q-icon
              v-if="item.icon"
              :name="item.icon"
              size="sm"
              class="q-pr-xs"
              color="blue-grey-3"
            />
            {{ item.description }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section
        horizontal
        class="scroll"
        data-cy="dialog-body"
        style="max-height: 50vh; flex-wrap: wrap"
      >
        <div v-if="dialog.content" class="col-12 col-md-6 q-px-md q-py-md">
          <div
            v-html="dialog.content"
            data-cy="dialog-content"
          ></div>
        </div>
        <div v-if="dialog.image" class="col-12 col-md-6 q-px-md q-py-md">
          <q-img
            :src="dialog.image"
            :ratio="1"
            data-cy="dialog-image"
          />
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
