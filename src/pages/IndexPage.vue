<template>
  <q-page data-cy="q-main">
    <div class="q-px-lg bg-white">
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="index-title"
      >
        {{ $t('index.title') }}
      </h1>
      <vue-event-countdown
        :release-date="releaseDate"
        data-cy="event-countdown"
      ></vue-event-countdown>
      <vue-banner-app :banner="bannerApp"></vue-banner-app>
      <vue-banner-routes :routes-count="3"
        class="q-mt-xl q-mb-xl"></vue-banner-routes>
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
      >
      </vue-card-list-progress>
      <vue-card-list-challenge
        :cards="cardsChallenge"
        class="q-pt-xl q-pb-xl"
        data-cy="list-challenge"
      ></vue-card-list-challenge>
      <vue-banner-image
        :banner="bannerImage"
        class="q-pt-xl q-pb-xl"
        data-cy="banner-image"
      ></vue-banner-image>
    </div>
    <vue-heading-background
      :title="headingBgTitle"
      class="bg-white q-pt-xl"
      data-cy="heading-background"
    ></vue-heading-background>
    <div class="q-px-lg">
      <vue-card-list-event
        :cards="cardsEvent"
        class="q-pt-xl"
        data-cy="list-event"
      ></vue-card-list-event>
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

// components
import VueBannerApp from 'src/components/VueBannerApp.vue';
import VueBannerImage from 'components/VueBannerImage.vue';
import VueBannerRoutes from 'src/components/VueBannerRoutes.vue';
import VueCardListChallenge from 'components/VueCardListChallenge.vue';
import VueCardListEvent from 'src/components/VueCardListEvent.vue';
import VueCardListFollow from 'src/components/VueCardListFollow.vue';
import VueCardListOffer from 'src/components/VueCardListOffer.vue';
import VueCardListPost from 'src/components/VueCardListPost.vue';
import VueCardListProgress from 'src/components/VueCardListProgress.vue';
import VueEventCountdown from 'components/VueEventCountdown.vue';
import VueHeadingBackground from 'src/components/VueHeadingBackground.vue';
import VueNewsletterFeature from 'src/components/VueNewsletterFeature.vue';
import VueProgressSlider from 'src/components/VueProgressSlider.vue';

// data
import * as homepage from '../mocks/homepage';

export default defineComponent({
  name: 'IndexPage',
  components: {
    VueEventCountdown,
    VueCardListChallenge,
    VueBannerImage,
    VueBannerRoutes,
    VueHeadingBackground,
    VueCardListEvent,
    VueCardListOffer,
    VueCardListPost,
    VueNewsletterFeature,
    VueCardListFollow,
    VueProgressSlider,
    VueCardListProgress,
    VueBannerApp,
  },
  setup() {
    return {
      releaseDate: homepage.releaseDate,
      cardsChallenge: homepage.cardsChallenge,
      bannerImage: homepage.bannerImage,
      bannerApp: homepage.bannerApp,
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
