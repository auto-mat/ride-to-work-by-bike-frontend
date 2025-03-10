<script lang="ts">
/**
 * PrizesPage Component
 *
 * The `PrizesPage` displays information about prizes events.
 *
 * @components
 * - `CardOffer`: Card with offer information.
 * - `ListPartners`: Component to render a list of partners.
 * - `SectionColumns`: Component to render content in columns.
 *
 * @layout
 * - `MainLayout`: Default layout with sidebar on desktop.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104166&t=pZezzt4Cd9YZ0UzV-1)
 */
import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue';

// adapters
import { feedAdapter } from '../adapters/feedAdapter';

// components
import CardOffer from '../components/homepage/CardOffer.vue';
import CardPrize from 'src/components/global/CardPrize.vue';
import FormFieldSelectCity from 'src/components/form/FormFieldSelectCity.vue';
import ListPartners from '../components/global/ListPartners.vue';
import PageHeading from 'components/global/PageHeading.vue';
import SectionColumns from '../components/homepage/SectionColumns.vue';
import SectionHeading from '../components/global/SectionHeading.vue';

// composables
import { useApiGetPosts } from '../composables/useApiGetPosts';

// fixtures
import listCardsPrizesAvailable from '../../test/cypress/fixtures/listResultsPrizes.json';

// types
import type { CardPrizeType } from '../components/types';
import type { Logger } from '../components/types/Logger';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// utils
import { getOffersFeedParamSet } from '../utils/get_feed_param_set';

export default defineComponent({
  name: 'PrizesPage',
  components: {
    CardOffer,
    CardPrize,
    FormFieldSelectCity,
    ListPartners,
    PageHeading,
    SectionColumns,
    SectionHeading,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerChallengeStore = useRegisterChallengeStore();

    const enabledSelectCity = true;
    const city = ref<string | null>(null);

    const { posts, isLoading, loadPosts } = useApiGetPosts(logger);
    const cards = computed(() => feedAdapter.toCardOffer(posts.value));

    onMounted(async () => {
      // if citySlug is not available, try reloading register challenge data
      if (!registerChallengeStore.getCitySlug) {
        await registerChallengeStore.loadRegisterChallengeToStore();
      }
      // if citySlug is available, load posts, else we can't load posts
      if (registerChallengeStore.getCitySlug) {
        await loadPosts(
          getOffersFeedParamSet(registerChallengeStore.getCitySlug),
        );
        // set default value for city select
        city.value = registerChallengeStore.getCitySlug;
      }
      // initiate watcher after the citySlug is loaded
      watch(city, (newSlug: string | null) => {
        if (newSlug) {
          loadPosts(getOffersFeedParamSet(newSlug));
        }
      });
    });

    const prizesListAvailable =
      listCardsPrizesAvailable.cards as CardPrizeType[];

    return {
      city,
      cards,
      isLoading,
      prizesListAvailable,
      enabledSelectCity,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl q-pt-lg">
      <!-- Page title -->
      <page-heading horizontal data-cy="prizes-page-title">
        {{ $t('prizes.titlePrizes') }}
        <template #secondary>
          <!-- Select: City -->
          <form-field-select-city
            v-if="enabledSelectCity"
            v-model="city"
            data-cy="form-field-select-city"
          />
        </template>
      </page-heading>

      <!-- Section: Special offers -->
      <div class="q-mt-xl">
        <section-heading data-cy="discount-offers-title">
          {{ $t('prizes.titleSpecialOffers') }}
          <template #perex>
            {{ $t('prizes.textSpecialOffers') }}
          </template>
        </section-heading>
        <section-columns
          :columns="3"
          class="q-col-gutter-lg q-mt-md"
          data-cy="discount-offers-list"
        >
          <card-offer
            v-for="card in cards"
            :key="card.title"
            :card="card"
            data-cy="discount-offers-item"
          />
        </section-columns>
      </div>

      <!-- Section: Available prizes -->
      <section class="q-mt-xl" data-cy="available-prizes">
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

      <!-- Section: Partners -->
      <list-partners class="q-mt-xl" data-cy="list-partners" />
    </div>
  </q-page>
</template>
