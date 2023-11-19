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
import { defineComponent } from 'vue';

// components
import FormLogin from 'components/FormLogin.vue';
import LoginRegisterHeader from 'src/components/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'LoginPage',
  components: {
    FormLogin,
    LoginRegisterHeader,
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
      <login-register-header data-cy="login-register-header" />

      <div class="row">
        <div class="col-12 col-lg-4">
          <form-login />
        </div>
      </div>
    </div>
  </q-page>
</template>
