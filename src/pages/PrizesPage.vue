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
import CardOfferSkeleton from '../components/skeletons/CardOfferSkeleton.vue';
import CardPrize from 'src/components/global/CardPrize.vue';
import CardPrizeSkeleton from 'src/components/skeletons/CardPrizeSkeleton.vue';
import FormFieldSelectCity from 'src/components/form/FormFieldSelectCity.vue';
import ListPartners from '../components/global/ListPartners.vue';
import PageHeading from 'components/global/PageHeading.vue';
import SectionColumns from '../components/homepage/SectionColumns.vue';
import SectionHeading from '../components/global/SectionHeading.vue';

// composables
import { useApiGetPosts } from '../composables/useApiGetPosts';

// types
import type { Logger } from '../components/types/Logger';
import type { Offer } from '../components/types/Offer';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// utils
import {
  getOffersFeedParamSet,
  getPrizesFeedParamSet,
} from '../utils/get_feed_param_set';

export default defineComponent({
  name: 'PrizesPage',
  components: {
    CardOffer,
    CardOfferSkeleton,
    CardPrize,
    CardPrizeSkeleton,
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
    const enabledPartners = false;
    const city = ref<string | null>(null);

    const postsOffers = ref<Offer[]>([]);
    const postsPrizes = ref<Offer[]>([]);
    const { isLoading, loadPosts } = useApiGetPosts(logger);
    const cards = computed(() => feedAdapter.toCardOffer(postsOffers.value));
    const prizesCards = computed(() =>
      feedAdapter.toCardPrize(postsPrizes.value),
    );

    onMounted(async () => {
      // if citySlug is not available, try reloading register challenge data
      if (!registerChallengeStore.getCitySlug) {
        await registerChallengeStore.loadRegisterChallengeToStore();
      }
      // if citySlug is available, load posts, else we can't load posts
      if (registerChallengeStore.getCitySlug) {
        // load offers and prizes in parallel
        const [offers, prizes] = await Promise.all([
          loadPosts(getOffersFeedParamSet(registerChallengeStore.getCitySlug)),
          loadPosts(getPrizesFeedParamSet(registerChallengeStore.getCitySlug)),
        ]);
        postsOffers.value = offers;
        postsPrizes.value = prizes;
        // set default value for city select
        city.value = registerChallengeStore.getCitySlug;
      }
      // initiate watcher after the citySlug is loaded
      watch(city, async (newSlug: string | null) => {
        if (newSlug) {
          // load offers and prizes in parallel
          const [offers, prizes] = await Promise.all([
            loadPosts(getOffersFeedParamSet(newSlug)),
            loadPosts(getPrizesFeedParamSet(newSlug)),
          ]);
          postsOffers.value = offers;
          postsPrizes.value = prizes;
        }
      });
    });

    return {
      city,
      cards,
      isLoading,
      prizesCards,
      enabledSelectCity,
      enabledPartners,
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
        <div v-if="cards.length > 0 || isLoading" class="q-mt-lg">
          <section-columns
            :columns="3"
            class="q-col-gutter-lg"
            data-cy="discount-offers-list"
          >
            <template v-if="isLoading">
              <card-offer-skeleton v-for="i in 3" :key="i" />
            </template>
            <template v-else>
              <card-offer
                v-for="card in cards"
                :key="card.title"
                :card="card"
                data-cy="discount-offers-item"
              />
            </template>
          </section-columns>
        </div>
        <div v-else class="q-mt-lg q-mb-xl text-grey-7">
          <span>{{ $t('prizes.textOffersEmpty') }}</span>
        </div>
      </div>

      <!-- Section: Available prizes -->
      <section class="q-mt-xl" data-cy="available-prizes">
        <!-- TODO: Replace with section-heading -->
        <h2 class="text-h6 q-my-none" data-cy="section-heading-title">
          <span v-html="$t('prizes.titleAvailablePrizes')" />
        </h2>
        <div class="q-mt-sm" data-cy="section-heading-perex">
          <span v-html="$t('prizes.textAvailablePrizes')" />
        </div>
        <div v-if="prizesCards.length > 0 || isLoading" class="q-mt-lg">
          <section-columns
            :columns="4"
            class="q-col-gutter-lg"
            data-cy="available-prizes-list"
          >
            <template v-if="isLoading">
              <card-prize-skeleton v-for="i in 4" :key="i" />
            </template>
            <template v-else>
              <card-prize
                v-for="(card, index) in prizesCards"
                :key="`card-${index}-${card.title}`"
                :card="card"
                data-cy="available-prizes-item"
              />
            </template>
          </section-columns>
        </div>
        <div v-else class="q-mt-lg q-mb-xl text-grey-7">
          <span>{{ $t('prizes.textPrizesEmpty') }}</span>
        </div>
      </section>

      <!-- Section: Partners -->
      <list-partners
        v-if="enabledPartners"
        class="q-mt-xl"
        data-cy="list-partners"
      />
    </div>
  </q-page>
</template>
