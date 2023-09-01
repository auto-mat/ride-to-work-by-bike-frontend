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
  } else if (process.env.IMAGE) {
    config['image'] = process.env.IMAGE;
  } else if (process.env.WIDTH) {
    config['width'] = process.env.WIDTH;
  } else if (process.env.TITLE) {
    config['title'] = process.env.TITLE;
  } else if (process.env.SUBTITLE) {
    config['subtitle'] = process.env.SUBTITLE;
  } else if (process.env.BORDER_RADIUS_CARD) {
    config['borderRadiusCard'] = 'test';
  }

  return config;
};

module.exports.getAppConfig = getAppConfig;
