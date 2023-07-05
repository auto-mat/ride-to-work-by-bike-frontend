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
          class="meta flex items-center q-mt-sm"
        >
          <div
            v-for="item in dialog.meta"
            :key="item.description"
            class="dates flex items-center text-blue-grey-7 q-pr-md"
            data-cy="dialog-date"
          >
            <q-icon
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
        class="dialog-close inline-block absolute-top-right q-px-none q-py-none"
        data-cy="dialog-close"
      >
        <q-btn
          v-close-popup
          round
          color="blue-grey-8"
          icon="close"
          class="bg-blue-grey-2"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
