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

// fixtures
import events from '../../test/cypress/fixtures/listCardsEvent.json';

// types
import type { FormOption } from '../components/types/Form';

export default defineComponent({
  name: 'CommunityPage',
  components: {
    CardEvent,
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

    return {
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

      <!-- TODO: Section Locations -->

      <!-- TODO: Section Social networks -->

      <!-- TODO: Section News -->

      <!-- TODO: Section Instagram -->
    </div>
  </q-page>
</template>
