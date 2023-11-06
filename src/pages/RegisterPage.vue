<script lang="ts">
/**
 * RegisterPage Component
 *
 * The `RegisterPage` renders the page with login form and password reset form.
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
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// components
import HelpButton from 'components/HelpButton.vue';
import LanguageSwitcher from 'components/LanguageSwitcher.vue';
import FormRegister from 'src/components/FormRegister.vue';

export default defineComponent({
  name: 'RegisterPage',
  components: {
    HelpButton,
    LanguageSwitcher,
    FormRegister,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <q-page padding class="bg-secondary">
    <div class="q-px-lg">
      <!-- Page header -->
      <div class="flex items-center justify-between q-py-lg">
        <!-- RTWBB logo -->
        <img
          class="logo"
          src="~assets/svg/logo.svg"
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

      <div class="row">
        <div class="col-12 col-lg-4">
          <form-register />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.logo {
  height: 80px;
}
</style>
