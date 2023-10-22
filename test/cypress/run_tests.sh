#!/usr/bin/env bash
#
# Run/open Cypress component/e2e tests with different web browsers.


# Cypress
CYPRESS_BASE_CMD="npx cypress"
COMPONENT_FLAG="--component --browser"
E2E_FLAG="--e2e --browser"
CYPRESS_COMPONENT_TEST="$CYPRESS_BASE_CMD run $COMPONENT_FLAG"
CYPRESS_COMPONENT_OPEN_TEST="$CYPRESS_BASE_CMD open $COMPONENT_FLAG"
CYPRESS_E2E_TEST="$CYPRESS_BASE_CMD run $E2E_FLAG"
CYPRESS_E2E_OPEN_TEST="$CYPRESS_BASE_CMD open $E2E_FLAG"

# Web browsers
ELECTRON="electron"
FIREFOX=$(which firefox || which firefox-bin)
CHROME=$(which google-chrome-stable \
  || which google-chrome-beta \
  || which google-chrome-unstable)
EDGE=$(which microsoft-edge-stable \
  || which microsoft-edge-stable-beta \
  || which microsoft-edge-stable-dev)


case $1 in
  "component:electron") $CYPRESS_COMPONENT_TEST $ELECTRON ;;
  "component:firefox") $CYPRESS_COMPONENT_TEST $FIREFOX ;;
  "component:chrome") $CYPRESS_COMPONENT_TEST $CHROME ;;
  "component:edge") $CYPRESS_COMPONENT_TEST $EDGE ;;
  "component:open:electron") $CYPRESS_COMPONENT_OPEN_TEST $ELECTRON ;;
  "component:open:firefox") $CYPRESS_COMPONENT_OPEN_TEST $FIREFOX ;;
  "component:open:chrome") $CYPRESS_COMPONENT_OPEN_TEST $CHROME ;;
  "component:open:edge") $CYPRESS_COMPONENT_OPEN_TEST $EDGE ;;
  "e2e:electron") $CYPRESS_E2E_TEST $ELECTRON ;;
  "e2e:firefox") $CYPRESS_E2E_TEST $FIREFOX ;;
  "e2e:chrome") $CYPRESS_E2E_TEST $CHROME ;;
  "e2e:edge") $CYPRESS_E2E_TEST $EDGE ;;
  "e2e:open:electron") $CYPRESS_E2E_OPEN_TEST $ELECTRON ;;
  "e2e:open:firefox") $CYPRESS_E2E_OPEN_TEST $FIREFOX ;;
  "e2e:open:chrome") $CYPRESS_E2E_OPEN_TEST $CHROME ;;
  "e2e:open:edge") $CYPRESS_E2E_OPEN_TEST $EDGE ;;
  *) error "Unexpected option ${1}";;
esac
