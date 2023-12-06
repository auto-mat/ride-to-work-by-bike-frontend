import FormFieldEmailTest from 'components/global/FormFieldEmailTest.vue';
import { i18n } from '../../boot/i18n';

describe('<FormFieldEmail>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['messageEmailInvalid', 'messageFieldRequired'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldEmailTest);
      cy.viewport('macbook-16');
    });

    it('validates email correctly', () => {
      // invalid email
      cy.dataCy('form-email-input').type('qw123@qw');
      cy.dataCy('form-email-input').blur();
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type('abc.example.com');
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type('a@b@c@example.com');
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type('a"b(c)d,e:f;g<h>i[jk]l@example.com');
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type('just"not"right@example.com');
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type('this is"notallowed@example.com');
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type('this still"not\\allowed@example.com');
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type(
        '1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
      );
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // invalid email
      cy.dataCy('form-email-input').type(
        'i.like.underscores@but_they_are_not_allowed_in_this_part',
      );
      cy.dataCy('form-email')
        .find('.q-field__messages')
        .and('contain', i18n.global.t('form.messageEmailInvalid'));
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('simple@example.com');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('very.common@example.com');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('x@example.com');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type(
        'long.email-address-with-hyphens@and.subdomains.example.com',
      );
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('user.name+tag+sorting@example.com');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('name/surname@example.com');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('mailhost!username@example.org');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('user%example.com@example.org');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
      // valid email
      cy.dataCy('form-email-input').type('user-@example.org');
      cy.get(
        '*[data-cy="form-email"] .q-field__messages [role="alert"]',
      ).should('not.exist');
      cy.dataCy('form-email-input').clear();
    });
  });
});
