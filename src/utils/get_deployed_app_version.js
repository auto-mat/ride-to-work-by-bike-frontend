/* eslint-disable @typescript-eslint/no-require-imports */
const { parse } = require('toml');
const { existsSync, readFileSync } = require('fs-extra');

const getDeployedAppVersion = () => {
  const deployed_app_version_file = './deployed_app_version.toml';
  let config = { version: '' };
  if (existsSync(deployed_app_version_file)) {
    config = parse(readFileSync(deployed_app_version_file).toString());
  }
  return config;
};

module.exports.getDeployedAppVersion = getDeployedAppVersion;
