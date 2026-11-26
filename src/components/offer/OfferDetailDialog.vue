<script lang="ts">
/**
 * OfferDetailDialog Component
 *
 * @description * Use this component to display offer or event details
 * in a modal dialog.
 *
 * Note: This component is used within `CardOffer` and `EventLinkList`.
 *
 * @props
 * - `card` (Object, required): The card object with details. It should be
 *   of type `CardOfferType`.
 * - `modelValue` (Boolean, required): Whether we show dialog.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Used to display detailed information about the offer in a
 *   modal dialog.
 * - `OfferValidation`: Used to display information about how an offer can be
 *   validated and received.
 *
 * @example
 * <offer-detail-dialog v-model="isOpen" :card="offerDetails" />
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';
import OfferValidation from './OfferValidation.vue';

// types
import { CardOffer as CardOfferType } from '../types';

export default defineComponent({
  name: 'OfferDetailDialog',
  components: {
    DialogDefault,
    OfferValidation,
  },
  props: {
    card: {
      type: Object as () => CardOfferType,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = computed<boolean>({
      get: (): boolean => props.modelValue,
      set: (value: boolean): void => emit('update:modelValue', value),
    });

    return {
      isOpen,
    };
  },
});
</script>

<template>
  <dialog-default
    v-model="isOpen"
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
</template>
