import VueContactForm from '../VueContactForm.vue';
import { i18n } from '../../boot/i18n';

describe('<VueContactForm>', () => {
  beforeEach(() => {
    cy.mount(VueContactForm, {});
  });

  it('has translation for all strings', () => {
    const translationStrings = [
      'subject',
      'subjectRequired',
      'message',
      'messageRequired',
      'file',
      'email',
      'emailRequired',
      'submit',
    ];

    const translationKeyList = translationStrings.map(
      (item) => `index.contact.${item}`
    );

    translationKeyList.forEach((translationKey) => {
      const defaultEnglishString = i18n.global.t(translationKey, 'en');

      const locales = i18n.global.availableLocales;
      locales
        .filter((locale) => locale !== 'en')
        .forEach((locale) => {
          i18n.global.locale = locale;
          const translatedString = i18n.global.t(translationKey);

          cy.wrap(translatedString)
            .should('be.a', 'string')
            .and('not.equal', defaultEnglishString);
        });
    });
  });

  it('should render contact-form-subject field', () => {
    cy.dataCy('contact-form-subject')
      .should('be.visible')
      .find('label[for="contact-form-subject"]')
      .should('be.visible')
      .should('have.text', i18n.global.t('index.contact.subject'));

    cy.dataCy('contact-form-subject')
      .find('.q-field__control')
      .should('be.visible')
      .should('have.css', 'border-radius', '8px');
  });

  it('should render contact-form-message field', () => {
    cy.dataCy('contact-form-message')
      .should('be.visible')
      .find('label[for="contact-form-message"]')
      .should('be.visible')
      .should('have.text', i18n.global.t('index.contact.message'));

    cy.dataCy('contact-form-message')
      .find('.q-field__control')
      .should('be.visible')
      .should('have.css', 'border-radius', '8px');
  });

  it('should render contact-form-file field', () => {
    cy.dataCy('contact-form-file')
      .find('i.q-icon')
      .should('be.visible')
      .should('contain', 'attachment');

    cy.dataCy('contact-form-file')
      .find('.q-field__label')
      .should('be.visible')
      .should('have.css', 'font-size', '14px')
      .should('have.color', '#000')
      .should('have.text', i18n.global.t('index.contact.file'));
  });

  it('should render contact-form-email field', () => {
    cy.dataCy('contact-form-email')
      .should('be.visible')
      .find('label[for="contact-form-email"]')
      .should('be.visible')
      .should('have.text', i18n.global.t('index.contact.email'));

    cy.dataCy('contact-form-email')
      .find('.q-field__control')
      .should('be.visible')
      .should('have.css', 'border-radius', '8px');
  });

  it('should render a submit button', () => {
    cy.dataCy('contact-form-submit')
      .should('be.visible')
      .should('have.css', 'border-radius', '28px')
      .should('have.backgroundColor', '#000')
      .should('have.text', i18n.global.t('index.contact.submit'));
  });
});
