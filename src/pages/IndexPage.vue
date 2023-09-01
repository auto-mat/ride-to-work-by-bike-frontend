<template>
  <q-page data-cy="q-main">
    <div class="q-px-lg">
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
      <vue-card-list-challenge
        :cards="cards"
        class="q-pt-xl q-pb-xl"
        data-cy="list-challenge"
      ></vue-card-list-challenge>
      <vue-banner-image
        :banner="banner"
        class="q-pt-xl q-pb-xl"
        data-cy="banner-image"
      ></vue-banner-image>
    </div>
    <vue-heading-background
      :title="headingBgTitle"
      class="q-pt-xl"
      data-cy="heading-background"
    ></vue-heading-background>
    <div class="bg-gray-light q-px-lg">
      <vue-card-list-event
        :cards="cardsEvent"
        class="q-pt-xl"
        data-cy="list-event"
      ></vue-card-list-event>
    </div>
  </q-page>
</template>

<script lang="ts">
// import libraries
import { defineComponent } from 'vue';

// import components
import VueEventCountdown from 'components/VueEventCountdown.vue';
import VueCardListChallenge from 'components/VueCardListChallenge.vue';
import VueBannerImage from 'components/VueBannerImage.vue';
import VueHeadingBackground from 'src/components/VueHeadingBackground.vue';
import VueCardListEvent from 'src/components/VueCardListEvent.vue';

// import types
import { CardChallenge, CardEvent } from 'components/types';
import { BannerImage } from 'components/types';

export default defineComponent({
  name: 'IndexPage',
  components: {
    VueEventCountdown,
    VueCardListChallenge,
    VueBannerImage,
    VueHeadingBackground,
    VueCardListEvent,
  },
  setup() {
    const releaseDate = '2023-10-01T12:00:00';

    const cards: CardChallenge[] = [
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

    const banner: BannerImage = {
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

    const cardsEvent: CardEvent[] = [
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
        content:
          'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!',
        links: ['meet.google.com/anr-pvfs-opf', 'meet.google.com/anr-pvfs-opf'],
      },
    ];

    return {
      releaseDate,
      cards,
      banner,
      headingBgTitle,
      cardsEvent,
    };
  },
});
</script>
