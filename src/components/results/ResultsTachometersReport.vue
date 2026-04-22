<script lang="ts">
/**
 * ResultsTachometersReport Component
 *
 * @description * Use this component to display the tachometers Metabase report.
 * The section is hidden when `src` is empty.
 *
 * @props
 * - `src` (String, required): The Metabase embed URL
 *
 * @example
 * <results-tachometers-report :src="tachometersUrl" />
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ResultsTachometersReport',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <div v-if="src" data-cy="results-tachometers-section">
    <div class="text-right q-mt-sm q-mb-md">
      <a
        :href="src"
        target="_blank"
        class="text-primary"
        data-cy="results-tachometers-link-open-in-new-tab"
      >
        {{ $t('results.linkOpenResultsInNewTab') }}
      </a>
    </div>
    <iframe
      class="full-width"
      style="height: 560px"
      :src="src"
      frameBorder="0"
      data-cy="results-tachometers-iframe"
    />
  </div>
</template>
