<script lang="ts">
/**
 * CardLocation Component
 *
 * @description * Use this component to render location card.
 * Clicking on the card opens a dialog with location information.
 *
 * @props
 * - `card` (CardLocation, required): The object representing the card.
 *   It should be of type `CardLocation`.
 *
 * @components
 * - `DialogDefault`: Component to render a dialog.
 *
 * @example
 * <card-location :card="card" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=7cNPU36ejftE58nr-1)
 */

// libraries
import { Screen } from 'quasar';
import { defineComponent, ref } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { CardLocationType } from '../types';

export default defineComponent({
  name: 'CardLocation',
  components: {
    DialogDefault,
  },
  props: {
    card: {
      type: Object as () => CardLocationType,
      required: true,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const cardMaxWidth = Screen.sizes.sm;
    const modalOpened = ref(false);

    return {
      borderRadius,
      cardMaxWidth,
      modalOpened,
    };
  },
});
</script>

<template>
  <q-card
    v-ripple
    flat
    bordered
    class="bg-white cursor-pointer q-hoverable"
    :style="{ 'border-radius': borderRadius, 'max-width': `${cardMaxWidth}px` }"
    data-cy="card-location"
    @click.prevent="modalOpened = true"
  >
    <!-- Image -->
    <q-img
      :src="card.image.src"
      ratio="1.4"
      data-cy="card-location-image"
      :alt="card.image.alt"
    />

    <span class="q-focus-helper"></span>

    <!-- Content -->
    <q-card-section>
      <!-- Title -->
      <div
        class="card-location-title text-body1 text-weight-bold text-grey-10"
        data-cy="card-location-title"
      >
        {{ card.title }}
      </div>
      <!-- Metadata -->
      <div class="flex flex-wrap gap-8 q-mt-xs">
        <div
          v-for="item in card.metadata"
          :key="item.id"
          class="flex items-center"
        >
          <q-icon
            v-if="item.icon"
            :name="item.icon"
            size="18px"
            class="q-pr-xs"
            color="blue-grey-6"
          />
          <span class="text-subtitle2 text-weight-regular">
            {{ item.text }}
          </span>
        </div>
      </div>
    </q-card-section>

    <!-- Modal dialog -->
    <dialog-default
      v-model="modalOpened"
      :horizontal="true"
      data-cy="dialog-location"
    >
      <!-- Title -->
      <template #title>
        {{ card.title }}
      </template>
      <!-- Metadata -->
      <template #metadata>
        <div class="flex flex-wrap items-center gap-x-32 gap-y-8 q-mt-sm">
          <div
            v-for="item in card.metadata"
            :key="item.id"
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
            <span v-if="item.text" v-html="item.text" />
          </div>
        </div>
      </template>
      <!-- Content -->
      <template #content>
        <!-- Left column: Content -->
        <div class="col-12 col-md-6" data-cy="dialog-col-left">
          <div class="q-px-md q-py-md">
            <!-- Content -->
            <div
              v-if="card?.content"
              v-html="card.content"
              data-cy="dialog-content"
            />
            <!-- Buttons -->
            <q-btn
              v-for="(link, index) in card.links"
              :to="link.url"
              :key="link.url"
              color="primary"
              unelevated
              rounded
              :outline="index !== 0"
              class="q-mt-md q-mr-sm"
              data-cy="dialog-location-link"
            >
              <div class="flex items-center no-wrap">
                {{ link.title }}
              </div>
            </q-btn>
          </div>
        </div>
        <!-- Right column: Image -->
        <div class="col-12 col-md-6" data-cy="dialog-col-right">
          <div clas="q-px-md q-py-md">
            <!-- Image -->
            <q-img
              :src="card.image.src"
              :alt="card.image.alt"
              data-cy="dialog-image"
            />
          </div>
        </div>
      </template>
    </dialog-default>
  </q-card>
</template>
