import { colors } from 'quasar';
import ContactForm from '../ContactForm.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

describe('<ContactForm>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'subject',
        'subjectRequired',
        'message',
        'messageRequired',
        'file',
        'email',
        'emailRequired',
        'submit',
      ],
      'index.contact',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ContactForm, {});
    });

    it('should render contact-form-subject field', () => {
      cy.dataCy('contact-form-subject')
        .should('be.visible')
        .find('label[for="contact-form-subject"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('index.contact.subject'));
      cy.dataCy('contact-form-subject')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('should render contact-form-message field', () => {
      cy.dataCy('contact-form-message')
        .should('be.visible')
        .find('label[for="contact-form-message"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('index.contact.message'));
      cy.dataCy('contact-form-message')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('should render contact-form-file field', () => {
      cy.dataCy('contact-form-file')
        .find('i.q-icon')
        .should('be.visible')
        .and('contain', 'attachment');
      cy.dataCy('contact-form-file')
        .find('.q-field__label')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.color', black)
        .and('have.text', i18n.global.t('index.contact.file'));
    });

    it('should render contact-form-email field', () => {
      cy.dataCy('contact-form-email')
        .should('be.visible')
        .find('label[for="contact-form-email"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('index.contact.email'));
      cy.dataCy('contact-form-email')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('should render a submit button', () => {
      cy.dataCy('contact-form-submit')
        .should('be.visible')
        .and('have.css', 'border-radius', '28px')
        .and('have.backgroundColor', black)
        .and('have.text', i18n.global.t('index.contact.submit'));
    });
  });
});
