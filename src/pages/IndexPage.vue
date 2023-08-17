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
      ></event-countdown>
      <list-card-challenge
        :cards="cards"
        class="q-pt-xl q-pb-xl"
        data-cy="list-challenge"
      ></list-card-challenge>
      <banner-image
        :banner="banner"
        class="q-pt-xl q-pb-xl"
        data-cy="banner-image"
      ></banner-image>
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
      ></vue-card-list-offer>
      <vue-progress-slider :title="$t('index.progressSlider.title')" :cards="cardsPost" :stats="progressStats"
        :button="{ title: $t('index.progressSlider.button'), url: '/blog' }">
      </vue-progress-slider>
    </div>
    <div class="q-px-lg">
      <vue-card-list-offer :title="$t('index.cardListOffer.title')" :cards="cardsOffer" class="q-pt-xl"
        data-cy="list-offer">
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
import VueCardListOffer from 'src/components/VueCardListOffer.vue';
import VueCardListPost from 'src/components/VueCardListPost.vue';
import VueNewsletterFeature from 'src/components/VueNewsletterFeature.vue';
import VueCardListFollow from 'src/components/VueCardListFollow.vue';
import VueProgressSlider from 'src/components/VueProgressSlider.vue';
import VueCardProgress from 'src/components/VueCardProgress.vue';

// import types
import { CardChallenge as CardChallengeType, CardEvent as CardEventType, BannerImage as BannerImageType } from 'components/types';
import { CardPost, Offer, CardFollow, ItemStatistics, CardProgress } from 'components/types';
// data
import * as homepage from '../mocks/homepage';

export default defineComponent({
  name: 'IndexPage',
  components: {
    EventCountdown,
    ListCardChallenge,
    BannerImage,
    HeadingBackground,
    ListCardEvent,
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
