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
 * - `DialogDefault`: Used to display detailed information about the offer in a
 *   modal dialog.
 * - `OfferValidation`: Used to display information about how an offer can be
 *   validated and received.
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
import DialogDefault from '../global/DialogDefault.vue';
import OfferValidation from '../offer/OfferValidation.vue';

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
    DialogDefault,
    OfferValidation,
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
    <dialog-default
      v-model="modalOpened"
      :horizontal="true"
      :minWidth="card?.content || card?.description ? '50vw' : '30vw'"
      data-cy="dialog-offer"
    >
      <!-- Title -->
      <template #title>
        <span v-html="card.title" />
      </template>
      <!-- Metadata -->
      <template #metadata>
        <div class="flex flex-wrap items-center gap-x-32 gap-y-8 q-mt-sm">
          <div
            v-for="item in card.metadata"
            :key="item.id"
            class="flex no-wrap items-center text-blue-grey-7"
            data-cy="dialog-metadata-item"
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
        <div
          class="col-12 col-md-6 q-px-md q-py-md"
          data-cy="dialog-col-left"
          v-if="
            card?.content ||
            card?.description ||
            card?.voucher ||
            card?.voucherUrl
          "
        >
          <!-- Content: Edited by Auto*Mat administrators -->
          <div
            v-if="card?.content"
            v-html="card.content"
            data-cy="dialog-content"
          />
          <!-- Description: Edited by City administrators -->
          <div
            v-if="card?.description"
            v-html="card.description"
            data-cy="dialog-description"
          />
          <!-- Voucher -->
          <div v-if="card?.voucher" class="q-mt-lg" data-cy="dialog-voucher">
            <h4
              class="text-caption text-uppercase q-my-none"
              data-cy="dialog-voucher-title"
            >
              {{ $t('index.cardOffer.titleVoucherCode') }}
            </h4>
            <div class="text-h6 q-mt-sm" data-cy="dialog-voucher-code">
              {{ card.voucher }}
            </div>
          </div>
          <!-- Button: Link -->
          <q-btn
            v-if="card.voucherUrl"
            :href="card.voucherUrl"
            target="_blank"
            color="primary"
            unelevated
            rounded
            class="q-mt-lg"
            :label="$t('index.cardOffer.buttonUseVoucher')"
            data-cy="dialog-offer-link"
          />
        </div>
        <!-- Right column: Image -->
        <div class="col-12 col-md-6" data-cy="dialog-col-right">
          <div class="q-px-md q-py-md">
            <!-- Image -->
            <q-img
              :src="card.image.src"
              :alt="card.image.alt"
              data-cy="dialog-image"
              fit="contain"
            />
          </div>
        </div>
        <!-- Section: Validation -->
        <offer-validation
          v-if="card.tShirtEvent"
          class="col-12"
          data-cy="offer-validation"
        />
      </template>
    </dialog-default>
  </q-card>
</template>

<style lang="scss" scoped>
/* Fix dimmed effect on card with border radius */
.q-card.light-dimmed:after {
  border-radius: inherit;
}
</style>
