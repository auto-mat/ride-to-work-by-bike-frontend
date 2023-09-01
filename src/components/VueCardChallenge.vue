<script lang="ts">
import { defineComponent } from 'vue';

// import types
import { CardChallenge, ConfigGlobal } from 'components/types';

// import config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

export default defineComponent({
  name: 'VueCardChallenge',
  props: {
    card: {
      type: Object as () => CardChallenge,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    return { borderRadius };
  },
});
</script>

<template>
  <q-card
    dark
    flat
    bordered
    data-cy="card"
    :style="{ 'border-radius': borderRadius }"
  >
    <!-- Bg image -->
    <q-img
      :img-style="{ borderRadius: borderRadius }"
      :src="card?.image?.src"
      :alt="card?.image?.alt"
      :ratio="7 / 8"
    >
      <!-- Header -->
      <q-card-section
        class="text-subtitle1 absolute-top flex items-center justify-center gap-8"
        data-cy="card-title"
      >
        <div class="q-py-md">
          <!-- Person icon -->
          <q-icon name="person" size="xs" />
          <!-- Title link -->
          <component
            :is="card?.url ? 'a' : 'div'"
            :href="card?.url"
            class="text-white text-weight-bold"
            data-cy="card-link"
          >
            {{ card?.title }}
          </component>
        </div>
      </q-card-section>
    </q-img>

    <!-- Date -->
    <q-card-section
      v-if="card?.dates"
      class="absolute-bottom text-center text-body2"
      data-cy="card-dates"
    >
      {{ $t('index.cardChallenge.dates') }}
      <span class="text-weight-bold">{{ card?.dates }}</span>
    </q-card-section>

    <!-- Company challenge label -->
    <div class="badge-wrapper center" data-cy="card-company-wrapper">
      <q-badge
        v-if="card?.company"
        class="text-caption q-px-sm bg-blue-grey-4"
        text-color="white"
        rounded
        data-cy="card-company"
      >
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
