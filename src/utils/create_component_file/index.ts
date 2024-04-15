import * as fs from 'fs';
import * as path from 'path';

const componentTemplate = fs.readFileSync(
  path.join(__dirname, './templates/template_component'),
  'utf8',
);
const testTemplate = fs.readFileSync(
  path.join(__dirname, './templates/template_test'),
  'utf8',
);

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
