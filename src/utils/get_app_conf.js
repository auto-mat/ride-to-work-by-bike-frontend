const { parse } = require('toml');
const { readFileSync } = require('fs');

const getAppConfig = (process) => {
  let config = parse(
    readFileSync('./ride_to_work_by_bike_config.toml').toString(),
  );

  if (process.env.COLOR_PRIMARY) {
    config['primaryColor'] = process.env.COLOR_PRIMARY;
  } else if (process.env.COLOR_SECONDARY) {
    config['secondaryColor'] = process.env.COLOR_SECONDARY;
  } else if (process.env.COLOR_SECONDARY_OPACITY) {
    config['colorSecondaryOpacity'] = process.env.COLOR_SECONDARY_OPACITY;
  } else if (process.env.COLOR_GRAY_LIGHT) {
    config['colorGrayLight'] = process.env.COLOR_GRAY_LIGHT;
  } else if (process.env.COLOR_GRAY_MIDDLE) {
    config['colorGrayMiddle'] = process.env.COLOR_GRAY_MIDDLE;
  } else if (process.env.COLOR_WHITE) {
    config['colorWhite'] = process.env.COLOR_WHITE;
  } else if (process.env.COLOR_WHITE_OPACITY) {
    config['colorWhiteOpacity'] = process.env.COLOR_WHITE_OPACITY;
  } else if (process.env.COLOR_BLACK) {
    config['colorBlack'] = process.env.COLOR_BLACK;
  } else if (process.env.COLOR_RED) {
    config['colorRed'] = process.env.COLOR_RED;
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
  } else if (process.env.URL_FACEBOOK) {
    config['urlFacebook'] = process.env.URL_FACEBOOK;
  } else if (process.env.URL_INSTAGRAM) {
    config['urlInstagram'] = process.env.URL_INSTAGRAM;
  } else if (process.env.URL_TWITTER) {
    config['urlTwitter'] = process.env.URL_TWITTER;
  } else if (process.env.URL_YOUTUBE) {
    config['urlYoutube'] = process.env.URL_YOUTUBE;
  } else if (process.env.URL_APP_STORE) {
    config['urlAppStore'] = process.env.URL_APP_STORE;
  } else if (process.env.URL_GOOGLE_PLAY) {
    config['urlGooglePlay'] = process.env.URL_GOOGLE_PLAY;
  } else if (process.env.URL_VIDEO_LOGGING_ROUTES) {
    config['urlVideoLoggingRoutes'] = process.env.URL_VIDEO_LOGGING_ROUTES;
  } else if (process.env.URL_VIDEO_ONBOARDING) {
    config['urlVideoOnboarding'] = process.env.URL_VIDEO_ONBOARDING;
  } else if (process.env.CHALLENGE_MONTH) {
    config['challengeMonth'] = process.env.CHALLENGE_MONTH;
  } else if (process.env.CHALLENGE_START_DATE) {
    config['challengeStartDate'] = process.env.CHALLENGE_START_DATE;
  } else if (process.env.CONTAINER_WIDTH) {
    config['containerWidth'] = process.env.CONTAINER_WIDTH;
  }

  return config;
};

module.exports.getAppConfig = getAppConfig;
