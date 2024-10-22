<script lang="ts">
/**
 * HeaderLogo Component
 *
 * The `HeaderLogo` component displays the application logo in the header,
 * typically used as a home button.
 *
 * @description
 * This component renders a clickable logo image that navigates to the home page
 * when clicked.
 * Note: Used in `DrawerHeader` component.
 *
 * @example
 * <header-logo />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=nCt4lu0QQsQLD8oQ-1)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'HeaderLogo',
  setup() {
    const linkUrl = rideToWorkByBikeConfig.urlRTWBBLogo;
    return {
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
    class="q-pa-none"
    data-cy="header-logo-button"
  >
    <q-img
      width="140px"
      height="40px"
      fit="contain"
      src="~assets/svg/logo-white.svg"
      :alt="$t('index.logoAltText')"
      data-cy="header-logo-image"
    />
  </q-btn>
</template>
