qq# Ride to work by bike frontend (ride-to-work-by-bike)

A Ride to work by bike web app is based on the [Quasar framework](https://quasar.dev/)
([Vue.js version 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/),
[TOML](https://toml.io)).

Tested with Node.js [LTS Hydrogen](https://nodejs.org/en/download/releases) version.

Installing and activating Node Version Manager `nvm`:

Installing `nvm`:

```bash
export NVM_DIR="$HOME/.nvm" && (
  git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
  cd "$NVM_DIR"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
) && \. "$NVM_DIR/nvm.sh"
```

Activating `nvm`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Using `nvm`:

```bash
nmv list
nvm install lts/hydrogen
nmv use lts/hydrogen
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
npx qusar dev
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

```bash
# Component tests

# component tests with default Electron web browser
npx cypress run --component
# or test only one test
npx cypress run --component -s src/components/__tests__/CardOffer.cy.js
# or
npx cypress open --component

# component tests with Mozilla Firefox web browser
npx cypress run --component --browser $(which firefox-bin)
# or test only one test
npx cypress run --component --browser $(which firefox-bin) -s src/components/__tests__/CardOffer.cy.js
# or
npx cypress open --browser $(which firefox-bin)

# E2e tests

# e2e and unit tests with default Electron web browser
npx cypress run --e2e
# or
npx cypress open --e2e

# e2e and unit tests with Mozilla Firefox web browser
npx cypress run --e2e --browser $(which firefox-bin)
# or
npx cypress open --browser $(which firefox-bin)
```

### Build the app for production

Adjust app config via [TOML](https://toml.io/en/) config file `ride_to_work_by_bike_config.toml` or
via SHELL/ENV variables (check vars with `cat ./src/utils/get_app_conf.js`).

Build app with

```bash
npx quasar build
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
