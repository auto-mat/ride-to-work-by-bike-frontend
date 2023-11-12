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
      <list-card-challenge
        :cards="cardsChallenge"
        class="q-pt-xl q-pb-xl"
        data-cy="list-challenge"
      />
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
      <list-card-event
        :cards="cardsEvent"
        class="q-pt-xl"
        data-cy="list-event"
      ></list-card-event>
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

// import components
import BadgeAchievement from 'components/BadgeAchievement.vue';
import BannerApp from 'components/BannerApp.vue';
import BannerImage from 'components/BannerImage.vue';
import BannerRoutes from 'components/BannerRoutes.vue';
import CardStats from 'components/CardStats.vue';
import CountdownChallenge from 'components/CountdownChallenge.vue';
import CountdownEvent from 'components/CountdownEvent.vue';
import HeadingBackground from 'components/HeadingBackground.vue';
import ListCardChallenge from 'components/ListCardChallenge.vue';
import ListCardEvent from 'components/ListCardEvent.vue';
import ListCardFollow from 'components/ListCardFollow.vue';
import ListCardOffer from 'components/ListCardOffer.vue';
import ListCardPost from 'components/ListCardPost.vue';
import ListCardProgress from 'components/ListCardProgress.vue';
import NewsletterFeature from 'components/NewsletterFeature.vue';
import SectionColumns from 'components/SectionColumns.vue';
import SliderProgress from 'components/SliderProgress.vue';

// mocks
import * as homepage from '../mocks/homepage';

export default defineComponent({
  name: 'IndexPage',
  components: {
    BadgeAchievement,
    BannerApp,
    BannerImage,
    BannerRoutes,
    CountdownChallenge,
    CountdownEvent,
    HeadingBackground,
    ListCardChallenge,
    ListCardEvent,
    ListCardFollow,
    ListCardOffer,
    ListCardProgress,
    SliderProgress,
    ListCardPost,
    NewsletterFeature,
    SectionColumns,
    CardStats,
  },
  setup() {
    return {
      releaseDate: homepage.releaseDate,
      cardsChallenge: homepage.cardsChallenge,
      badgeList: homepage.badgeList,
      bannerImageData: homepage.bannerImage,
      bannerAppData: homepage.bannerApp,
      headingBgTitle: homepage.headingBgTitle,
      cardsEvent: homepage.cardsEvent,
      cardsOffer: homepage.cardsOffer,
      cardsPost: homepage.cardsPost,
      cardsFollow: homepage.cardsFollow,
      cardsProgressSlider: homepage.cardsProgressSlider,
      progressStats: homepage.progressStats,
      cardsProgress: homepage.cardsProgress,
      cardsStats: homepage.cardsStats,
    };
  },
});
</script>

<style scoped lang="scss">
.bg-gray-lighter {
  background-color: var(--q-gray-lighter);
}
</style>
