<script lang="ts">
// library
import { defineComponent } from 'vue';

// types
import { CardProgress, ItemStatistics, Link } from './types';

// components
import VueCardProgress from './VueCardProgress.vue';

export default defineComponent({
  name: 'VueCardListProgress',
  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array as () => CardProgress[],
    },
    stats: {
      type: Array as () => ItemStatistics[],
    },
    button: {
      type: Object as () => Link,
      required: false,
    },
  },
  components: {
    VueCardProgress,
  },
});
</script>

<template>
  <div>
    <div
      class="row q-col-gutter-lg"
      data-cy="card-list-progress"
    >
      <!-- Title -->
      <h2 class="col-12 col-sm-6 text-h6" data-cy="card-list-progress-title">
        {{ title }}
      </h2>
      <!-- List of statistics -->
      <q-list
        class="col-12 col-sm-6 flex flex-wrap items-center justify-end q-p-none gap-x-40"
      >
        <q-item
          v-for="item in stats"
          :key="item.icon"
          data-cy="card-list-progress-stats-item"
          class="text-grey-10 q-px-none"
        >
          <!-- Icon -->
          <q-icon :name="item.icon" color="blue-grey-3" size="18px" />&nbsp;
          <!-- Value -->
          <strong>{{ item.value }}</strong>&nbsp;
          <!-- Label -->
          <span>{{ item.label }}</span>
        </q-item>
      </q-list>
    </div>
    <!-- Result cards -->
    <div class="row q-col-gutter-lg" data-cy="card-list-progress-wrapper">
      <div
        v-for="card in cards"
        :key="card.title"
        class="col-12 col-sm-6 col-lg-4"
        data-cy="card-list-progress-item"
      >
        <vue-card-progress :card="card"></vue-card-progress>
      </div>
    </div>
    <!-- Link to all results -->
    <div v-if="button" class="text-center q-pt-md">
      <q-btn
        rounded
        color="grey-10"
        unelevated
        outline
        :to="button.url"
        :label="button.title"
        data-cy="card-list-progress-button"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gap-x-40 {
  column-gap: 40px;
}
</style>
