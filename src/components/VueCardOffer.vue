<script lang="ts">
import { defineComponent, ref } from 'vue';

// import types
import { Offer } from 'components/types';

export default defineComponent({
  name: 'VueCardOffer',
  props: {
    card: {
      type: Object as () => Offer,
      required: true,
    },
  },
  setup() {
    const modalOpened = ref(false);
    return {
      modalOpened,
    };
  },
});
</script>

<template>
  <q-card
    data-cy="card-offer"
    class="rounded-20 bg-white"
    flat
    bordered
    @click.prevent="modalOpened = true"
  >
    <q-card-section horizontal class="q-px-12 q-py-md items-center">
      <q-card-section class="col-auto items-center">
        <q-icon
          :name="card.icon"
          color="blue-grey-3"
          size="48px"
          data-cy="card-icon"
        />
      </q-card-section>
      <q-card-section class="col items-center">
        <div class="text-grey-10" data-cy="card-title">{{ card.title }}</div>
      </q-card-section>
    </q-card-section>

    <q-dialog v-model="modalOpened" square data-cy="card-dialog">
      <q-card class="relative-position overflow-visible">
        <q-card-section class="q-pt-none" data-cy="dialog-header">
          <h3 v-if="card?.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">
            {{ card?.title }}
          </h3>
          <div
            v-if="card?.expirationDate || card?.issuer"
            class="meta flex items-center q-mt-sm"
          >
            <div
              v-if="card.expirationDate"
              class="dates flex items-center text-blue-grey-7 q-pr-md"
              data-cy="dialog-date"
            >
              <q-icon
                name="event"
                size="sm"
                class="q-pr-xs"
                color="blue-grey-3"
              />
              {{ card.expirationDate }}
            </div>
            <div
              v-if="card?.issuer"
              class="location flex items-center text-blue-grey-7"
              data-cy="dialog-issuer"
            >
              <q-icon
                name="place"
                size="sm"
                class="q-pr-xs"
                color="blue-grey-3"
              />
              {{ card?.issuer }}
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section
          horizontal
          class="scroll"
          data-cy="dialog-content"
          style="max-height: 50vh; flex-wrap: wrap"
        >
          <div class="col-12 col-md-6 q-px-md q-py-md">
            <div
              v-if="card?.content"
              v-html="card?.content"
              data-cy="dialog-text"
            ></div>
          </div>
          <div class="col-12 col-md-6 q-px-md q-py-md">
            <q-img
              src="https://picsum.photos/380/380"
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
  </q-card>
</template>

<style lang="scss" scoped>
.rounded-20 {
  border-radius: 20px;
}

.q-px-12 {
  padding-left: 12px;
  padding-right: 12px;
}

.q-dialog__inner > div {
  overflow: visible !important;
}
.dialog-close {
  top: -21px;
  right: -21px;
}
</style>
