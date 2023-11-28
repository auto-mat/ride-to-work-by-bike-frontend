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
 * - `FormRegister`: Component to render registration form.
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// components
import FormRegister from 'components/register/FormRegister.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'RegisterPage',
  components: {
    FormRegister,
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
          <form-register />
        </div>
      </div>
    </div>
  </q-page>
</template>
