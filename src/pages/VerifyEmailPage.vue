<script lang="ts">
/**
 * VerifyEmailPage Component
 *
 * The `VerifyEmailPage` renders the page with email confirmation.
 *
 * @description
 * This component is used to prompt users to confirm their email address
 * after registration.
 *
 * @components
 * - `EmailVerification`: Component to handle email confirmation process.
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-103206&t=wJyiVeMuR4PtXnLz-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import EmailVerification from 'components/register/EmailVerification.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'VerifyEmailPage',
  components: {
    EmailVerification,
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
          <email-verification />
        </div>
      </div>
    </div>
  </q-page>
</template>
