<template>
  <q-page class="q-px-lg">
    <h1 class="text-h6 q-mt-none q-pt-lg text-weight-bold">
      {{ $t('index.title') }}
    </h1>
    <event-countdown :release-date="releaseDate"></event-countdown>
    <card-list :cards="cards" class="q-pt-xl q-pb-xl"></card-list>
    <vue-banner-image
      :banner="banner"
      class="q-pt-xl q-pb-xl"
    ></vue-banner-image>
    <vue-heading-background
      :title="headingBgTitle"
      class="q-pt-xl"
    ></vue-heading-background>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EventCountdown from 'components/EventCountdown.vue';
import CardList from 'components/CardList.vue';
import VueBannerImage from 'components/VueBannerImage.vue';
import VueHeadingBackground from 'src/components/VueHeadingBackground.vue';

import { CardChallenge } from 'components/types';
import { BannerImage } from 'components/types';

export default defineComponent({
  name: 'IndexPage',
  components: {
    EventCountdown,
    CardList,
    VueBannerImage,
    VueHeadingBackground,
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

    return {
      releaseDate,
      cards,
      banner,
      headingBgTitle,
    };
  },
});
</script>
