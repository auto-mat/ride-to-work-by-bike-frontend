const fs = require('fs');
const path = require('path');
const { startDevServer } = require('@cypress/vite-dev-server');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (on) => {
  on('dev-server:start', (options) => {
    return startDevServer({
      options,
      viteConfig: {
        configFile: path.resolve(__dirname, '..', '..', '..', 'vite.config.js'),
      },
    });
  });
};

// Task to clean up created files after testing boilerplate script
module.exports = (on) => {
  on('task', {
    deleteFile(path) {
      return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
          if (err) reject(err);
          // return null to indicate Cypress task success
          else resolve(null);
        });
      });
    },
  });
};

// task to check the existence of a script-generated file
module.exports = (on) => {
  on('task', {
    fileExists(path) {
      return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (err) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    },
  });
};
