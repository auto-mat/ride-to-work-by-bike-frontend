<script lang="ts">
/**
 * LoginPage Component
 *
 * The `LoginPage` renders the page with login form and password reset form.
 *
 * @description
 * This component is used to allow user to login into their account. Or
 * reset their password. It allows login via Google and Facebook accounts.
 * It contains links to App stores.
 *
 * @components
 * - `HelpButton`: Component to render help icon with modal dialog.
 * - `LanguageSwitcher`: Component that allows user to change language.
 *
 * @layout
 * - `LoginLayout`: Displayed within the `LoginLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6269%3A24768&mode=dev)
 */

// libraries
import { setCssVar } from 'quasar';
import { defineComponent } from 'vue';

// types
import { ConfigGlobal } from 'components/types';

// components
import HelpButton from 'components/HelpButton.vue';
import LanguageSwitcher from 'components/LanguageSwitcher.vue';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('primary', rideToWorkByBikeConfig.colorPrimary);

export default defineComponent({
  name: 'LoginPage',
  components: {
    HelpButton,
    LanguageSwitcher,
  },
});
</script>

<template>
  <q-page padding class="bg-primary">
    <div class="q-px-lg">
      <!-- Page header -->
      <div class="flex items-center justify-between q-py-lg">
        <!-- RTWBB logo -->
        <img
          class="logo"
          src="~assets/svg/logo-white.svg"
          :alt="$t('index.logoAltText')"
          :title="$t('header.siteTitle')"
          data-cy="logo"
        />
        <div class="flex items-center gap-32">
          <!-- Help icon link for displaying modal dialog -->
          <help-button size="13px" color="primary" />
          <!-- Language switcher -->
          <language-switcher variant="light" />
        </div>
      </div>
      <div class="q-py-lg">
        <h1 class="text-h5 text-bold text-white" data-cy="login-page-title">
          {{ $t('login.title') }}
        </h1>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.logo {
  height: 80px;
}
</style>
