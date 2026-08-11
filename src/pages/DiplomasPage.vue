<script lang="ts">
/**
 * Diplomas Page
 *
 * Shows the list of diplomas the current user earned across all
 * challenge participations, with a download action for each.
 *
 * @components
 * - `PageHeading`: Component to render the page heading.
 * - `DiplomasList`: Component to render the list of diplomas.
 */

// libraries
import { defineComponent } from 'vue';

// components
import PageHeading from 'components/global/PageHeading.vue';
import DiplomasList from 'components/diplomas/DiplomasList.vue';

export default defineComponent({
  name: 'DiplomasPage',
  components: {
    PageHeading,
    DiplomasList,
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg q-pt-lg">
      <!-- Heading -->
      <page-heading data-cy="diplomas-page-title">
        {{ $t('diplomas.titleDiplomas') }}
      </page-heading>
    </div>
    <diplomas-list class="q-px-lg q-pb-xl" data-cy="diplomas-list" />
  </q-page>
</template>
