<script lang="ts">
/**
 * ResultsList Component
 *
 * @description * Use this component to render set of results with title
 * and share link.
 *
 * @example
 * <results-list :results="results" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858%3A105197&t=Egw3f7zggxbtbYrE-1)
 */

// libraries
import { date } from 'quasar';
import { defineComponent } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';

// types
import type { ItemStatistics } from '../types/Item';

const { formatDate } = date;

export default defineComponent({
  name: 'ResultsList',
  setup() {
    const date = new Date('Ocotober 17, 2024 13:00:00');
    const dateChallengeStart = formatDate(date, 'D. MMM. YYYY');

    return {
      dateChallengeStart,
      results: [
        {
          icon: 'loader',
          label: i18n.global.t('results.labelRegularity'),
          value: '80%',
        },
        {
          icon: 'route',
          label: i18n.global.t('results.labelSustainableRoutes'),
          value: '18/20',
        },
        {
          icon: 'distance',
          label: '',
          value: `312,25 ${i18n.global.t('global.routeLengthUnit')}`,
        },
        {
          icon: 'leaf',
          label: i18n.global.t('results.labelCo2Saved'),
          value: `420 ${i18n.global.t('global.weightUnitGram')}`,
        },
      ] as ItemStatistics[],
    };
  },
});
</script>

<template>
  <div data-cy="results-list">
    <!-- Section: Top -->
    <div class="row items-center gap-4 justify-between">
      <!-- Title -->
      <h2 class="col-12 col-sm text-h6" data-cy="results-list-title">
        {{ $t('results.titleYourResultsSince', { date: dateChallengeStart }) }}
      </h2>
      <!-- Button: Share -->
      <div class="col col-sm-auto text-right">
        <q-btn
          outline
          rounded
          unelevated
          color="primary"
          data-cy="results-list-button"
        >
          <q-icon name="share" size="18px" class="q-mr-sm" />
          <span>{{ $t('global.buttonShare') }}</span>
        </q-btn>
      </div>
    </div>
    <q-list class="row q-mt-md" data-cy="results-list-inner">
      <q-item
        class="col-12 col-sm-6 col-lg-3"
        v-for="result in results"
        :key="result.label"
        data-cy="result-item"
      >
        <q-item-section avatar>
          <q-avatar
            color="white"
            text-color="grey-7"
            :icon="result.icon"
            data-cy="result-item-icon"
          />
        </q-item-section>
        <q-item-section top>
          <div>
            <q-item-label
              class="text-h6 text-bold text-black q-pr-sm"
              data-cy="result-item-title"
              >{{ result.value }}</q-item-label
            >
            <q-item-label
              caption
              class="text-subtitle2 text-bold text-black"
              data-cy="result-item-value"
            >
              <span v-html="result.label" />
            </q-item-label>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
