<script lang="ts">
/**
 * SectionColumnsTest Component
 *
 * The `SectionColumnsTest`
 *
 * @description * Use this component to test the SectionColumns component.
 *
 * @props
 * - `columns` (Number, required): The number of columns.
 *   It should be one of these options: 2 | 3 | 4 | 6.
 *
 * @components
 * - `SectionColumns`: Component to render content in columns.
 * - `CardStats`: Card which provides content for the component.
 *
 * @example
 * <SectionColumnsTest />
 */

// libraries
import { defineComponent } from 'vue';

// components
import SectionColumns from './SectionColumns.vue';
import CardStats from './CardStats.vue';

// enums
import { StatisticsCategoryId } from '../../components/types/Statistics';

export default defineComponent({
  name: 'SectionColumnsTest',
  components: {
    SectionColumns,
    CardStats,
  },
  props: {
    columns: {
      type: Number as () => 2 | 3 | 4 | 6,
      required: true,
    },
  },
  setup() {
    const cardsStats: StatisticsCategoryId[] = [
      StatisticsCategoryId.personal,
      StatisticsCategoryId.team,
      StatisticsCategoryId.organization,
      StatisticsCategoryId.city,
    ];

    return {
      cardsStats,
    };
  },
});
</script>

<template>
  <section-columns :columns="columns" class="q-col-gutter-lg q-pt-xl q-pb-xl">
    <card-stats v-for="card in cardsStats" :key="card" :category="card" />
  </section-columns>
</template>
