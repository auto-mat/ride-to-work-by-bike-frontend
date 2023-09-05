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
      class="flex flex-wrap items-center justify-between gap-x-40 gap-y-16"
      data-cy="card-list-progress"
    >
      <h2 class="text-h6" data-cy="card-list-progress-title">
        {{ title }}
      </h2>
      <q-list
        class="list-unstyled flex flex-wrap items-center q-p-none gap-x-40 gap-y-16"
      >
        <q-item
          v-for="item in stats"
          :key="item.icon"
          data-cy="card-list-progress-stats-item"
          class="text-grey-10"
        >
          <q-icon :name="item.icon" color="blue-grey-3" size="18px" />&nbsp;
          <strong>{{ item.value }}</strong
          >&nbsp;
          <span>{{ item.label }}</span>
        </q-item>
      </q-list>
    </div>
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
    <div v-if="button" class="text-sm-center">
      <q-btn
        rounded
        color="grey-10"
        unelevated
        outline
        :to="button.url"
        :label="button.title"
        class="z-1"
        data-cy="card-list-progress-button"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.z-1 {
  z-index: 1;
}

.text-sm-center {
  text-align: left;

  @media (min-width: $breakpoint-sm-min) {
    text-align: center;
  }
}

.justify-sm-center {
  @media (min-width: $breakpoint-sm-min) {
    justify-content: center;
  }
}

.list-unstyled {
  list-style: none;
}

.gap-x-40 {
  row-gap: 40px;
}

.gap-y-16 {
  column-gap: 16px;
}
</style>
