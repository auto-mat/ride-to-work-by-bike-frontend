<script lang="ts">
/**
 * PrizesPage Component
 *
 * The `PrizesPage` displays information about prizes events.
 *
 * @components
 * - `CardOffer`: Card with offer information.
 *
 * @layout
 * - `MainLayout`: Default layout with sidebar on desktop.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104166&t=pZezzt4Cd9YZ0UzV-1)
 */
import { defineComponent, ref } from 'vue';

// components
import CardOffer from '../components/homepage/CardOffer.vue';
import CardPrize from 'src/components/global/CardPrize.vue';
import SectionColumns from '../components/homepage/SectionColumns.vue';

// fixtures
import listCardsPrizes from '../../test/cypress/fixtures/listCardsPrizes.json';
import listCardsPrizesAvailable from '../../test/cypress/fixtures/listResultsPrizes.json';

// types
import type { FormOption } from '../components/types/Form';
import { CardOffer as CardOfferType, CardPrizeType } from '../components/types';

export default defineComponent({
  name: 'PrizesPage',
  components: {
    CardOffer,
    CardPrize,
    SectionColumns,
  },
  setup() {
    const optionsCity: FormOption[] = [
      {
        label: 'Brno',
        value: 'brno',
      },
      {
        label: 'Ostrava',
        value: 'ostrava',
      },
      {
        label: 'Praha',
        value: 'praha',
      },
    ];
    const city = ref<string>('');

    const prizes = listCardsPrizes as unknown;
    const prizesList = prizes as CardOfferType[];
    const prizesListAvailable =
      listCardsPrizesAvailable.cards as CardPrizeType[];

    return {
      city,
      prizesList,
      prizesListAvailable,
      optionsCity,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl q-pt-lg">
      <!-- Section title -->
      <div class="col-12 flex flex-wrap items-center justify-between gap-16">
        <!-- Page title -->
        <div>
          <h1
            class="text-h5 q-my-none text-weight-bold"
            data-cy="prizes-page-title"
          >
            {{ $t('prizes.titlePrizes') }}
          </h1>
        </div>

        <!-- Select: City -->
        <div class="row items-center">
          <label for="prizes-select-city" class="col-auto q-mr-sm">
            <span>{{ $t('community.labelSelectCity') }}:</span>
          </label>
          <q-select
            dense
            outlined
            emit-value
            map-options
            v-model="city"
            :options="optionsCity"
            :style="{ 'min-width': '160px' }"
            class="col-auto"
            id="prizes-select-city"
            data-cy="prizes-select-city"
          />
        </div>
      </div>

      <!-- Section: Special offers -->
      <div class="q-mt-lg">
        <h2 class="text-h6 q-my-none" data-cy="discount-offers-title">
          {{ $t('prizes.titleSpecialOffers') }}
        </h2>
        <div class="q-mt-sm">
          {{ $t('prizes.textSpecialOffers') }}
        </div>
        <div class="q-mt-lg" data-cy="discount-offers-list">
          <section-columns :columns="3" class="q-col-gutter-lg">
            <card-offer
              v-for="card in prizesList"
              :key="card.title"
              :card="card"
              data-cy="discount-offers-item"
            />
          </section-columns>
        </div>
      </div>

      <!-- Section: Available prizes -->
      <section class="q-mt-lg" data-cy="available-prizes">
        <!-- TODO: Replace with section-heading -->
        <h2 class="text-h6 q-my-none" data-cy="section-heading-title">
          <span v-html="$t('prizes.titleAvailablePrizes', { url: '#' })" />
        </h2>
        <div class="q-mt-sm" data-cy="section-heading-perex">
          <span v-html="$t('prizes.textAvailablePrizes')" />
        </div>
        <div class="q-mt-lg">
          <section-columns
            :columns="4"
            class="q-col-gutter-lg"
            data-cy="available-prizes-list"
          >
            <card-prize
              v-for="(card, index) in prizesListAvailable"
              :key="`card-${index}-${card.title}`"
              :card="card"
              data-cy="available-prizes-item"
            />
          </section-columns>
        </div>
      </section>

      <!-- TODO: Section Partners -->
    </div>
  </q-page>
</template>
