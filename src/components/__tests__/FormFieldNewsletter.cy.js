import { nextTick, ref } from 'vue';
import FormFieldNewsletter from 'components/form/FormFieldNewsletter.vue';
import { i18n } from '../../boot/i18n';
import { NewsletterType } from '../../components/types/Newsletter';
import { vModelAdapter } from '../../../test/cypress/utils';

// selectors
const selectorNewsletterContainer = 'form-field-newsletter';
const selectorNewsletterLabel = 'newsletter-label';
const selectorNewsletterAll = 'newsletter-option-all';
const selectorNewsletterOptions = 'newsletter-options';
const selectorNewsletterOption = 'newsletter-option';

const model = ref([]);

describe('<FormFieldNewsletter>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleNewsletter',
        'labelNewsletterAll',
        'labelNewsletterChallenges',
        'labelNewsletterEvents',
        'labelNewsletterMobility',
      ],
      'form.personalDetails',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.mount(FormFieldNewsletter, {
        props: {
          ...vModelAdapter(model),
        },
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.mount(FormFieldNewsletter, {
        props: {
          ...vModelAdapter(model),
        },
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    model.value = [];
    nextTick();
    cy.dataCy(selectorNewsletterContainer).should('be.visible');
    cy.dataCy(selectorNewsletterLabel).should('be.visible');
    cy.dataCy(selectorNewsletterAll).should('be.visible');
    cy.dataCy(selectorNewsletterOptions).should('be.visible');
  });

  it('renders all newsletter options', () => {
    cy.dataCy(selectorNewsletterOption).should('have.length', 3);
  });

  it('updates v-model when options are selected', () => {
    model.value = [];
    nextTick();
    cy.dataCy(selectorNewsletterOption).eq(0).click();
    cy.wrap(model)
      .its('value')
      .should('deep.equal', [NewsletterType.challenge]);
  });

  it('selects all options when "all" is clicked', () => {
    model.value = [];
    nextTick();
    cy.dataCy(selectorNewsletterAll).click();
    cy.wrap(model).its('value').should('have.length', 3);
  });

  it('deselects all options when "all" is unclicked', () => {
    nextTick();
    model.value = [];
    cy.dataCy(selectorNewsletterOption).each(($el) => {
      cy.wrap($el).click();
    });
    nextTick();
    cy.wrap(model).its('value').should('have.length', 3);
    cy.dataCy(selectorNewsletterAll).click();
    nextTick();
    cy.wrap(model).its('value').should('have.length', 0);
  });

  it('selects "all" when all options are manually selected', () => {
    model.value = [];
    nextTick();
    cy.dataCy(selectorNewsletterOption).each(($el) => {
      cy.wrap($el).click();
    });
    cy.dataCy(selectorNewsletterAll).should('be.checked');
  });
}
