import { boot } from 'quasar/wrappers';
import vue3GoogleLogin from 'vue3-google-login';
import { rideToWorkByBikeConfig } from './global_vars';

const clientId = rideToWorkByBikeConfig.googleLoginAppId;

export default boot(({ app }) => {
  // Use the GoogleLoginPlugin with the provided client ID
  app.use(vue3GoogleLogin, {
    clientId,
  });
});
