<script lang="ts">
/**
 * PrivacyPage Component
 *
 * The `PrivacyPage` renders the page with privacy policy rules.
 *
 * @description
 * This component is used to display privacy policy rules.
 *
 * @components
 * - `PrivacyRules`: Component to render privacy policy rules.
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 */

// libraries
import { defineComponent } from 'vue';

// components
import PrivacyRules from 'components/global/PrivacyRules.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'PrivacyPage',
  components: {
    LoginRegisterHeader,
    PrivacyRules,
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
          <privacy-rules />
        </div>
      </div>
    </div>
  </q-page>
</template>
