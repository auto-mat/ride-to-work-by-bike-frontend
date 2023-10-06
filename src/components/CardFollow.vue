<script lang="ts">
// libraires
import { defineComponent } from 'vue';

// types
import { CardFollow, ConfigGlobal } from 'components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

export default defineComponent({
  name: 'CardFollow',
  props: {
    card: {
      type: Object as () => CardFollow,
      required: true,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const borderColor = rideToWorkByBikeConfig.colorGrayMiddle;

    return {
      borderRadius,
      borderColor,
    };
  },
});
</script>

<template>
  <div class="pt-48" data-cy="card-follow-wrapper">
    <q-card
      data-cy="card-follow"
      class="q-px-md q-py-md bg-white"
      bordered
      flat
      :style="{
        'border-radius': borderRadius,
        border: `1px solid ${borderColor}`,
      }"
    >
      <!-- Card avatar -->
      <q-item-section avatar data-cy="card-follow-avatar">
        <!-- Image -->
        <q-avatar size="96px" class="mt--64">
          <q-img :src="card.image.src" data-cy="card-follow-image" :alt="card.image.alt" ratio="1" />
        </q-avatar>
      </q-item-section>

      <!-- Card content -->
      <q-item-section class="q-pt-sm">
        <!-- Link follow on social media -->
        <a :href="card.url" target="_blank" data-cy="card-follow-link">
          <q-item-label
            class="text-body1 text-weight-medium text-grey-10"
            data-cy="card-follow-title"
            >{{ card.title }}</q-item-label
          >
        </a>
        <!-- Label: Social media handle -->
        <q-item-label
          class="q-mt-xs text-subtitle2 text-weight-regular text-blue-grey-7"
          data-cy="card-follow-handle"
          >{{ card.handle }}</q-item-label
        >
      </q-item-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.pt-48 {
  padding-top: 48px;
}
.mt--64 {
  margin-top: -64px;
}
</style>
