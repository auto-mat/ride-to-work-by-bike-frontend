<script lang="ts">
/**
 * CommunityPage Component
 *
 * The `CommunityPage` displays information about community events.
 *
 * @components
 * - `CardEvent`: Card with event information.
 *
 * @layout
 * - `MainLayout`: Default layout with sidebar on desktop.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=ZZSrUuLgRLYixhUu-1)
 */
import { defineComponent, ref } from 'vue';

// components
import CardEvent from '../components/homepage/CardEvent.vue';
import ListCardFollow from '../components/homepage/ListCardFollow.vue';
import ListCardPost from 'src/components/homepage/ListCardPost.vue';
import ListCardSlider from '../components/global/ListCardSlider.vue';

// composables
import { i18n } from 'src/boot/i18n';

// config
import { routesConf } from 'src/router/routes_conf';

// fixtures
import events from '../../test/cypress/fixtures/listCardsEvent.json';
import listCardsFollow from '../../test/cypress/fixtures/listCardsFollow.json';
import listCardsLocation from '../../test/cypress/fixtures/listCardsLocation.json';
import listCardsPost from '../../test/cypress/fixtures/listCardsPost.json';

// types
import type { FormOption } from '../components/types/Form';
import type { CardPost, CardFollow, CardLocationType } from 'src/components/types';

export default defineComponent({
  name: 'CommunityPage',
  components: {
    CardEvent,
    ListCardFollow,
    ListCardPost,
    ListCardSlider,
  },
  setup() {
    const optionsCity: FormOption[] = [
      {
        label: 'Brno',
        value: 'brno',
      },
      {
        label: 'Ostrava',
        value: 'ostrava',
      },
      {
        label: 'Praha',
        value: 'praha',
      },
    ];
    const city = ref<string>('');

    const cardsFollow = listCardsFollow as CardFollow[];
    const cardsPost = listCardsPost as CardPost[];
    const buttonPosts = {
      title: i18n.global.t('index.cardListPost.button'),
      // TODO: add route
      url: routesConf?.blog?.path,
    };
    const cardsLocation = listCardsLocation as CardLocationType[];

    return {
      buttonPosts,
      cardsFollow,
      cardsPost,
      cardsLocation,
      city,
      events,
      optionsCity,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl q-pt-lg">
      <!-- Section title -->
      <div class="col-12 flex flex-wrap items-center justify-between gap-16">
        <!-- Page title -->
        <div>
          <h1
            class="text-h5 q-my-none text-weight-bold"
            data-cy="community-page-title"
          >
            {{ $t('community.titleCommunity') }}
          </h1>
        </div>

        <!-- Select: City -->
        <div class="row items-center">
          <label for="community-select-city" class="col-auto q-mr-sm">
            <span>{{ $t('community.labelSelectCity') }}:</span>
          </label>
          <q-select
            dense
            outlined
            emit-value
            map-options
            v-model="city"
            :options="optionsCity"
            :style="{ 'min-width': '160px' }"
            class="col-auto"
            id="community-select-city"
            data-cy="community-select-city"
          />
        </div>
      </div>

      <!-- Section: Local events -->
      <div class="q-mt-lg">
        <h2 class="text-h6 q-my-none" data-cy="local-events-title">
          {{ $t('community.titleLocalEvents') }}
        </h2>
        <div data-cy="local-events-list">
          <card-event
            v-for="card in events"
            :key="card.title"
            :card="card"
            class="q-mt-lg"
            data-cy="local-events-item"
          />
        </div>

        <!-- TODO: Section: Past events -->
      </div>

      <!-- TODO: Section Forum -->

      <!-- Section: Locations -->
      <list-card-slider
        :title="$t('results.titleLocations')"
        :cards="cardsLocation"
        cardType="CardLocation"
        :button="{ title: $t('results.buttonLocationsMap'), url: '#' }"
        class="q-pt-xl"
        data-cy="list-card-slider"
      />

      <!-- TODO: Section Social networks -->
      <list-card-follow :cards="cardsFollow" class="q-pt-xl" />

      <list-card-post
        :cards="cardsPost"
        :title="$t('index.cardListPost.title')"
        :button="buttonPosts"
        class="q-pt-xl"
        data-cy="list-card-post"
      />

      <!-- TODO: Section Instagram -->
    </div>
  </q-page>
</template>
