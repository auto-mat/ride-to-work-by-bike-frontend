/**
 * Node.js script to generate new component files with boilerplate.
 * Usage: `yarn creat:component [componentName] [dirPath]`
 *
 * Args:
 *  - componentName: name of the component
 *  - dirPath: path of the src/components subdir where the component
 *    will be created
 *
 * Creates:
 *  - .vue file in src/components/[dirPath] (if dirPath is provided)
 *  - .cy.js file for testing in src/components/__tests__
 */
import * as fs from 'fs';
import * as path from 'path';

const templatesDir = 'templates';
const componentsDir = 'src/components';

const componentTemplate = fs.readFileSync(
  path.join(__dirname, templatesDir, 'template_component.txt'),
  'utf8',
);
const testTemplate = fs.readFileSync(
  path.join(__dirname, templatesDir, 'template_test.txt'),
  'utf8',
);

// Process arguments
const componentName = process.argv[2];
const dirPath = process.argv[3] || '.';

// Check if component name is provided
if (!componentName) {
  console.log('You must provide a component name.');
  process.exit(1);
}

// Determine the import path
const importPath = `components/${
  dirPath === '.' ? '' : dirPath + '/'
}${componentName}`;

// Ensure the component and tests directories exist
const projectRoot = process.cwd();
ensureDir(path.join(projectRoot, `${componentsDir}/${dirPath}`));
ensureDir(path.join(projectRoot, `${componentsDir}/__tests__`));

const vueTemplate = componentTemplate.replace(/COMPONENT_NAME/g, componentName);
const cyJsTemplate = testTemplate
  .replace(/COMPONENT_NAME/g, componentName)
  .replace(/IMPORT_PATH/g, importPath);

// Create .vue and .cy.js files
fs.writeFileSync(
  path.join(projectRoot, componentsDir, `${dirPath}/${componentName}.vue`),
  vueTemplate,
);
fs.writeFileSync(
  path.join(projectRoot, componentsDir, `__tests__/${componentName}.cy.js`),
  cyJsTemplate,
);

console.log(`Component ${componentName} created successfully.`);

// Function to ensure the directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
