#!/bin/bash

# Function to ensure the directory exists
ensure_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
  fi
}

# Determine the folder structure based on the optional second parameter
FOLDER_PATH=${2:-"."} # Default to current directory if no folder is provided

# Ensure the component and tests directories exist
ensure_dir "/src/components/$FOLDER_PATH"

if [ "$FOLDER_PATH" = "." ]; then
  IMPORT_PATH="components/$1"
else
  IMPORT_PATH="components/$FOLDER_PATH/$1"
fi

# Boilerplate for .vue file
VUE_TEMPLATE='<script lang='ts'>
/**
* '$1' Component
*
* @description * Use this component to ... .
* You can adjust its appearance by ... .
*
* @props
* - `NAME` (TYPE, required): The object representing ... .
*   It should be of type `TYPE`.
*
* @events
* - `update:modelValue`: Emitted as a part of v-model structure.
*
* @slots
* - `content`: For ... .
*   exposed props and methods:
*     - `state`
*
* @components
* - `CHILD`: Component to ... .
*
* @example
* <'$1'></'$1'>
*
* @see [Figma Design](...)
*/

import { defineComponent } from "vue";

export default defineComponent({
  name: "'$1'",
})
</script>

<template>
  <div>

  </div>
</template>
'

# Boilerplate for .cy.js file
CY_JS_TEMPLATE='import '$1' from "'$IMPORT_PATH'.vue";
import { i18n } from "../../boot/i18n";

describe("<'$1'>", () => {
  it("has translation for all strings", () => {
    cy.testLanguageStringsInContext([], "index.component", i18n);
  });

  context("desktop", () => {
    beforeEach(() => {
      cy.mount('$1', {
        props: {},
      });
      cy.viewport("macbook-16");
    });

    coreTests();
  });

  context("mobile", () => {
    beforeEach(() => {
      cy.mount('$1', {
        props: {},
      });
      cy.viewport("iphone-6");
    });

    coreTests();
  });
});

function coreTests() {
  it("renders component", () => {
    cy.dataCy("component").should("be.visible");
  });
}
'

# Check if component name is provided
if [ -z "$1" ]; then
  echo "You must provide a component name."
  exit 1
fi

# Create .vue file
echo "$VUE_TEMPLATE" > "./src/components/$FOLDER_PATH/$1.vue"

# Create .cy.js file
echo "$CY_JS_TEMPLATE" > "./src/components/__tests__/$1.cy.js"

echo "Component $1 created successfully."
