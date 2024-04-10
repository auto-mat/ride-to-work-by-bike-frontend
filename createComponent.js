const fs = require('fs');
const path = require('path');

// Function to ensure the directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Process arguments
const componentName = process.argv[2];
const folderPath = process.argv[3] || '.';

// Check if component name is provided
if (!componentName) {
  console.log('You must provide a component name.');
  process.exit(1);
}

// Determine the import path
let importPath = `components/${
  folderPath === '.' ? '' : folderPath + '/'
}${componentName}`;

// Ensure the component and tests directories exist
ensureDir(path.join(__dirname, `src/components/${folderPath}`));
ensureDir(path.join(__dirname, 'src/components/__tests__'));

// Boilerplate for .vue file
const vueTemplate = `<script lang='ts'>
/**
* ${componentName} Component
*
* @description * Use this component to ... .
* You can adjust its appearance by ... .
*
* @props
* - \`NAME\` (TYPE, required): The object representing ... .
*   It should be of type \`TYPE\`.
*
* @events
* - \`update:modelValue\`: Emitted as a part of v-model structure.
*
* @slots
* - \`content\`: For ... .
*   exposed props and methods:
*     - \`state\`
*
* @components
* - \`CHILD\`: Component to ... .
*
* @example
* <${componentName}></${componentName}>
*
* @see [Figma Design](...)
*/

import { defineComponent } from 'vue';

export default defineComponent({
  name: '${componentName}',
})
</script>

<template>
  <div>

  </div>
</template>
`;

// Boilerplate for .cy.js file
const cyJsTemplate = `import ${componentName} from '${importPath}.vue';
import { i18n } from '../../boot/i18n';

describe('<${componentName}>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(${componentName}, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(${componentName}, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('component').should('be.visible');
  });
}
`;

// Create .vue and .cy.js files
fs.writeFileSync(
  path.join(__dirname, `src/components/${folderPath}/${componentName}.vue`),
  vueTemplate,
);
fs.writeFileSync(
  path.join(__dirname, `src/components/__tests__/${componentName}.cy.js`),
  cyJsTemplate,
);

console.log(`Component ${componentName} created successfully.`);
