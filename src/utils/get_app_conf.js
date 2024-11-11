/* eslint-disable @typescript-eslint/no-require-imports */
const { parse } = require('toml');
const { readFileSync } = require('fs-extra');

const getAppConfig = (process) => {
  let config = parse(
    readFileSync('./ride_to_work_by_bike_config.toml').toString(),
  );

  /*
   * Override global app config file variables values with global
   * ENV variables values
   *
   * Read global app config file variables names and convert them to theirs
   * globals ENV variables equivalents names
   *
   * e.g. 'colorPrimary' -> 'COLOR_PRIMARY'
   */

  Object.keys(config).forEach((globalConfigFileVarName) => {
    let globalEnvVarName = [];
    let sliceIndex = [0];
    for (let i = 0; i < globalConfigFileVarName.length; i++) {
      if (
        globalConfigFileVarName[i] ===
        globalConfigFileVarName[i].toLocaleUpperCase()
      ) {
        sliceIndex.push(i);
        if (sliceIndex.length === 2) {
          globalEnvVarName.push(
            globalConfigFileVarName
              .slice(sliceIndex[0], sliceIndex[1])
              .toLocaleUpperCase(),
          );
          // Delete first slice index
          sliceIndex = sliceIndex.slice(1);
        }
      }
      if (i === globalConfigFileVarName.length - 1)
        globalEnvVarName.push(
          globalConfigFileVarName.slice(sliceIndex[0]).toLocaleUpperCase(),
        );
    }
    globalEnvVarName = globalEnvVarName.join('_');

    if (process.env[globalEnvVarName]) {
      /*
       * Override global app config variables values
       *
       * e.g. config['colorPrimary'] = process.env['COLOR_PRIMARY']
       *
       */
      config[globalConfigFileVarName] = process.env[globalEnvVarName];
    }
  });
  if (process.env.NODE_ENV === 'development') console.log(config);
  return config;
};

module.exports.getAppConfig = getAppConfig;
