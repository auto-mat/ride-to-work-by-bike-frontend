# Ride to work by bike frontend (ride-to-work-by-bike)

A Ride to work by bike web app is based on the [Quasar framework](https://quasar.dev/)
([Vue.js version 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/),
[TOML](https://toml.io)).

Tested with Node.js [LTS Iron](https://nodejs.org/en/download/releases) version.

Installing and activating [Node Version Manager](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating) `nvm`:

Installing `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

Activating `nvm` (add these lines to your `~/.bashrc`, `~/.profile`, or `~/.zshrc` file):

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Using `nvm`:

```bash
nmv list
nvm install lts/iron
nmv use lts/iron
```

## Install the dependencies

Quasar framework CLI

```bash
yarn global add @quasar/cli npx
```

App dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

Adjust app config via [TOML](https://toml.io/en/) config file `ride_to_work_by_bike_config.toml` or
via SHELL/ENV variables (check vars with `cat ./src/utils/get_app_conf.js`).

App global vars defined inside config file `ride_to_work_by_bike_config.toml` are overrided
by SHELL/ENV vars (defined here `./src/utils/get_app_conf.js`).

When you add some app new global var inside config file `ride_to_work_by_bike_config.toml` you must
add correspoding SHELL/ENV var here `./src/utils/get_app_conf.js`.

And before create your PR (deploy to k8) you must add new/changed correspoding SHELL/ENV var here
[ride-to-work-by-bike-frontend-test.yaml](https://github.com/auto-mat/k8s/blob/master/manifests/config-maps/ride-to-work-by-bike-frontend-test.yaml#)
and here [ride-to-work-by-bike-frontend.lib.yaml](https://github.com/auto-mat/k8s/blob/master/manifests/ytt/lib/ride-to-work-by-bike-frontend.lib.yaml).

Start dev server with

```bash
yarn dev
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Run app tests

UNIX-like OS:

```bash
######################################################################
# Component tests
######################################################################

WEB_BROWSER="firefox" # other web browsers options are "electron", "chrome", "edge"
# Run component tests
yarn test:component:$WEB_BROWSER
# Or test only one component file tests
yarn test:component:$WEB_BROWSER -s ./src/components/__tests__/CardOffer.cy.js
# Or interactively open web browser and run tests
yarn test:component:open:$WEB_BROWSER

######################################################################
# E2e tests
######################################################################

# Start web dev server in another emulator terminal
yarn dev
# Inside another emulator terminal run tests
WEB_BROWSER="firefox" # other web browsers options are "electron", "chrome", "edge"
# Run e2e tests
yarn test:e2e:$WEB_BROWSER
# Or test only one e2e file tests
yarn test:e2e:$WEB_BROWSER -s ./test/cypress/e2e/home.spec.cy.js
# Or interactively open web browser and run tests
yarn test:e2e:open:$WEB_BROWSER
```

MS Windows OS:

```cmd
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Component tests
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

set WEB_BROWSER="firefox" :: other web browsers options are "electron", "chrome", "edge"
:: Run component tests
yarn test:component:win:%WEB_BROWSER%
:: Or test only one component file tests
yarn test:component:win:%WEB_BROWSER% -s \src\components\__tests__\CardOffer.cy.js
:: Or interactively open web browser and run tests
yarn test:component:open:win:%WEB_BROWSER%

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: E2e tests
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Start web dev server in another Command Prompt
yarn dev
:: Inside another Command Prompt run tests
set WEB_BROWSER="firefox" :: other web browsers options are "electron", "chrome", "edge"
:: Run e2e tests
yarn test:e2e:win:%WEB_BROWSER%
:: Or test only one e2e file tests
yarn test:e2e:win:%WEB_BROWSER% -s \test\cypress\e2e\home.spec.cy.js
:: Or interactively open web browser and run tests
yarn test:e2e:open:win:$WEB_BROWSER
```

### Build the app for production

Adjust app config via [TOML](https://toml.io/en/) config file `ride_to_work_by_bike_config.toml` or
via SHELL/ENV variables (check vars with `cat ./src/utils/get_app_conf.js`).

Build app with

```bash
yarn build
```

Copy content of the `dist/spa/*` dir into webserver Apache/NGINX dir.

### Deployed app

App is automatically deployed into k8 repository.

Open web app URL https://rtwbb-test.dopracenakole.net/ with your default browser.

```bash
# Open default web browser with URL https://rtwbb-test.dopracenakole.net/ from emulator terminal
test@test:~$ xdg-open https://rtwbb-test.dopracenakole.net
```

### Develoment app with build Docker image/container

```bash
APP_NAME=ride-to-work-by-bike-app
APP_DIR=/home/dev/$APP_NAME

# Build Docker image
docker buildx build --build-arg="UID=$(id -u)" -f ./docker/dev/Dockerfile .

# Run Docker app container
docker run -it --rm -e "PS1=\u@\h:\w$ " -p 9000:9000 -v $(pwd):$APP_DIR --name $APP_NAME <YOUR_BUILDED_DOCKER_IMAGE_ID>

# Or if you want override some Docker app container ENV variables (-e flag)
docker run -it --rm -e "PS1=\u@\h:\w$ " -e "PRIMARY_COLOR=red" -p 9000:9000 -v $(pwd):$APP_DIR --name $APP_NAME <YOUR_BUILDED_DOCKER_IMAGE_ID>

# Run quasar app dev server from emulator terminal
dev@61b150727994:~/ride-to-work-by-bike-app$ npx quasar dev

# Check web app from your host OS via web browser
# Open default web browser with URL http://localhost:9000 from host OS emulator terminal
test@test:~$ xdg-open http://localhost:9000
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### Licence

[GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html) or later.
