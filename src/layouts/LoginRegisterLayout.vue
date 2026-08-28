<script lang="ts">
/**
 * LoginRegisterLayout Component
 *
 * The `LoginRegisterLayout` renders a simple template for login/registration.
 *
 * @description
 * This component is used as a wrapper for login and registration pages.
 * It does not render sidebar, header, or footer.
 *
 * @usage
 * This layout is currently used by the following pages:
 * - LoginPage
 * - RegisterPage
 *
 * To utilize this layout in a page, specify it in the route configuration:
 * ```javascript
 * // routes.ts
 * {
 *   path: '/login',
 *   component: () => import('layouts/LoginRegisterLayout.vue'),
 *   children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
 * },
 * ```
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6269%3A24768&mode=dev)
 */

// libraries
import { Notify } from 'quasar';
import { computed, defineComponent, watch } from 'vue';
import { i18n } from '../boot/i18n';
import { rideToWorkByBikeConfig } from '../boot/global_vars';

import { useLoginStore } from 'src/stores/login';
import { getLoggedUserNotifyMessageConf } from '../utils/notify';

// set global i18n object (for test purposes)
if (window.Cypress) {
  window.i18n = i18n;
}

export default defineComponent({
  name: 'LoginLayout',
  setup() {
    const imageMask = `url(${new URL('../assets/svg/image-mask.svg', import.meta.url).href})`;
    const imageUrl = rideToWorkByBikeConfig.urlLoginRegisterBackgroundImage;

    const loginStore = useLoginStore();
    if (loginStore.getShowLoggedUserNotifyMessage) {
      const loggedUser = loginStore.getUser;
      let user;
      if (loggedUser.first_name && loggedUser.last_name) {
        user = `${loggedUser.first_name} ${loggedUser.last_name}, ${loggedUser.email}`;
      } else {
        user = loggedUser.email;
      }
      const message = computed(() =>
        i18n.global.t('login.showLoggedUserNotifyMessage', {
          user: user,
        }),
      );
      const dismissMessage = Notify.create(
        getLoggedUserNotifyMessageConf(message),
      );
      watch(
        () => loginStore.getShowLoggedUserNotifyMessage,
        () => {
          if (!loginStore.getShowLoggedUserNotifyMessage) {
            dismissMessage();
          }
        },
      );
    }
    return {
      imageMask,
      imageUrl,
    };
  },
});
</script>

<template>
  <q-layout class="bg-primary" view="hHh lpR fFf">
    <!-- Background image -->
    <div
      v-if="$q.screen.gt.sm"
      class="fixed-top-right"
      :style="{ width: `60vw`, height: `100vh`, isolation: 'isolate' }"
    >
      <q-img
        fit="cover"
        position="50% 100%"
        ratio="0.85"
        :src="imageUrl"
        :img-style="{
          maskImage: imageMask,
          maskRepeat: 'no-repeat',
          maskSize: 'cover',
        }"
        data-cy="layout-background-image"
      />
    </div>
    <q-page-container style="isolation: isolate">
      <!-- Page content -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>
