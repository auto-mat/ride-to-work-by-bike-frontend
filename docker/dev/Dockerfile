FROM ubuntu:noble

LABEL authors="Auto*Mat, z. s. auto-mat@auto-mat.cz"
LABEL maintainer="Auto*Mat, z. s. auto-mat@auto-mat.cz"

ARG UID=1000
ARG GID=1000
ENV APP_USER=dev
ENV APP_PATH=/home/$APP_USER/ride-to-work-by-bike-app
ENV ADD_CUSTOM_PACKAGES_REPOSITORIES_SCRIPT_NAME=install_custom_packages.sh
ENV ADD_CUSTOM_PACKAGES_REPOSITORIES_SCRIPT_PATH=\
/usr/local/bin/$ADD_CUSTOM_PACKAGES_REPOSITORIES_SCRIPT_NAME
ENV NODEJS_MAJOR_VERSION=20
ENV CYPRESS_CACHE_ROOT_DIR=/nonexistent

COPY ./docker/dev/$ADD_CUSTOM_PACKAGES_REPOSITORIES_SCRIPT_NAME \
     $ADD_CUSTOM_PACKAGES_REPOSITORIES_SCRIPT_PATH
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    --no-install-suggests \
    apt-transport-https \
    ca-certificates \
    curl \
    git \
    gpg-agent \
    psmisc \
    software-properties-common \
    wget \
    xvfb \
    # Add custom packages repositories
    && chmod +x $ADD_CUSTOM_PACKAGES_REPOSITORIES_SCRIPT_PATH \
    && $ADD_CUSTOM_PACKAGES_REPOSITORIES_SCRIPT_PATH \
    && apt-get update -y \
    && apt-get install -y --no-install-recommends --no-install-suggests \
    nodejs \
    yarn \
    firefox \
    google-chrome-stable \
    microsoft-edge-stable \
    && apt clean \
    && yarn global add @quasar/cli npx \
    && deluser --remove-home ubuntu \
    && groupadd -g "${GID}" "${APP_USER}" \
    && adduser "${APP_USER}" --uid "${UID}" --gid "${GID}" --system \
    && mkdir -p "${CYPRESS_CACHE_ROOT_DIR}/.cache/Cypress" \
    && chown -R "${UID}":"${GID}" "${CYPRESS_CACHE_ROOT_DIR}"
# Create the directories we will need
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH
USER $APP_USER
