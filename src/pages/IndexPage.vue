<template>
  <q-page class="q-px-lg">
    <h1 class="text-h6 q-mt-none q-pt-lg text-weight-bold">{{ $t('index.title') }}</h1>
    <event-countdown :release-date="releaseDate"></event-countdown>
    <card-list :cards="cards"></card-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EventCountdown from 'components/EventCountdown.vue';
import CardList from 'components/CardList.vue';

import { CardChallenge } from 'components/types';

export default defineComponent({
  name: 'IndexPage',
  components: { EventCountdown, CardList },
  setup() {
    const releaseDate = '2023-10-01T12:00:00'

    const cards: CardChallenge[] = [
      {
        title: 'Challenge 1',
        url: '#',
        dates: '1. říj.–31. říj. 2022'
      },
      {
        title: 'Challenge 2',
        url: '#',
        dates: '1. říj.–31. říj. 2022'
      },
      {
        title: 'Challenge 3',
        url: '#',
        dates: '1. říj.–31. říj. 2022'
      },
      {
        title: 'Challenge 4',
        url: '#',
        dates: '1. říj.–31. říj. 2022'
      },
      {
        title: 'Challenge 5',
        url: '#',
        dates: '1. říj.–31. říj. 2022'
      }
    ]

    return {
      releaseDate, cards
    };
  }
});
</script>
