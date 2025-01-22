<script lang="ts">
/**
 * ResetPasswordPage Component
 *
 * The `ResetPasswordPage` renders the page for password reset functionality.
 *
 * @description
 * This component is used to allow users to reset their password after clicking
 * a reset password link from their email.
 *
 * @components
 * - `ResetPassword`: Component to handle password reset process.
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 */

// libraries
import { defineComponent } from 'vue';

// components
import ResetPassword from '../components/register/ResetPassword.vue';
import LoginRegisterHeader from '../components/global/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'ResetPasswordPage',
  components: {
    ResetPassword,
    LoginRegisterHeader,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <q-page padding>
    <div class="q-px-lg">
      <!-- Page header -->
      <login-register-header data-cy="login-register-header" />

      <div class="row q-mt-xl">
        <div class="col-12 col-md-4">
          <reset-password />
        </div>
      </div>
    </div>
  </q-page>
</template>
