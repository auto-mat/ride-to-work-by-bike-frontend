const {
  getCyJsTemplate,
  getVueTemplate,
} = require('./create_component_templates');
const fs = require('fs');
const path = require('path');

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

const cyJsTemplate = getCyJsTemplate(componentName, importPath);
const vueTemplate = getVueTemplate(componentName);

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

// Function to ensure the directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
