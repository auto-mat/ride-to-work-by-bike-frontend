<script lang="ts">
/**
 * AutomatLogoBanner Component
 *
 * @description * Use this component to display the Automat logo and text.
 * Note: This component is used in the sidebar of the application.
 *
 * @components
 * - `AutomatLogo`: Component to display the Automat logo.
 *
 * @example
 * <automat-logo-banner />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=M4KDRazzu8afwQQF-1)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent } from 'vue';

// components
import AutomatLogo from './AutomatLogo.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'AutomatLogoBanner',
  components: {
    AutomatLogo,
  },
  setup() {
    const { colorWhiteBorderOpacity, borderRadiusCard: borderRadius } =
      rideToWorkByBikeConfig;

    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity = changeAlpha(white, colorWhiteBorderOpacity);

    return {
      whiteOpacity,
      borderRadius,
    };
  },
});
</script>

<template>
  <div
    class="flex items-center no-wrap gap-24 q-pa-md"
    :style="{ border: `1px solid ${whiteOpacity}`, borderRadius }"
    data-cy="automat-logo-banner"
  >
    <div data-cy="automat-logo-banner-logo">
      <automat-logo white />
    </div>
    <div class="text-white text-caption" data-cy="automat-logo-banner-text">
      {{ $t('index.textAutomatOrganizer') }}
    </div>
  </div>
</template>
