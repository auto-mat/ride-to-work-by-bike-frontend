import { markRaw } from 'vue';
import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { useLoginStore } from '../stores/login';
import { useChallengeStore } from '../stores/challenge';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

/**
 * Pinia integration for Quasar.
 *
 * Uses Pinia Persisted State Plugin.
 * Make store persistent by adding:
 * persist: true,
 * @see https://github.com/prazdevs/pinia-plugin-persistedstate
 *
 * Persisted State note:
 * - References are not persisted due to serialization.
 * - Date is persisted as string.
 * @see https://prazdevs.github.io/pinia-plugin-persistedstate/guide/limitations.html
 */

export default boot(({ app, router }) => {
  const pinia = createPinia();
  // plugins
  pinia.use(piniaPluginPersistedstate);
  // make logger available in stores
  pinia.use(({ store }) => {
    store.$log = markRaw(app.config.globalProperties.$log);
    store.$router = markRaw(router);
  });
  app.use(pinia);

  // refresh access token on each reload (as it is not persisted)
  const loginStore = useLoginStore();
  if (loginStore.refreshToken) {
    loginStore.refreshTokens();
  }

  // refresh phase set on each reload
  const challengeStore = useChallengeStore();
  challengeStore.loadPhaseSet();
});
