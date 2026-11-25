<script lang="ts">
/**
 * CardOffer Component
 *
 * The `CardOffer` component displays a card with details about an offer.
 *
 * @description
 * This component presents special offers or promotions in a card
 * format. When clicked, it triggers a modal dialog with more detailed
 * information about the offer.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `ListCardOffer`
 * component.
 *
 * @props
 * - `card` (Object, required): The card object containing offer details. It
 *   should be of type `CardOfferType`.
 *
 * @components
 * - `OfferDetailDialog`: Used to display detailed information about the offer
 *   in a modal dialog.
 *
 * @example
 * <card-offer
 *   :card="offerDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105637&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// components
import OfferDetailDialog from '../offer/OfferDetailDialog.vue';

// types
import { CardOffer as CardOfferType } from '../types';

// enums
import { OfferEventType } from '../enums/Offers';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// composables
import { i18n } from '../../boot/i18n';

// utils
import { isOfferPast } from '../../utils/get_offer_valid';

export default defineComponent({
  name: 'CardOffer',
  components: {
    OfferDetailDialog,
  },
  props: {
    card: {
      type: Object as () => CardOfferType,
      required: true,
    },
  },
  setup(props) {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const modalOpened = ref(false);

    const displayDate = computed(() => {
      if (!props.card.startDate) {
        return null;
      }
      // remove timezone marker
      const localStartDate = props.card.startDate.replace('Z', '');
      // one-day event - show date-time
      if (props.card.type === OfferEventType.oneDayEvent) {
        return i18n.global.d(new Date(localStartDate), 'monthDayHourMinute');
      }
      // multi-day offer - show date range no time
      const startFormatted = i18n.global.d(
        new Date(localStartDate),
        'monthDay',
      );
      if (props.card.endDate) {
        const localEndDate = props.card.endDate.replace('Z', '');
        const endFormatted = i18n.global.d(new Date(localEndDate), 'monthDay');
        return `${startFormatted} - ${endFormatted}`;
      }
      // fallback - only start date available
      return startFormatted;
    });

    return {
      borderRadius,
      displayDate,
      modalOpened,
      isOfferPast,
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
    class="full-height bg-white cursor-pointer q-hoverable"
    :class="{ 'light-dimmed': isOfferPast(card) }"
    :style="{ 'border-radius': borderRadius }"
    @click.prevent="modalOpened = true"
  >
    <span class="q-focus-helper"></span>
    <q-card-section horizontal class="items-center" style="height: 100%">
      <q-card-section class="col-auto items-center q-pr-none">
        <!-- Icon -->
        <q-icon
          :name="card.icon"
          color="primary"
          size="48px"
          data-cy="card-icon"
        />
      </q-card-section>
      <q-card-section class="col items-center" style="text-wrap: pretty">
        <!-- Title -->
        <div
          v-html="card.title"
          class="text-grey-10"
          data-cy="card-title"
        ></div>
        <!-- Date chip -->
        <q-chip
          v-if="displayDate"
          dense
          color="transparent"
          icon="svguse:icons/card_offer/icons.svg#calendar"
          class="q-mt-xs q-ml-none text-caption"
          data-cy="card-date-chip"
        >
          {{ displayDate }}
        </q-chip>
      </q-card-section>
    </q-card-section>

    <!-- Modal dialog -->
    <offer-detail-dialog v-model="modalOpened" :card="card" />
  </q-card>
</template>

<style lang="scss" scoped>
/* Fix dimmed effect on card with border radius */
.q-card.light-dimmed:after {
  border-radius: inherit;
}
</style>
