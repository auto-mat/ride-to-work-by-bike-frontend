FROM alpine:3.20

LABEL authors="Auto*Mat, z. s. auto-mat@auto-mat.cz"
LABEL maintainer="Auto*Mat, z. s. auto-mat@auto-mat.cz"

ENV APP_PATH=/tmp/nginx/ride-to-work-by-bike-app \
    LOCAL_BIN=/usr/local/bin
RUN apk add --update --no-cache nginx nodejs yarn

# Create the directories we will need
RUN mkdir -p $APP_PATH /var/log/nginx /var/www/html

COPY ./docker/nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx_config/default.conf /etc/nginx/conf.d/default.conf

WORKDIR $APP_PATH

# Copy our source code into the container
COPY . .

# Install Quasar framework and build app
RUN yarn global add @quasar/cli npx; yarn; cp ./docker/run.sh "$LOCAL_BIN/"; \
    chmod +x "$LOCAL_BIN/run.sh";

ENTRYPOINT ["run.sh"]
