import { getString } from 'src/utils';

describe('Unit Test Application Code', function () {
  before(() => {
    // check if the import worked correctly
    expect(getString, 'getString').to.be.a('function');
  });
  context('src/utils/utils.js', () => {
    it('get string', function () {
      const str = 'Test text';
      expect(getString(str)).to.eq(str);
    });
  });
});

describe('Component Boilerplate function', function () {
  const componentName = 'TestComponent';
  const componentOutputDir = 'global';
  const importPath = `components/${componentOutputDir}/${componentName}`;
  const componentsDir = 'src/components';

  before(() => {
    // Pre-test setup to ensure a clean state and run the script
    cy.exec(
      `npx tsc src/utils/create_component_file/index.ts && node src/utils/create_component_file/index.js ${componentName} ${componentOutputDir}`,
    );
  });

  after(() => {
    // Cleanup the created files using a Node.js task
    cy.task(
      'deleteFile',
      `${componentsDir}/${componentOutputDir}/${componentName}.vue`,
    );
    cy.task('deleteFile', `${componentsDir}/__tests__/${componentName}.cy.js`);
  });

  it('should create a Vue file in the specified directory', () => {
    // Check that file exists
    cy.task(
      'fileExists',
      `${componentsDir}/${componentOutputDir}/${componentName}.vue`,
    ).then((exists) => {
      expect(exists).to.be.true;
    });
  });

  it('should create a Cypress test file in the correct directory', () => {
    // Check that file exists
    cy.task(
      'fileExists',
      `${componentsDir}/__tests__/${componentName}.cy.js`,
    ).then((exists) => {
      expect(exists).to.be.true;
    });
  });

  it('should create a Vue file with correct content', () => {
    cy.task(
      'readFile',
      'src/utils/create_component_file/templates/template_component.txt',
    ).then((componentTemplate) => {
      const vueFilePath = `${componentsDir}/${componentOutputDir}/${componentName}.vue`;
      // Read the .cy.js file
      cy.task('readFile', vueFilePath).then((content) => {
        // Check if the file contains the correct content
        const componentContent = componentTemplate.replace(
          /COMPONENT_NAME/g,
          componentName,
        );
        expect(content).to.eq(componentContent);
      });
    });
  });

  it('should create a Cypress test file with correct content', () => {
    cy.task(
      'readFile',
      'src/utils/create_component_file/templates/template_test.txt',
    ).then((testTemplate) => {
      const testFilePath = `src/components/__tests__/${componentName}.cy.js`;
      // Read the .cy.js file
      cy.task('readFile', testFilePath).then((content) => {
        // Check if the file contains the correct content
        const testContent = testTemplate
          .replace(/COMPONENT_NAME/g, componentName)
          .replace(/IMPORT_PATH/g, importPath);
        expect(content).to.eq(testContent);
      });
    });
  });
});
