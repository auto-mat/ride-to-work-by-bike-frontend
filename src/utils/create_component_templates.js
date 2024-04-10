/**
 * Creates a boilerplate for .vue component file
 * @param {string} componentName
 * @returns {string} Vue template
 */
function getVueTemplate(componentName) {
  const template = `<script lang='ts'>
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

  return template;
}

/**
 * Creates a boilerplate for .cy.js test file
 * @param {string} componentName
 * @param {string} importPath path of the tested Vue component
 * @returns {string} Cypress test file template
 */
function getCyJsTemplate(componentName, importPath) {
  const template = `import ${componentName} from '${importPath}.vue';
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

  return template;
}

module.exports.getVueTemplate = getVueTemplate;
module.exports.getCyJsTemplate = getCyJsTemplate;
