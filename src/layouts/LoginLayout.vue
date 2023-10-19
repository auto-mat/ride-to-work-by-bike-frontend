<script lang="ts">
/**
 * LoginLayout Component
 *
 * The `LoginLayout` renders a simple template for login/registration.
 *
 * @description
 * This component is used as a wrapper for login and registration pages.
 * It does not render sidebar, header, or footer.
 *
 * @usage
 * This layout is currently used by the following pages:
 * - LoginPage
 *
 * To utilize this layout in a page, specify it in the route configuration:
 * ```javascript
 * // routes.ts
 * {
 *   path: '/login',
 *   component: () => import('layouts/LoginLayout.vue'),
 *   children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
 * },
 * ```
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6269%3A24768&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';
import { i18n } from 'src/boot/i18n';

// set global i18n object (for test purposes)
if (window.Cypress) {
  window.i18n = i18n;
}

export default defineComponent({
  name: 'LoginLayout',
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
