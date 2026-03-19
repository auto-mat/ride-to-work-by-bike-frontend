<script lang="ts">
/**
 * PrivacyRules Component
 *
 * @description * Use this component to display a Matomo Analytics
 * privacy policy rules.
 *
 * Used in: `PrivacyPage`
 *
 * @props
 *
 * @example
 * <privacy-rules />
 *
 */

import { computed, defineComponent } from 'vue';

import { i18n } from '../../boot/i18n';

import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'PrivacyRules',
  props: {},
  setup() {
    const matomoRules = computed((): boolean => {
      return i18n.global.t('privacy.matomoRules', {
        url: rideToWorkByBikeConfig.urlMatomoAnalyticsHomePage,
      });
    });
    return {
      matomoRules: matomoRules,
    };
  },
});
</script>

<template>
  <div
    class="bg-primary text-white"
    data-cy="privacy-rules"
    style="line-height: 2"
  >
    <h4 data-cy="header">{{ $t('privacy.header') }}</h4>
    <h5 data-cy="subheader">{{ $t('privacy.subheader') }}</h5>
    <h6 data-cy="subsubheader-matomo">
      {{ $t('privacy.subsubheaderMatomo') }}
    </h6>
    <span data-cy="matomo-rules" v-html="matomoRules"></span>
    <h6 data-cy="subsubheader-ip-anonymisation">
      {{ $t('privacy.subsubheaderIpAnonymisation') }}
    </h6>
    <span data-cy="ip-anonymisation-rules">{{
      $t('privacy.ipAnonymisationRules')
    }}</span>
  </div>
</template>
