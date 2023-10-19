<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white">
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="index-title"
      >
        {{ $t('index.title') }}
      </h1>
      <event-countdown :release-date="releaseDate" data-cy="event-countdown" />
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
      <list-badge-achievement
        :items="badgeList"
        class="q-pt-xl q-pb-xl"
        data-cy="list-badges"
      ></list-badge-achievement>
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
import EventCountdown from 'components/EventCountdown.vue';
import ListCardChallenge from 'components/ListCardChallenge.vue';
import BannerImage from 'components/BannerImage.vue';
import HeadingBackground from 'src/components/HeadingBackground.vue';
import ListCardEvent from 'src/components/ListCardEvent.vue';
import ListBadgeAchievement from 'src/components/ListBadgeAchievement.vue';
import BannerApp from 'src/components/BannerApp.vue';
import BannerRoutes from 'src/components/BannerRoutes.vue';
import ListCardFollow from 'src/components/ListCardFollow.vue';
import ListCardOffer from 'src/components/ListCardOffer.vue';
import ListCardPost from 'src/components/ListCardPost.vue';
import ListCardProgress from 'src/components/ListCardProgress.vue';
import NewsletterFeature from 'src/components/NewsletterFeature.vue';
import SliderProgress from 'src/components/SliderProgress.vue';

// mocks
import * as homepage from '../mocks/homepage';

export default defineComponent({
  name: 'IndexPage',
  components: {
    BannerApp,
    BannerImage,
    BannerRoutes,
    EventCountdown,
    HeadingBackground,
    ListBadgeAchievement,
    ListCardChallenge,
    ListCardEvent,
    ListCardFollow,
    ListCardOffer,
    ListCardProgress,
    SliderProgress,
    ListCardPost,
    NewsletterFeature,
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
    };
  },
});
</script>

<style scoped lang="scss">
.bg-gray-lighter {
  background-color: var(--q-gray-lighter);
}
</style>
