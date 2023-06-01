<script lang="ts">
import { defineComponent } from 'vue';
import { CardChallenge } from 'components/types';

export default defineComponent({
  name: 'VueCardChallenge',
  props: {
    card: {
      type: Object as () => CardChallenge,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <q-card :dark="true" :flat="true" :bordered="true" class="rounded-20" data-testid="card">
    <q-img :src="card?.image" :ratio="7 / 8" class="rounded-20">
      <q-card-section class="text-subtitle1 absolute-top flex items-center justify-center gap-8" data-testid="card-title">
        <q-icon name="person" size="xs" />
        <component :is="card?.url ? 'a' : 'div'" :href="card?.url" class="text-white text-weight-bold"
          data-testid="card-link">
          {{ card?.title }}
        </component>
      </q-card-section>
      <div v-if="card?.dates" class="absolute-bottom text-center text-body2" data-testid="card-dates">
        {{ $t('index.cardChallenge.dates') }}
        <span class="text-weight-bold">{{ card?.dates }}</span>
      </div>
    </q-img>

    <div class="badge-wrapper">
      <q-badge v-if="card?.company" class="text-caption q-px-sm bg-blue-grey-4" text-color="white" rounded>
        {{ $t('index.cardChallenge.company') }}
      </q-badge>
    </div>
  </q-card>
</template>

<style scoped>
a:hover {
  text-decoration: none;
}

.gap-8 {
  gap: 8px;
}

.rounded-20 {
  border-radius: 20px;
}

.q-card>div:first-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.q-img__content {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.q-img__content>div {
  padding: 32px 12px;
}

.q-img__content>div:nth-child(2) {
  padding: 20px 12px;
  background: transparent;
}

.badge-wrapper {
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
