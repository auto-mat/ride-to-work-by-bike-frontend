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
      <vue-card-list-offer
        :cards="cardsOffer"
        class="q-pt-xl"
        data-cy="list-offer"
      >
      </vue-card-list-offer>
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
import VueCardListOffer from 'src/components/VueCardListOffer.vue';

// import types
import { CardChallenge, CardEvent } from 'components/types';
import { BannerImage } from 'components/types';
import { Offer } from 'components/types';

export default defineComponent({
  name: 'IndexPage',
  components: {
    VueEventCountdown,
    VueCardListChallenge,
    VueBannerImage,
    VueHeadingBackground,
    VueCardListEvent,
    VueCardListOffer,
  },
  setup() {
    const releaseDate = '2023-10-01T12:00:00';

    const cards: CardChallenge[] = [
      {
        title: 'Týmová pravidelnost',
        url: '#',
        image: 'https://picsum.photos/500/540',
        dates: '1. říj.–31. říj. 2022',
        company: false,
      },
      {
        title: 'Vaše pravidelnost',
        url: '#',
        image: 'https://picsum.photos/500/530',
        dates: '1. říj.–31. říj. 2022',
        company: false,
      },
      {
        title: 'Vaše zelené kilometry',
        url: '#',
        image: 'https://picsum.photos/500/550',
        dates: '1. říj.–31. říj. 2022',
        company: true,
      },
      {
        title: 'Zelené kilometry týmu',
        url: '#',
        image: 'https://picsum.photos/500/520',
        dates: '1. říj.–31. říj. 2022',
        company: true,
      },
      {
        title: 'Zelené kilometry pobočky',
        url: '#',
        image: 'https://picsum.photos/500/550',
        dates: '1. říj.–31. říj. 2022',
        company: false,
      },
    ];

    const banner: BannerImage = {
      title: 'Vyplňte náš dotazník a vyhrajte jednu z našich skvělých cen!',
      perex:
        'Pomůžete nám rozhodnout, čemu příště věnovat více času a co by naopak mělo zůstat stejné.',
      image: 'https://picsum.photos/600/200',
    };

    const headingBgTitle =
      'Zapojte se do komunity Do práce na kole ve svém městě';

    const cardsEvent: CardEvent[] = [
      {
        title: 'Opening Ceremony Bike to Work 2022',
        thumbnail: 'https://picsum.photos/340/200',
        image: 'https://picsum.photos/380/380',
        dates: new Date('2023-10-01T12:00:00'),
        location: 'Prague',
        content:
          'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!',
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

    return {
      releaseDate,
      cards,
      banner,
      headingBgTitle,
      cardsEvent,
      cardsOffer,
    };
  },
});
</script>

<style scoped lang="scss">
.bg-gray-light {
  background-color: var(--q-gray-light);
}
</style>
