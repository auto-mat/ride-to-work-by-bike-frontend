<script lang="ts">
/**
 * LoginRegisterHeader Component
 *
 * The `LoginRegisterHeader` show header on login and registration pages.
 *
 * @description * Use this component to render the header including logo,
 * help dialog and language switcher.
 *
 * Note: This component is commonly used in `LoginPage` and `RegisterPage`.
 *
 * @components
 * - `HeaderLogo`: Component to render the logo.
 * - `HelpButton`: Component to render help icon with dialog.
 * - `LanguageSwitcher`: Component to render language switcher.
 *
 * @example
 * <login-register-header />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6692%3A29147&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// components
import HeaderLogo from './HeaderLogo.vue';
import HelpButton from './HelpButton.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

export default defineComponent({
  name: 'LoginRegisterHeader',
  components: {
    HeaderLogo,
    HelpButton,
    LanguageSwitcher,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="flex items-center justify-between q-py-lg">
    <!-- RTWBB logo -->
    <header-logo width="280px" height="80px" data-cy="header-logo" />
    <div class="flex items-center gap-32">
      <!-- Help icon link for displaying modal dialog -->
      <help-button data-cy="help-button" />
      <!-- Language switcher -->
      <language-switcher variant="light" data-cy="language-switcher" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo {
  height: 80px;
}
</style>
