const { parse } = require('toml');
const { readFileSync } = require('fs');

const getAppConfig = (process) => {
  let config = parse(
    readFileSync('./ride_to_work_by_bike_config.toml').toString()
  );

  if (process.env.PRIMARY_COLOR) {
    config['primaryColor'] = process.env.PRIMARY_COLOR;
  } else if (process.env.COLOR_GRAY_LIGHT) {
    config['colorGrayLight'] = process.env.COLOR_GRAY_LIGHT;
  } else if (process.env.COLOR_GRAY_MIDDLE) {
    config['colorGrayMiddle'] = process.env.COLOR_GRAY_MIDDLE;
  } else if (process.env.IMAGE) {
    config['image'] = process.env.IMAGE;
  } else if (process.env.WIDTH) {
    config['width'] = process.env.WIDTH;
  } else if (process.env.TITLE) {
    config['title'] = process.env.TITLE;
  } else if (process.env.SUBTITLE) {
    config['subtitle'] = process.env.SUBTITLE;
  } else if (process.env.BORDER_RADIUS_CARD) {
    config['borderRadiusCard'] = process.env.BORDER_RADIUS_CARD;
  } else if (process.env.FACEBOOK_URL) {
    config['facebookUrl'] = process.env.FACEBOOK_URL;
  } else if (process.env.INSTAGRAM_URL) {
    config['instagramUrl'] = process.env.INSTAGRAM_URL;
  } else if (process.env.TWITTER_URL) {
    config['twitterUrl'] = process.env.TWITTER_URL;
  } else if (process.env.YOUTUBE_URL) {
    config['youtubeUrl'] = process.env.YOUTUBE_URL;
  }

  return config;
};

module.exports.getAppConfig = getAppConfig;
