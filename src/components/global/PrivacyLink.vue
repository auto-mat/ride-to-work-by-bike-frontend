<script lang="ts">
/**
 * PrivacyLink Component
 *
 * @description * Use this component to display a Matomo Analytics
 * privacy rules page link.
 *
 * Used in: `LoginPage`
 *
 * @props
 *
 * @example
 * <privacy-link />
 *
 */

// libraries
import { defineComponent } from 'vue';

import { routesConf } from '../../router/routes_conf';

export default defineComponent({
  name: 'PrivacyLink',
  props: {},
  setup() {
    let cyTest;
    if (window.Cypress) cyTest = true;
    const privacyRulesUrl = routesConf['privacy_rules']['path'];
    return { cyTest, privacyRulesUrl };
  },
});
</script>

<template>
  <div data-cy="privacy-link">
    <router-link
      :to="privacyRulesUrl"
      target="_blank"
      :class="{ 'cy-test-bg-color': cyTest, 'text-white': true }"
      >{{ $t('privacy.header') }}</router-link
    >
  </div>
</template>

<style scoped lang="scss">
.cy-test-bg-color {
  background-color: black;
}
</style>
