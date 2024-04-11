const fs = require('fs');
const path = require('path');
import componentTemplate from './templates/template_component';
import testTemplate from './templates/template_test';

// Process arguments
const componentName = process.argv[2];
const folderPath = process.argv[3] || '.';

// Check if component name is provided
if (!componentName) {
  console.log('You must provide a component name.');
  process.exit(1);
}

// Determine the import path
const importPath = `components/${
  folderPath === '.' ? '' : folderPath + '/'
}${componentName}`;

// Ensure the component and tests directories exist
const projectRoot = process.cwd();
ensureDir(path.join(projectRoot, `src/components/${folderPath}`));
ensureDir(path.join(projectRoot, 'src/components/__tests__'));

const vueTemplate = componentTemplate.replace(/COMPONENT_NAME/g, componentName);
const cyJsTemplate = testTemplate
  .replace(/COMPONENT_NAME/g, componentName)
  .replace(/IMPORT_PATH/g, importPath);

// Create .vue and .cy.js files
fs.writeFileSync(
  path.join(projectRoot, `src/components/${folderPath}/${componentName}.vue`),
  vueTemplate,
);
fs.writeFileSync(
  path.join(projectRoot, `src/components/__tests__/${componentName}.cy.js`),
  cyJsTemplate,
);

console.log(`Component ${componentName} created successfully.`);

// Function to ensure the directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
