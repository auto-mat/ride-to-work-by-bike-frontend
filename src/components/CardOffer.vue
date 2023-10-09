<script lang="ts">
/**
 * CardOffer Component
 *
 * The `CardOffer` component displays a card with details about an offer.
 *
 * @description
 * This component is designed to present special offers or promotions in a card
 * format. When clicked, it triggers a modal dialog with more detailed
 * information about the offer.
 *
 * @props
 * - `card` (Object, required): The card object containing offer details. It
 *   should be of type `CardOfferType`.
 *
 * @components
 * - `DialogCard`: Used to display detailed information about the offer in a
 *   modal dialog.
 *
 * @example
 * <card-offer
 *   :card="offerDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105637&mode=dev)
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import DialogCard from 'components/DialogCard.vue';

// types
import { CardOffer as CardOfferType, ConfigGlobal } from 'components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

export default defineComponent({
  name: 'CardOffer',
  components: {
    DialogCard,
  },
  props: {
    card: {
      type: Object as () => CardOfferType,
      required: true,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const modalOpened = ref(false);

    return {
      borderRadius,
      modalOpened,
    };
  },
});
</script>

<template>
  <!-- Card (hoverable) -->
  <q-card
    v-ripple
    flat
    bordered
    data-cy="card-offer"
    class="bg-white cursor-pointer q-hoverable"
    :style="{ 'border-radius': borderRadius }"
    @click.prevent="modalOpened = true"
  >
    <span class="q-focus-helper"></span>
    <q-card-section horizontal class="q-px-md q-py-md items-center">
      <q-card-section class="col-auto items-center">
        <!-- Icon -->
        <q-icon
          :name="card.icon"
          color="blue-grey-3"
          size="48px"
          data-cy="card-icon"
        />
      </q-card-section>
      <q-card-section class="col items-center">
        <!-- Title -->
        <div class="text-grey-10" data-cy="card-title">{{ card.title }}</div>
      </q-card-section>
    </q-card-section>

    <!-- Modal dialog -->
    <dialog-card v-model="modalOpened" data-cy="dialog-offer">
      <!-- Title -->
      <template #title>
        {{ card.title }}
      </template>
      <!-- Metadata -->
      <template #metadata>
        <div class="flex flex-wrap items-center gap-x-32 gap-y-8 q-mt-sm">
          <div
            v-if="card.expirationDate"
            class="flex items-center text-blue-grey-7"
            data-cy="dialog-meta"
          >
            <q-icon
              name="event"
              size="18px"
              class="q-pr-xs"
              color="blue-grey-3"
            />
            {{ card.expirationDate }}
          </div>
          <div
            v-if="card.issuer"
            class="flex items-center text-blue-grey-7"
            data-cy="dialog-meta"
          >
            <q-icon
              name="pedal_bike"
              size="18px"
              class="q-pr-xs"
              color="blue-grey-3"
            />
            {{ card.issuer }}
          </div>
        </div>
      </template>
      <!-- Content -->
      <template #content>
        <div v-html="card.content" />
      </template>
      <!-- Buttons -->
      <template #buttons>
        <q-btn
          v-if="card.link"
          :to="card.link.url"
          color="black"
          unelevated
          rounded
          class="q-mt-md"
          data-cy="dialog-offer-link"
        >
          <div class="flex items-center no-wrap">
            {{ card.link.title }}
          </div>
        </q-btn>
      </template>
      <!-- Image -->
      <template #image>
        <q-img :src="card.image.src" :alt="card.image.alt" />
      </template>
    </dialog-card>
  </q-card>
</template>

<style lang="scss" scoped>
.gap-y-8 {
  row-gap: 8px;
}

.gap-x-32 {
  column-gap: 32px;
}
</style>
