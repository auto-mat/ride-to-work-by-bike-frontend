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
 * - `EmailConfirmation`: Component to render email confirmation.
 * - `FormRegister`: Component to render registration form.
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import EmailConfirmation from 'components/register/EmailConfirmation.vue';
import FormRegister from 'components/register/FormRegister.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

// stores
import { useRegisterStore } from '../stores/register';

export default defineComponent({
  name: 'RegisterPage',
  components: {
    EmailConfirmation,
    FormRegister,
    LoginRegisterHeader,
  },
  setup() {
    const registerStore = useRegisterStore();
    const isAwaitingConfirmation = computed(
      () => registerStore.getIsAwaitingConfirmation,
    );

    return {
      isAwaitingConfirmation,
    };
  },
});
</script>

<template>
  <q-page padding>
    <div class="q-px-lg">
      <!-- Page header -->
      <login-register-header data-cy="login-register-header" />

      <div class="row">
        <div class="col-12 col-md-4">
          <email-confirmation v-if="isAwaitingConfirmation" />
          <form-register v-else />
        </div>
      </div>
    </div>
  </q-page>
</template>
