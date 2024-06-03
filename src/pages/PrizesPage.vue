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

// fixtures
import events from '../../test/cypress/fixtures/listCardsEvent.json';

// types
import type { FormOption } from '../components/types/Form';

export default defineComponent({
  name: 'PrizesPage',
  components: {
    CardOffer,
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

    return {
      city,
      events,
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

      <!-- Section: Local events -->
      <div class="q-mt-lg">
        <h2 class="text-h6 q-my-none" data-cy="discount-offers-title">
          {{ $t('prizes.titleDiscountOffers') }}
        </h2>
        <div data-cy="discount-offers-list">
          <card-offer
            v-for="card in events"
            :key="card.title"
            :card="card"
            class="q-mt-lg"
            data-cy="discount-offers-item"
          />
        </div>
      </div>

      <!-- TODO: Section Prizes -->

      <!-- TODO: Section Partners -->
    </div>
  </q-page>
</template>
