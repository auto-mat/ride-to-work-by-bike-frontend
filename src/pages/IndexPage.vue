<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white">
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="index-title"
      >
        {{ $t('index.title') }}
      </h1>
      <countdown-event :release-date="releaseDate" data-cy="countdown-event" />
      <!-- Title -->
      <section-heading class="q-pt-xl q-mb-md" data-cy="card-list-title">
        {{ $t('index.cardListChallenge.title') }}
      </section-heading>
      <section-columns
        :columns="3"
        class="q-col-gutter-lg q-pb-xl"
        data-cy="list-challenge"
      >
        <card-challenge
          v-for="card in cardsChallenge"
          :key="card.title"
          :card="card"
          data-cy="card-list-item"
        />
      </section-columns>
      <banner-image
        :banner="bannerImageData"
        class="q-pt-xl q-pb-xl"
        data-cy="banner-image"
      />
      <banner-app
        :banner="bannerAppData"
        class="q-mt-xl"
        data-cy="banner-app"
      />
      <banner-routes
        :routes-count="14"
        variant="default"
        class="q-mt-xl q-mb-xl"
        data-cy="banner-routes"
      />
      <slider-progress
        :title="$t('index.progressSlider.title')"
        :cards="cardsProgressSlider"
        :stats="progressStats"
        class="q-pt-xl q-mb-md"
        :button="{ title: $t('index.progressSlider.button'), url: '/blog' }"
      >
      </slider-progress>
      <list-card-progress
        :title="$t('index.cardListProgress.title')"
        :cards="cardsProgress"
        :stats="progressStats"
        class="q-pt-xl q-pb-xl"
        data-cy="list-progress"
      ></list-card-progress>
      <section-columns
        :columns="4"
        class="q-col-gutter-lg q-pt-xl q-pb-xl"
        data-cy="list-badges"
      >
        <badge-achievement
          v-for="badge in badgeList"
          :key="badge.title"
          :badge="badge"
          class="full-width"
          data-cy="badge-item"
        />
      </section-columns>
      <section-columns :columns="3" class="q-col-gutter-lg q-pt-xl q-pb-xl">
        <card-stats v-for="card in cardsStats" :key="card.title" :card="card" />
      </section-columns>
      <countdown-challenge date-end="2023-10-24" />
    </div>
    <heading-background
      :title="headingBgTitle"
      class="bg-white q-pt-xl"
      data-cy="heading-background"
    ></heading-background>
    <div class="bg-gray-light q-px-lg">
      <div class="q-pt-xl" data-cy="list-event">
        <card-event
          v-for="card in cardsEvent"
          :key="card.title"
          :card="card"
          class="q-mt-lg"
          data-cy="card-list-item"
        />
      </div>
      <list-card-offer
        :title="$t('index.cardListOffer.title')"
        :cards="cardsOffer"
        class="q-pt-xl"
        data-cy="list-offer"
      >
      </list-card-offer>
      <list-card-post
        :title="$t('index.cardListPost.title')"
        :cards="cardsPost"
        :button="{
          title: $t('index.cardListPost.button'),
          url: '/blog',
        }"
        class="q-pt-xl"
        data-cy="list-post"
      >
      </list-card-post>
      <newsletter-feature class="q-pt-xl" data-cy="newsletter-feature" />
      <list-card-follow :cards="cardsFollow" class="q-pt-xl" />
    </div>
  </q-page>
</template>

<script lang="ts">
// libraries
import { defineComponent } from 'vue';

// composables
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// import components
import BadgeAchievement from 'components/homepage/BadgeAchievement.vue';
import BannerApp from 'components/homepage/BannerApp.vue';
import BannerImage from 'components/homepage/BannerImage.vue';
import BannerRoutes from 'components/homepage/BannerRoutes.vue';
import CardChallenge from 'components/homepage/CardChallenge.vue';
import CardEvent from 'components/homepage/CardEvent.vue';
import CardStats from 'components/homepage/CardStats.vue';
import CountdownChallenge from 'components/homepage/CountdownChallenge.vue';
import CountdownEvent from 'components/homepage/CountdownEvent.vue';
import HeadingBackground from 'components/homepage/HeadingBackground.vue';
import ListCardFollow from 'components/homepage/ListCardFollow.vue';
import ListCardOffer from 'components/homepage/ListCardOffer.vue';
import ListCardPost from 'components/homepage/ListCardPost.vue';
import ListCardProgress from 'components/homepage/ListCardProgress.vue';
import NewsletterFeature from 'components/homepage/NewsletterFeature.vue';
import SectionColumns from 'components/homepage/SectionColumns.vue';
import SectionHeading from 'src/components/global/SectionHeading.vue';
import SliderProgress from 'components/homepage/SliderProgress.vue';

// mocks
import * as homepage from '../mocks/homepage';

// fixtures
import listCardsFollow from '../../test/cypress/fixtures/listCardsFollow.json';
import listCardsPost from '../../test/cypress/fixtures/listCardsPost.json';

export default defineComponent({
  name: 'IndexPage',
  components: {
    BadgeAchievement,
    BannerApp,
    BannerImage,
    BannerRoutes,
    CardChallenge,
    CardEvent,
    CardStats,
    CountdownChallenge,
    CountdownEvent,
    HeadingBackground,
    ListCardFollow,
    ListCardOffer,
    ListCardPost,
    ListCardProgress,
    NewsletterFeature,
    SectionColumns,
    SectionHeading,
    SliderProgress,
  },
  setup() {
    const { challengeStartDate } = rideToWorkByBikeConfig;

    const cardsFollow = listCardsFollow;
    const cardsPost = listCardsPost;

    return {
      badgeList: homepage.badgeList,
      bannerImageData: homepage.bannerImage,
      bannerAppData: homepage.bannerApp,
      cardsChallenge: homepage.cardsChallenge,
      cardsEvent: homepage.cardsEvent,
      cardsFollow,
      cardsOffer: homepage.cardsOffer,
      cardsPost,
      cardsProgress: homepage.cardsProgress,
      cardsProgressSlider: homepage.cardsProgressSlider,
      cardsStats: homepage.cardsStats,
      headingBgTitle: homepage.headingBgTitle,
      progressStats: homepage.progressStats,
      releaseDate: challengeStartDate,
    };
  },
});
</script>

<style scoped lang="scss">
.bg-gray-lighter {
  background-color: var(--q-gray-lighter);
}
</style>
