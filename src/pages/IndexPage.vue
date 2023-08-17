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
      <vue-progress-slider
        :title="$t('index.progressSlider.title')"
        :cards="cardsProgressSlider"
        :stats="progressStats"
        :button="{ title: $t('index.progressSlider.button'), url: '/blog' }"
      >
      </vue-progress-slider>
      <div class="flex">
        <vue-card-progress v-for="card in cardsProgress" :key="card.title" :card="card" />
      </div>
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
import VueEventCountdown from 'components/VueEventCountdown.vue';
import VueCardListChallenge from 'components/VueCardListChallenge.vue';
import VueBannerImage from 'components/VueBannerImage.vue';
import VueHeadingBackground from 'src/components/VueHeadingBackground.vue';
import VueCardListEvent from 'src/components/VueCardListEvent.vue';
import VueCardListOffer from 'src/components/VueCardListOffer.vue';
import VueCardListPost from 'src/components/VueCardListPost.vue';
import VueNewsletterFeature from 'src/components/VueNewsletterFeature.vue';
import VueCardListFollow from 'src/components/VueCardListFollow.vue';
import VueProgressSlider from 'src/components/VueProgressSlider.vue';
import VueCardProgress from 'src/components/VueCardProgress.vue';

// data
import * as homepage from '../mocks/homepage';

export default defineComponent({
  name: 'IndexPage',
  components: {
    VueEventCountdown,
    VueCardListChallenge,
    VueBannerImage,
    VueHeadingBackground,
    VueCardListEvent,
    VueCardListOffer,
    VueCardListPost,
    VueNewsletterFeature,
    VueCardListFollow,
    VueProgressSlider,
    VueCardProgress,
  },
  setup() {
    return {
      releaseDate: homepage.releaseDate,
      cardsChallenge: homepage.cardsChallenge,
      bannerImage: homepage.bannerImage,
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
