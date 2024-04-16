'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Node.js script to generate new component files with boilerplate.
 * Usage: `yarn creat:component [componentName] [folderPath]`
 *
 * Args:
 *  - componentName: name of the component
 *  - folderPath: path of the src/components subfolder where the component
 *    will be created
 *
 * Creates:
 *  - .vue file in src/components/[folderPath] (if folderPath is provided)
 *  - .cy.js file for testing in src/components/__tests__
 */
var fs = require('fs');
var path = require('path');
var componentTemplate = fs.readFileSync(
  path.join(__dirname, './templates/template_component.txt'),
  'utf8',
);
var testTemplate = fs.readFileSync(
  path.join(__dirname, './templates/template_test.txt'),
  'utf8',
);
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
var vueTemplate = componentTemplate.replace(/COMPONENT_NAME/g, componentName);
var cyJsTemplate = testTemplate
  .replace(/COMPONENT_NAME/g, componentName)
  .replace(/IMPORT_PATH/g, importPath);
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
