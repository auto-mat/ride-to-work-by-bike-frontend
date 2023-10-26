#!/usr/bin/env bash
#
# Run/open Cypress component/e2e tests with different web browsers.

# Args from the position 2 to the last item
ARGS_FROM_POS_2_TO_LAST="${@:2:$#}"

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
FIREFOX=$(which firefox || which firefox-bin || echo "firefox")
CHROME=$(which google-chrome-stable \
  || which google-chrome-beta \
  || which google-chrome-unstable \
  || echo "chrome")
EDGE=$(which microsoft-edge-stable \
  || which microsoft-edge-stable-beta \
  || which microsoft-edge-stable-dev \
  || echo "edge")


case $1 in
  "component:electron") $CYPRESS_COMPONENT_TEST $ELECTRON $ARGS_FROM_POS_2_TO_LAST ;;
  "component:firefox") $CYPRESS_COMPONENT_TEST $FIREFOX $ARGS_FROM_POS_2_TO_LAST ;;
  "component:chrome") $CYPRESS_COMPONENT_TEST $CHROME $ARGS_FROM_POS_2_TO_LAST ;;
  "component:edge") $CYPRESS_COMPONENT_TEST $EDGE $ARGS_FROM_POS_2_TO_LAST ;;
  "component:open:electron") $CYPRESS_COMPONENT_OPEN_TEST $ELECTRON $ARGS_FROM_POS_2_TO_LAST ;;
  "component:open:firefox") $CYPRESS_COMPONENT_OPEN_TEST $FIREFOX $ARGS_FROM_POS_2_TO_LAST ;;
  "component:open:chrome") $CYPRESS_COMPONENT_OPEN_TEST $CHROME $ARGS_FROM_POS_2_TO_LAST ;;
  "component:open:edge") $CYPRESS_COMPONENT_OPEN_TEST $EDGE $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:electron") $CYPRESS_E2E_TEST $ELECTRON $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:firefox") $CYPRESS_E2E_TEST $FIREFOX $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:chrome") $CYPRESS_E2E_TEST $CHROME $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:edge") $CYPRESS_E2E_TEST $EDGE $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:open:electron") $CYPRESS_E2E_OPEN_TEST $ELECTRON $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:open:firefox") $CYPRESS_E2E_OPEN_TEST $FIREFOX $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:open:chrome") $CYPRESS_E2E_OPEN_TEST $CHROME $ARGS_FROM_POS_2_TO_LAST ;;
  "e2e:open:edge") $CYPRESS_E2E_OPEN_TEST $EDGE $ARGS_FROM_POS_2_TO_LAST ;;
  *) error "Unexpected option ${1}";;
esac
