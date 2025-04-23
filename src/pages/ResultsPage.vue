<script lang="ts">
/**
 * Results Page
 *
 * Shows upcoming challenges, badges, user progress, and other results.
 *
 * @components
 * - `PageHeading`: Component to render the page heading.
 * - `ResultsTabs`: Component to render tabs with results content.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4948%3A125553&mode=dev)
 **/

// libraries
import { defineComponent } from 'vue';

// components
import PageHeading from 'components/global/PageHeading.vue';
import ResultsTabs from 'components/results/ResultsTabs.vue';

export default defineComponent({
  name: 'ResultsPage',
  components: {
    PageHeading,
    ResultsTabs,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg q-pt-lg">
      <!-- Heading -->
      <page-heading data-cy="results-page-title">
        {{ $t('results.titleResults') }}
      </page-heading>
    </div>
    <results-tabs class="q-pb-xl" data-cy="results-tabs" />
  </q-page>
</template>
