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
import { Screen } from 'quasar';
import { computed, defineComponent } from 'vue';

// components
import HeaderLogo from './HeaderLogo.vue';
import HelpButton from './HelpButton.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';
import LoginRegisterMobileMenu from './LoginRegisterMobileMenu.vue';

// stores
import { useLoginStore } from '../../stores/login';

export default defineComponent({
  name: 'LoginRegisterHeader',
  components: {
    HeaderLogo,
    HelpButton,
    LanguageSwitcher,
    LoginRegisterMobileMenu,
  },
  setup() {
    const isDesktop = computed((): boolean => {
      return Screen.gt.sm;
    });
    const logoHeight = computed((): string => {
      return isDesktop.value ? '80px' : '48px';
    });
    const logoWidth = computed((): string => {
      return isDesktop.value ? '280px' : '170px';
    });

    const loginStore = useLoginStore();
    const userLoggedIn = computed((): boolean => {
      return loginStore.isUserLoggedIn;
    });
    const onLogout = (): void => {
      loginStore.logout();
    };

    return {
      isDesktop,
      logoHeight,
      logoWidth,
      onLogout,
      userLoggedIn,
    };
  },
});
</script>

<template>
  <div class="flex items-center justify-between q-py-lg">
    <!-- RTWBB logo -->
    <header-logo
      :width="logoWidth"
      :height="logoHeight"
      data-cy="header-logo"
    />
    <div v-if="isDesktop" class="flex items-center gap-32">
      <!-- Logout button -->
      <q-btn
        v-if="userLoggedIn"
        unelevated
        round
        size="15px"
        color="white"
        :title="$t('userSelect.logout')"
        @click="onLogout"
        data-cy="logout-button"
      >
        <q-icon
          name="svguse:/icons/login_register_header/icons.svg#lucide-logout"
          size="24px"
          color="primary"
          data-cy="logout-button-icon"
        />
      </q-btn>
      <!-- Help icon link for displaying modal dialog -->
      <help-button data-cy="help-button" />
      <!-- Language switcher -->
      <language-switcher variant="light" data-cy="language-switcher" />
    </div>
    <div v-else class="flex items-center gap-16">
      <!-- Mobile menu -->
      <login-register-mobile-menu data-cy="login-register-mobile-menu" />
    </div>
  </div>
</template>
