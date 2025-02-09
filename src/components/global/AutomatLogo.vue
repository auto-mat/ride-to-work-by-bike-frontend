<script lang="ts">
/**
 * AutomatLogo Component
 *
 * The `AutomatLogo` component displays the AutoMat organization logo,
 * typically used as a link to the AutoMat website.
 *
 * @description
 * This component renders a clickable AutoMat logo image that navigates to the AutoMat website
 * when clicked.
 *
 * @props
 * - `width` (string): logo image width.
 * - `height` (string): logo image height.
 * - `url` (string, default: null): logo image URL link.
 * - `white` (boolean, default: false): true if white logo variant
 *
 * @example
 * <automat-logo />
 */

// libraries
import { computed, defineComponent, inject } from 'vue';

import { i18n } from '../../boot/i18n';
import { defaultLocale } from '../../i18n/def_locale';

import { getApiBaseUrlWithLang } from '../../utils/get_api_base_url_with_lang';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'AutomatLogo',
  props: {
    width: {
      type: String,
      default: '74px',
    },
    height: {
      type: String,
      default: '28px',
    },
    url: {
      type: [String, null],
      default: null,
    },
    white: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const logger = inject('vuejs3-logger') as Logger | null;
    let cyTest;
    if (window.Cypress) cyTest = true;
    const linkUrl = computed(() => {
      return props.url
        ? props.url
        : getApiBaseUrlWithLang(
            logger,
            rideToWorkByBikeConfig.urlAutoMat,
            defaultLocale,
            i18n,
          );
    });
    return {
      cyTest,
      linkUrl,
    };
  },
});
</script>

<template>
  <q-btn
    flat
    no-caps
    :href="linkUrl"
    target="_blank"
    class="q-pa-none"
    data-cy="automat-logo-button"
    :class="{ 'cy-test-bg-color': cyTest }"
  >
    <!-- White variant -->
    <q-img
      v-if="white"
      :width="width"
      :height="height"
      fit="contain"
      src="~assets/svg/logo-automat-white.svg"
      :alt="$t('index.logoAutomatAltText')"
      data-cy="automat-logo-image"
    />
    <!-- Red variant -->
    <q-img
      v-else
      :width="width"
      :height="height"
      fit="contain"
      src="~assets/svg/logo-automat.svg"
      :alt="$t('index.logoAutomatAltText')"
      data-cy="automat-logo-image"
    />
  </q-btn>
</template>

<style scoped lang="scss">
.cy-test-bg-color {
  background-color: yellow;
}
</style>
