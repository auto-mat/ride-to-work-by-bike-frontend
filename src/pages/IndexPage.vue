<template>
  <q-page data-cy="q-main">
    <div class="q-px-lg bg-white">
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="index-title"
      >
        {{ $t('index.title') }}
      </h1>
      <event-countdown
        :release-date="releaseDate"
        data-cy="event-countdown"
      />
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
      <banner-app :banner="bannerAppData"
        class="q-mt-xl"
        data-cy="banner-app"
      />
      <vue-banner-routes
        :routes-count="14"
        class="q-mt-xl q-mb-xl"
        data-cy="banner-routes"
      />
      <vue-progress-slider
        :title="$t('index.progressSlider.title')"
        :cards="cardsProgressSlider"
        :stats="progressStats"
        class="q-pt-xl q-pb-xl"
        :button="{ title: $t('index.progressSlider.button'), url: '/blog' }"
      >
      </vue-progress-slider>
      <vue-card-list-progress
        :title="$t('index.cardListProgress.title')"
        :cards="cardsProgress"
        :stats="progressStats"
        class="q-pt-xl q-pb-xl"
        data-cy="list-progress"
      ></vue-card-list-progress>
      <vue-badge-list
        :items="badgeList"
        class="q-pt-xl q-pb-xl"
        data-cy="list-badges"
      ></vue-badge-list>
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
      <vue-card-list-offer
        :title="$t('index.cardListOffer.title')"
        :cards="cardsOffer"
        class="q-pt-xl"
        data-cy="list-offer"
      >
      </vue-card-list-offer>
      <vue-card-list-post
        :title="$t('index.cardListPost.title')"
        :cards="cardsPost"
        :button="{
          title: $t('index.cardListPost.button'),
          url: '/blog',
        }"
        class="q-pt-xl"
        data-cy="list-post"
      >
      </vue-card-list-post>
      <vue-newsletter-feature class="q-pt-xl" data-cy="newsletter-feature" />
      <vue-card-list-follow :cards="cardsFollow" class="q-pt-xl" />
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
import VueBadgeList from 'src/components/VueBadgeList.vue';
import BannerApp from 'src/components/BannerApp.vue';
import VueBannerRoutes from 'src/components/VueBannerRoutes.vue';
import VueCardListFollow from 'src/components/VueCardListFollow.vue';
import VueCardListOffer from 'src/components/VueCardListOffer.vue';
import VueCardListPost from 'src/components/VueCardListPost.vue';
import VueCardListProgress from 'src/components/VueCardListProgress.vue';
import VueNewsletterFeature from 'src/components/VueNewsletterFeature.vue';
import VueProgressSlider from 'src/components/VueProgressSlider.vue';

// mocks
import * as homepage from '../mocks/homepage';

export default defineComponent({
  name: 'IndexPage',
  components: {
    EventCountdown,
    ListCardChallenge,
    BannerImage,
    HeadingBackground,
    ListCardEvent,
    VueBadgeList,
    VueBannerRoutes,
    VueCardListOffer,
    VueCardListPost,
    VueNewsletterFeature,
    VueCardListFollow,
    VueProgressSlider,
    VueCardListProgress,
    BannerApp,
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
