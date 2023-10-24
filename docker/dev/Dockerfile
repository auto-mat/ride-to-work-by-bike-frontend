FROM alpine:3.18

LABEL authors="Auto*Mat, z. s. auto-mat@auto-mat.cz"
LABEL maintainer="Auto*Mat, z. s. auto-mat@auto-mat.cz"

ARG UID
ENV APP_USER=dev
ENV APP_PATH=/home/$APP_USER/ride-to-work-by-bike-app
RUN apk add --update --no-cache nodejs-current yarn \
    && yarn global add @quasar/cli npx \
    && adduser $APP_USER -u $UID -S
# Create the directories we will need
RUN mkdir $APP_PATH
WORKDIR $APP_PATH
USER $APP_USER
