<script lang="ts">
/**
 * ChallengeInactiveInfo Component
 *
 * @description
 * Renders information about an inactive challenge, informing the user
 * that the challenge they're trying to access is not currently available.
 *
 * @example
 * <challenge-inactive-info />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6385-26491&t=Kg5tEX1Skno3i6DW-1)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChallengeInactiveInfo',
  setup() {
    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity20 = changeAlpha(white, 0.2);

    return {
      white,
      whiteOpacity20,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="challenge-inactive-info">
    <!-- Graphics -->
    <div class="q-mb-lg" data-cy="challenge-inactive-graphics">
      <q-avatar
        size="64px"
        :style="{ backgroundColor: whiteOpacity20 }"
        :color="white"
        data-cy="challenge-inactive-avatar"
      >
        <!-- Icon -->
        <q-icon
          size="40px"
          color="white"
          name="svguse:icons/challenge_inactive/icons.svg#email"
          data-cy="challenge-inactive-icon"
        />
      </q-avatar>
    </div>
    <!-- Heading -->
    <div class="q-mb-lg">
      <h1
        class="text-h5 text-bold q-my-none"
        data-cy="challenge-inactive-title"
      >
        {{ $t('challengeInactive.title') }}
      </h1>
    </div>
    <!-- Text -->
    <div
      data-cy="challenge-inactive-text"
      class="q-mb-xl"
      v-html="$t('challengeInactive.text')"
    />
  </div>
</template>
