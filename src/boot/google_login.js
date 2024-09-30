import { boot } from 'quasar/wrappers';
import vue3GoogleLogin from 'vue3-google-login';

// Replace with your actual Google Client ID
const clientId = 'your-google-client-id';

export default boot(({ app }) => {
  // Use the GoogleLoginPlugin with the provided client ID
  app.use(vue3GoogleLogin, {
    clientId: clientId,
  });
});
