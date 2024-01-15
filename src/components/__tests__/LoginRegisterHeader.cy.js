import { colors } from 'quasar';

import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');

describe('<LoginRegisterHeader>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['siteTitle'], 'header', i18n);
    cy.testLanguageStringsInContext(['logoAltText'], 'index', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterHeader, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders logo', () => {
      cy.dataCy('logo')
        .should('be.visible')
        .invoke('height')
        .should('be.equal', 80);
    });

    it('renders help button', () => {
      cy.dataCy('button-help')
        .should('be.visible')
        .and('have.css', 'font-size', '13px')
        .and('have.css', 'font-weight', '500')
        .and('have.backgroundColor', primary)
        .and('have.css', 'border-radius', '50%'); // round
      cy.dataCy('button-help').should('contain', 'question_mark');
    });

    it('renders help button with correct size', () => {
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('button-help').invoke('height').should('be.equal', 39);
      cy.dataCy('button-help').invoke('width').should('be.equal', 39);
    });

    it('allows user to display help dialog and read all FAQ items', () => {
      cy.dataCy('button-help').last().should('be.visible').click();
      cy.dataCy('dialog-header').should('be.visible');
      cy.dataCy('list-faq-list')
        .find('.q-card')
        .each(($element) => {
          cy.wrap($element).should('not.be.visible');
        });
      cy.dataCy('list-faq-list')
        .find('.q-expansion-item')
        .each(($element) => {
          cy.wrap($element).should('be.visible');
          cy.wrap($element).click();
          cy.wrap($element)
            .find('.q-card__section')
            .should('be.visible')
            .and('not.be.empty');
        });
    });

    it('allows user to display and submit contact form', () => {
      cy.dataCy('button-help').last().should('be.visible').click();
      cy.dataCy('dialog-header').should('be.visible');
      cy.dataCy('dialog-content').scrollTo(0, 1200);
      cy.dataCy('button-contact').should('be.visible').click();
      cy.dataCy('dialog-header').find('h3').should('be.visible');
      cy.dataCy('contact-form-subject-input')
        .should('be.visible')
        .type('question');
      cy.dataCy('contact-form-message-input')
        .should('be.visible')
        .type('what is the minimum distance to ride to work?');
      cy.dataCy('contact-form-email')
        .find('input')
        .should('be.visible')
        .type('P7LlQ@example.com');
      cy.dataCy('contact-form-submit').should('be.visible').click();
      // TODO: test successful submission
    });

    it('validates contact form if there are errors', () => {
      cy.dataCy('button-help').last().should('be.visible').click();
      cy.dataCy('dialog-header').should('be.visible');
      cy.dataCy('dialog-content').scrollTo(0, 1200);
      cy.dataCy('button-contact').should('be.visible').click();
      cy.dataCy('dialog-header').find('h3').should('be.visible');
      cy.dataCy('dialog-content').scrollTo('bottom');
      cy.dataCy('contact-form-submit').should('be.visible').click();
      cy.dataCy('contact-form-subject')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('index.contact.subjectRequired'));
      cy.dataCy('contact-form-subject')
        .find('.q-field__control')
        .should('have.class', 'text-negative');
      cy.dataCy('dialog-content').scrollTo('top');
      cy.dataCy('contact-form-subject-input')
        .should('be.visible')
        .type('question');
      cy.dataCy('contact-form-subject-input').blur();
      cy.dataCy('contact-form-subject')
        .find('.q-field__messages')
        .should('be.empty');
      cy.dataCy('contact-form-subject')
        .find('.q-field__control')
        .should('not.have.class', 'text-negative');
      cy.dataCy('dialog-content').scrollTo('bottom');
      cy.dataCy('contact-form-submit').should('be.visible').click();
      cy.dataCy('dialog-content').scrollTo('top');
      cy.dataCy('contact-form-message')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('index.contact.messageRequired'));
      cy.dataCy('contact-form-message')
        .find('.q-field__control')
        .should('have.class', 'text-negative');
      cy.dataCy('contact-form-message-input')
        .should('be.visible')
        .type('what is the minimum distance to ride to work?');
      cy.dataCy('dialog-content').scrollTo('bottom');
      cy.dataCy('contact-form-submit').should('be.visible').click();
      cy.dataCy('contact-form-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelEmail'),
          }),
        );
      cy.dataCy('contact-form-email')
        .find('.q-field__control')
        .should('have.class', 'text-negative');
    });
    // Switching language can only be tested in E2E
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterHeader, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
