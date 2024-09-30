import { boot } from 'quasar/wrappers';

const facebookAppId = process.env.VUE_APP_FACEBOOK_APP_ID;

export default boot(() => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: facebookAppId, // Replace with your Facebook App ID
      cookie: true, // Enable cookies to allow the server to access the session
      xfbml: true, // Parse social plugins on this webpage
      version: 'v18.0', // Use the latest Facebook API version
    });

    // auto authenticate with the api if already logged in with facebook
    // ! uses accountService (see the translation of example logic)
    FB.getLoginStatus(({ authResponse }) => {
      if (authResponse) {
        accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
      } else {
        resolve();
      }
    });
  };

  // load facebook sdk script
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
});
