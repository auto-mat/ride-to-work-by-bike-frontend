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
        :cards="cardsProgress"
        :stats="progressStats"
        :button="{ title: $t('index.progressSlider.button'), url: '/blog' }"
      >
      </vue-progress-slider>
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
      <vue-card-list-follow :cards="cardFollow" class="q-pt-xl" />
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

// import types
import { CardChallenge as CardChallengeType, CardEvent as CardEventType, BannerImage as BannerImageType } from 'components/types';
import { CardPost, Offer, CardFollow, ItemStatistics, CardProgress } from 'components/types';

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
  },
  setup() {
    const releaseDate = '2023-10-01T12:00:00';

    const cards: CardChallengeType[] = [
      {
        title: 'Týmová pravidelnost',
        url: '#',
        image: {
          src: 'https://picsum.photos/id/70/500/540',
          alt: 'road lined with trees',
        },
        dates: '1. říj.–31. říj. 2022',
        company: false,
      },
      {
        title: 'Vaše pravidelnost',
        url: '#',
        image: {
          src: 'https://picsum.photos/id/70/500/530',
          alt: 'road lined with trees',
        },
        dates: '1. říj.–31. říj. 2022',
        company: false,
      },
      {
        title: 'Vaše zelené kilometry',
        url: '#',
        image: {
          src: 'https://picsum.photos/id/70/500/550',
          alt: 'road lined with trees',
        },
        dates: '1. říj.–31. říj. 2022',
        company: true,
      },
      {
        title: 'Zelené kilometry týmu',
        url: '#',
        image: {
          src: 'https://picsum.photos/id/70/500/520',
          alt: 'road lined with trees',
        },
        dates: '1. říj.–31. říj. 2022',
        company: true,
      },
      {
        title: 'Zelené kilometry pobočky',
        url: '#',
        image: {
          src: 'https://picsum.photos/id/70/500/540',
          alt: 'road lined with trees',
        },
        dates: '1. říj.–31. říj. 2022',
        company: false,
      },
    ];

    const banner: BannerImageType = {
      title: 'Vyplňte náš dotazník a vyhrajte jednu z našich skvělých cen!',
      perex:
        'Pomůžete nám rozhodnout, čemu příště věnovat více času a co by naopak mělo zůstat stejné.',
      image: {
        src: 'https://picsum.photos/id/70/600/200',
        alt: 'road lined with trees',
      },
    };

    const headingBgTitle =
      'Zapojte se do komunity Do práce na kole ve svém městě';

    const cardsEvent: CardEventType[] = [
      {
        title: 'Opening Ceremony Bike to Work 2022',
        thumbnail: {
          src: 'https://picsum.photos/id/70/340/200',
          alt: 'road lined with trees',
        },
        image: {
          src: 'https://picsum.photos/id/70/380/380',
          alt: 'road lined with trees',
        },
        dates: new Date('2023-10-01T12:00:00'),
        location: 'Prague',
        content: `We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle!
          You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams.
          Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony.
          We will also announce the traditional Brno cycling employer of the year.
          <br />
          The main prize will be a City Bike HERKA from our partner Cyklospeciality.
          <br />
          We are looking forward to seeing you!`,
        links: ['meet.google.com/anr-pvfs-opf', 'meet.google.com/anr-pvfs-opf'],
      },
    ];

    const cardOffer: Offer = {
      title: '100 CZK voucher do e-shopu Automatu',
      expirationDate: 'Some time later on',
      issuer: 'Automat',
      image: 'https://picsum.photos/380/380',
      code: '65972834',
      link: {
        title: 'Navštívit e-shop',
        url: '#',
        target: '_blank',
      },
      icon: 'pedal_bike',
      content:
        'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
    };
    const cardsOffer: Offer[] = [
      cardOffer,
      cardOffer,
      cardOffer,
      cardOffer,
      cardOffer,
      cardOffer,
      cardOffer,
    ];

    const cardPost: CardPost = {
      title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
      date: new Date(2023, 8, 1),
      image: 'https://picsum.photos/id/100/380/380',
      url: '/blog/1',
    };
    const cardsPost: CardPost[] = [
      cardPost,
      cardPost,
      cardPost,
      cardPost,
      cardPost,
    ];

    const cardFollow: CardFollow[] = [
      {
        title: 'Do práce na kole – Brno',
        handle: '@DPNKBrno',
        image: 'https://picsum.photos/id/76/300/300',
        url: '#',
      },
      {
        title: 'Do práce na kole – Brno',
        handle: '@DPNKBrno',
        image: 'https://picsum.photos/id/76/300/300',
        url: '#',
      },
    ];

    const cardsProgress: CardProgress[] = [
      {
        title: 'Týmová pravidelnost',
        icon: 'person',
        url: '#',
        image: '',
        progress: 60,
        stats: [
          {
            title: '',
            items: [{ id: '1', text: '' }],
          },
          {
            title: '',
            items: [{ id: '1', text: '' }],
          },
        ],
        duration: {
          current: 14,
          total: 30,
        },
      },
      {
        title: 'Žebříčky',
        icon: 'person',
        url: '#',
        image: '',
        progress: 60,
        stats: [
          {
            title: '',
            items: [{ id: '1', text: '' }],
          },
          {
            title: '',
            items: [{ id: '1', text: '' }],
          },
        ],
        duration: {
          current: 14,
          total: 30,
        },
      },
    ];

    const progressStats: ItemStatistics[] = [
      {
        icon: 'route',
        label: 'udržitelných cest',
        value: '18',
      },
      {
        icon: 'distance',
        label: '312,25 km',
        value: '',
      },
      {
        icon: 'leaf',
        label: 'ušetřeno',
        value: '420 g CO2',
      },
    ];

    return {
      releaseDate,
      cards,
      banner,
      headingBgTitle,
      cardsEvent,
      cardsOffer,
      cardsPost,
      cardFollow,
      cardsProgress,
      progressStats,
    };
  },
});
</script>

<style scoped lang="scss">
.bg-gray-lighter {
  background-color: var(--q-gray-lighter);
}
</style>
