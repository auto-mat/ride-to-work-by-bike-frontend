/**
 * Get logged user notify message config
 *
 * @param {string | number | boolean | null} message - Notify translated message
 * @returns {object} - Notify config object
 */
const getLoggedUserNotifyMessageConf = (message: string): object => ({
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
