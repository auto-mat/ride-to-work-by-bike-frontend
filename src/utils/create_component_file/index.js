'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var path = require('path');
var template_component_1 = require('./templates/template_component');
var template_test_1 = require('./templates/template_test');
// Process arguments
var componentName = process.argv[2];
var folderPath = process.argv[3] || '.';
// Check if component name is provided
if (!componentName) {
  console.log('You must provide a component name.');
  process.exit(1);
}
// Determine the import path
var importPath = 'components/'
  .concat(folderPath === '.' ? '' : folderPath + '/')
  .concat(componentName);
// Ensure the component and tests directories exist
var projectRoot = process.cwd();
ensureDir(path.join(projectRoot, 'src/components/'.concat(folderPath)));
ensureDir(path.join(projectRoot, 'src/components/__tests__'));
var vueTemplate = template_component_1.default.replace(
  /ComponentName/g,
  componentName,
);
var cyJsTemplate = template_test_1.default
  .replace(/ComponentName/g, componentName)
  .replace(/ImportPath/g, importPath);
// Create .vue and .cy.js files
fs.writeFileSync(
  path.join(
    projectRoot,
    'src/components/'.concat(folderPath, '/').concat(componentName, '.vue'),
  ),
  vueTemplate,
);
fs.writeFileSync(
  path.join(
    projectRoot,
    'src/components/__tests__/'.concat(componentName, '.cy.js'),
  ),
  cyJsTemplate,
);
console.log('Component '.concat(componentName, ' created successfully.'));
// Function to ensure the directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
