<script lang="ts">
/**
 * ConfirmEmailPage Component
 *
 * The `ConfirmEmailPage` renders the page with email confirmation.
 *
 * @description
 * This component is used to prompt users to confirm their email address
 * after registration.
 *
 * @components
 * - `EmailConfirmation`: Component to handle email confirmation process.
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 */

// libraries
import { defineComponent } from 'vue';

// components
import EmailConfirmation from 'components/register/EmailConfirmation.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'ConfirmEmailPage',
  components: {
    EmailConfirmation,
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
          <email-confirmation />
        </div>
      </div>
    </div>
  </q-page>
</template>
