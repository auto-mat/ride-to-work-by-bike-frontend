// libraries
import type { Ref } from 'vue';

/**
 * Get logged user notify message config
 *
 * @param {Ref<string>} message - Notify translated message
 * @returns {object} - Notify config object
 */
const getLoggedUserNotifyMessageConf = (message: Ref<string>): object => ({
  message: message,
  timeout: 0,
  type: 'negative',
  actions: [
    {
      icon: 'close',
      color: 'white',
      round: true,
      handler: () => {},
    },
  ],
  attrs: {
    role: 'showUserNotifyMessage',
  },
});
export { getLoggedUserNotifyMessageConf };
