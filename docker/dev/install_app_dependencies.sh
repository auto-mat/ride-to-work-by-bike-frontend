#!/usr/bin/env sh
#
# Install app JS lib dependencies


if [ -d "./node_modules" ]; then
    npx husky install
    npx cypress install
else
    yarn
fi
