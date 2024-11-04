/* eslint-disable @typescript-eslint/no-require-imports */
const { parse } = require('toml');
const { readFileSync } = require('fs-extra');

const getAppConfig = (process) => {
  let config = parse(
    readFileSync('./ride_to_work_by_bike_config.toml').toString(),
  );

  if (process.env.COLOR_PRIMARY) {
    config['primaryColor'] = process.env.COLOR_PRIMARY;
  } else if (process.env.COLOR_PRIMARY_DARK) {
    config['primaryColorDark'] = process.env.COLOR_PRIMARY_DARK;
  } else if (process.env.COLOR_PRIMARY_OPACITY) {
    config['colorPrimaryOpacity'] = process.env.COLOR_PRIMARY_OPACITY;
  } else if (process.env.COLOR_SECONDARY) {
    config['secondaryColor'] = process.env.COLOR_SECONDARY;
  } else if (process.env.COLOR_GRAY) {
    config['colorGray'] = process.env.COLOR_GRAY;
  } else if (process.env.COLOR_GRAY_LIGHT) {
    config['colorGrayLight'] = process.env.COLOR_GRAY_LIGHT;
  } else if (process.env.COLOR_GRAY_MIDDLE) {
    config['colorGrayMiddle'] = process.env.COLOR_GRAY_MIDDLE;
  } else if (process.env.COLOR_WHITE) {
    config['colorWhite'] = process.env.COLOR_WHITE;
  } else if (process.env.COLOR_BLACK) {
    config['colorBlack'] = process.env.COLOR_BLACK;
  } else if (process.env.COLOR_RED) {
    config['colorRed'] = process.env.COLOR_RED;
  } else if (process.env.COLOR_SECONDARY_BACKGROUND_OPACITY) {
    config['colorSecondaryBackgroundOpacity'] =
      process.env.COLOR_SECONDARY_BACKGROUND_OPACITY;
  } else if (process.env.COLOR_WHITE_BACKGROUND_OPACITY) {
    config['colorWhiteBackgroundOpacity'] =
      process.env.COLOR_WHITE_BACKGROUND_OPACITY;
  } else if (process.env.IMAGE) {
    config['image'] = process.env.IMAGE;
  } else if (process.env.WIDTH) {
    config['width'] = process.env.WIDTH;
  } else if (process.env.TITLE) {
    config['title'] = process.env.TITLE;
  } else if (process.env.SUBTITLE) {
    config['subtitle'] = process.env.SUBTITLE;
  } else if (process.env.BORDER_RADIUS_BUTTON_SMALL) {
    config['borderRadiusButtonSmall'] = process.env.BORDER_RADIUS_BUTTON_SMALL;
  } else if (process.env.BORDER_RADIUS_CARD) {
    config['borderRadiusCard'] = process.env.BORDER_RADIUS_CARD;
  } else if (process.env.BORDER_RADIUS_CARD_SMALL) {
    config['borderRadiusCardSmall'] = process.env.BORDER_RADIUS_CARD_SMALL;
  } else if (process.env.MAX_WIDTH_BANNER) {
    config['maxWidthBanner'] = process.env.MAX_WIDTH_BANNER;
  } else if (process.env.URL_AUTO_MAT) {
    config['urlAutoMat'] = process.env.URL_AUTO_MAT;
  } else if (process.env.URL_APP_STORE) {
    config['urlAppStore'] = process.env.URL_APP_STORE;
  } else if (process.env.URL_BLOG) {
    config['urlBlog'] = process.env.URL_BLOG;
  } else if (process.env.URL_FACEBOOK) {
    config['urlFacebook'] = process.env.URL_FACEBOOK;
  } else if (process.env.URL_GOOGLE_PLAY) {
    config['urlGooglePlay'] = process.env.URL_GOOGLE_PLAY;
  } else if (process.env.URL_INSTAGRAM) {
    config['urlInstagram'] = process.env.URL_INSTAGRAM;
  } else if (process.env.URL_TWITTER) {
    config['urlTwitter'] = process.env.URL_TWITTER;
  } else if (process.env.URL_VIDEO_LOGGING_ROUTES) {
    config['urlVideoLoggingRoutes'] = process.env.URL_VIDEO_LOGGING_ROUTES;
  } else if (process.env.URL_VIDEO_ONBOARDING) {
    config['urlVideoOnboarding'] = process.env.URL_VIDEO_ONBOARDING;
  } else if (process.env.FREE_SOFTWARE_DEFINITION) {
    config['freeSoftwareDefinitionUrl'] = process.env.FREE_SOFTWARE_DEFINITION;
  } else if (process.env.URL_YOUTUBE) {
    config['urlYoutube'] = process.env.URL_YOUTUBE;
  } else if (process.env.CHALLENGE_MONTH) {
    config['challengeMonth'] = process.env.CHALLENGE_MONTH;
  } else if (process.env.CHALLENGE_START_DATE) {
    config['challengeStartDate'] = process.env.CHALLENGE_START_DATE;
  } else if (process.env.CONTAINER_FORM_WIDTH) {
    config['containerFormWidth'] = process.env.CONTAINER_FORM_WIDTH;
  } else if (process.env.CONTAINER_CONTENT_WIDTH) {
    config['containerContentWidth'] = process.env.CONTAINER_CONTENT_WIDTH;
  } else if (process.env.CHALLENGE_LOGGING_WINDOW_DAYS) {
    config['challengeLoggingWindowDays'] =
      process.env.CHALLENGE_LOGGING_WINDOW_DAYS;
  } else if (process.env.DEFAULT_DISTANCE_ZERO) {
    config['defaultDistanceZero'] = process.env.DEFAULT_DISTANCE_ZERO;
  } else if (process.env.ENTRY_FEE_PAYMENT_MIN) {
    config['entryFeePaymentMin'] = process.env.ENTRY_FEE_PAYMENT_MIN;
  } else if (process.env.ENTRY_FEE_PAYMENT_MAX) {
    config['entryFeePaymentMax'] = process.env.ENTRY_FEE_PAYMENT_MAX;
  } else if (process.env.ENTRY_FEE_PAYMENT_OPTIONS) {
    config['entryFeePaymentOptions'] = process.env.ENTRY_FEE_PAYMENT_OPTIONS;
  } else if (process.env.NOTIFY_MESSAGE_POSITION) {
    config['notifyMessagePosition'] = process.env.NOTIFY_MESSAGE_POSITION;
  } else if (process.env.API_BASE) {
    config['apiBase'] = process.env.API_BASE;
  } else if (process.env.API_VERSION) {
    config['apiVersion'] = process.env.API_VERSION;
  } else if (process.env.API_DEFAULT_LANG) {
    config['apiDefaultLang'] = process.env.API_DEFAULT_LANG;
  } else if (process.env.URL_API_HAS_USER_VERIFIED_EMAIL) {
    config['urlApiHasUserVerifiedEmail'] =
      process.env.URL_API_HAS_USER_VERIFIED_EMAIL;
  } else if (process.env.URL_API_LOGIN) {
    config['urlApiLogin'] = process.env.URL_API_LOGIN;
  } else if (process.env.URL_API_ORGANIZATIONS) {
    config['urlApiOrganizations'] = process.env.URL_API_ORGANIZATIONS;
  } else if (process.env.URL_API_REFRESH) {
    config['urlApiRefresh'] = process.env.URL_API_REFRESH;
  } else if (process.env.URL_API_REGISTER) {
    config['urlApiRegister'] = process.env.URL_API_REGISTER;
  } else if (process.env.URL_API_REGISTER_COORDINATOR) {
    config['urlApiRegisterCoordinator'] =
      process.env.URL_API_REGISTER_COORDINATOR;
  } else if (process.env.URL_API_RESET_PASSWORD) {
    config['urlApiResetPassword'] = process.env.URL_API_RESET_PASSWORD;
  } else if (process.env.URL_LOGIN_REGISTER_BACKGROUND_IMAGE) {
    config['urlLoginRegisterBackgroundImage'] =
      process.env.URL_LOGIN_REGISTER_BACKGROUND_IMAGE;
  } else if (process.env.URL_RTWBB_LOGO) {
    config['urlRTWBBLogo'] = process.env.URL_RTWBB_LOGO;
  } else if (process.env.URL_API_CHALLENGE_REGISTRATION_USER) {
    config['urlApiChallengeRegistrationUser'] =
      process.env.URL_API_CHALLENGE_REGISTRATION_USER;
  } else if (process.env.CHECK_IS_EMAIL_VERIFIED_INTERVAL) {
    config['checkIsEmailVerifiedInterval'] =
      process.env.CHECK_IS_EMAIL_VERIFIED_INTERVAL;
  }
  return config;
};

module.exports.getAppConfig = getAppConfig;
