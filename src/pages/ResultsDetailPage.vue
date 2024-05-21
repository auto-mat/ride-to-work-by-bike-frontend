<script lang="ts">
/**
 * Results Detail Page
 *
 * Shows results for a single user.
 *
 * @components
 * - `ResultsList`: Component to list of user's results.
 * - `ResultsTabs`: Component to render tabs with results views.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858%3A105197&t=4cALO2fsjKI90AW1-1)
 **/

// libraries
import { defineComponent } from 'vue';

// components
import ResultsList from 'components/results/ResultsList.vue';
import ResultsTabs from 'components/results/ResultsTabs.vue';

export default defineComponent({
  name: 'ResultsDetailPage',
  components: {
    ResultsList,
    ResultsTabs,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl">
      <!-- TODO: Breadcrumb-style Heading -->
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="results-detail-page-title"
      >
        {{ $t('results.titleResults') }}
      </h1>

      <results-list data-cy="results-list" />

      <results-tabs class="q-pt-xl" data-cy="results-tabs" />
    </div>
  </q-page>
</template>
