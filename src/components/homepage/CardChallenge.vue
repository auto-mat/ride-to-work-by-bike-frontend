<script lang="ts">
/**
 * CardChallenge Component
 *
 * The `CardChallenge` component displays a challenge card with relevant details.
 *
 * @description
 * This component presents information about a challenge within the biking
 * initiative. The card may contain an image, title, and other details.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `SectionColumns`
 * component.
 *
 * @props
 * - `card` (Object, required): The card object with details for display. It should be of
 *   type `CardChallengeType`.
 *
 * @example
 * <card-challenge
 *   :card="challengeDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105617&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// types
import { CardChallenge as CardChallengeType, ConfigGlobal } from '../types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);

export default defineComponent({
  name: 'CardChallenge',
  props: {
    card: {
      type: Object as () => CardChallengeType,
      required: true,
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
        <!-- Person icon -->
        <q-icon class="q-py-md" name="person" size="xs" />
        <!-- Title link -->
        <component
          :is="card?.url ? 'a' : 'div'"
          :href="card?.url"
          class="text-white text-weight-bold q-py-md"
          data-cy="card-link"
        >
          {{ card?.title }}
        </component>
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
