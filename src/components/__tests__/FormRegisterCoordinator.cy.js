import { colors } from 'quasar';

import FormRegisterCoordinator from 'components/register/FormRegisterCoordinator.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<FormRegisterCoordinator>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'title',
        'labelFirstName',
        'labelLastName',
        'labelJobTitle',
        'labelJobTitleShort',
        'labelEmail',
        'labelPhone',
        'labelPassword',
        'labelPasswordConfirm',
        'labelResponsibility',
        'labelTerms',
        'linkTerms',
        'buttonSubmit',
        'messageFieldRequired',
        'messageEmailInvalid',
        'messagePhoneInvalid',
        'messagePasswordStrong',
        'messagePasswordConfirmNotMatch',
        'hintPassword',
      ],
      'register.coordinator.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('register-coordinator-form-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', i18n.global.t('register.coordinator.form.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('register.coordinator.form.title'),
            );
          });
      });
    });

    it('renders first name field', () => {
      // input label
      cy.dataCy('form-register-coordinator-first-name')
        .should('be.visible')
        .find('label[for="form-register-coordinator-first-name"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelFirstName'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-first-name')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-first-name-input').should(
        'be.visible',
      );
    });

    it('renders last name field', () => {
      // input label
      cy.dataCy('form-register-coordinator-last-name')
        .should('be.visible')
        .find('label[for="form-register-coordinator-last-name"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelLastName'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-last-name')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-last-name-input').should(
        'be.visible',
      );
    });

    it('renders company field', () => {
      // input label
      cy.dataCy('form-register-coordinator-company')
        .should('be.visible')
        .find('label[for="form-register-coordinator-company"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelCompany'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-company')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-company-input').should('be.visible');
    });

    it('renders job title field', () => {
      // input label
      cy.dataCy('form-register-coordinator-job-title')
        .should('be.visible')
        .find('label[for="form-register-coordinator-job-title"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelJobTitle'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-job-title')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-job-title-input').should(
        'be.visible',
      );
    });

    it('renders email field', () => {
      // input label
      cy.dataCy('form-register-coordinator-email')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelEmail'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-email')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-email')
        .find('input')
        .should('be.visible');
    });

    it('renders phone field', () => {
      // input label
      cy.dataCy('form-register-coordinator-phone')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelPhone'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-phone')
        .find('input')
        .should('be.visible');
    });

    it('renders password field', () => {
      // input label
      cy.dataCy('form-register-coordinator-password')
        .should('be.visible')
        .find('label[for="form-register-coordinator-password"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelPassword'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-password')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-password-input').should(
        'be.visible',
      );
      // icon
      cy.dataCy('form-register-coordinator-password-icon')
        .should('contain', 'visibility')
        .and('have.color', colorPrimary);
      cy.dataCy('form-register-coordinator-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-coordinator-password-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders password confirm field', () => {
      // input label
      cy.dataCy('form-register-coordinator-password-confirm')
        .should('be.visible')
        .find('label[for="form-register-coordinator-password-confirm"]')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelPasswordConfirm'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-password-confirm')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-password-confirm-input').should(
        'be.visible',
      );
      // icon
      cy.dataCy('form-register-coordinator-password-confirm-icon')
        .should('contain', 'visibility')
        .and('have.color', colorPrimary);
      cy.dataCy('form-register-coordinator-password-confirm-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-coordinator-password-confirm-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders checkbox responsibility', () => {
      cy.dataCy('form-register-coordinator-responsibility')
        .should('be.visible')
        .find('.q-checkbox__label')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.labelResponsibility'),
        );
      // checkbox border
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox__bg')
        .should('have.css', 'border-radius', '4px');
      // checkbox height
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox__bg')
        .invoke('height')
        .should('be.equal', 18);
      // checkbox width
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox__bg')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders checkbox terms', () => {
      cy.dataCy('form-register-coordinator-terms')
        .should('be.visible')
        .find('.q-checkbox__label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('register.coordinator.form.labelTerms'));
      // checkbox border
      cy.dataCy('form-register-coordinator-terms')
        .find('.q-checkbox__bg')
        .should('have.css', 'border-radius', '4px');
      // checkbox height
      cy.dataCy('form-register-coordinator-terms')
        .find('.q-checkbox__bg')
        .invoke('height')
        .should('be.equal', 18);
      // checkbox width
      cy.dataCy('form-register-coordinator-terms')
        .find('.q-checkbox__bg')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('allows user to reveal and hide password', () => {
      testPasswordInputReveal({
        identifierPassword: 'form-register-coordinator-password',
      });
    });

    it('allows user to reveal and hide password confirm', () => {
      testPasswordInputReveal({
        identifierPassword: 'form-register-coordinator-password-confirm',
      });
    });

    it('validates company correctly', () => {
      // fill in other parts of the form to be able to test company
      cy.dataCy('form-register-coordinator-first-name-input').type('John');
      cy.dataCy('form-register-coordinator-last-name-input').type('Doe');
      // empty company
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-company')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.messageFieldRequired', {
            fieldName: i18n.global.t(
              'register.coordinator.form.labelCompanyShort',
            ),
          }),
        );
      cy.dataCy('form-register-coordinator-company').click();
      cy.get('.q-menu .q-item').first().click();
      cy.dataCy('form-register-coordinator-company')
        .find('.q-field__messages')
        .should('be.empty');
    });

    it('validates password correctly', () => {
      // fill in other parts of the form to be able to test password
      cy.dataCy('form-register-coordinator-first-name-input').type('John');
      cy.dataCy('form-register-coordinator-last-name-input').type('Doe');
      cy.dataCy('form-register-coordinator-company').click();
      cy.get('.q-menu .q-item').first().click();
      cy.dataCy('form-register-coordinator-job-title-input').type('IT');
      cy.dataCy('form-register-coordinator-email')
        .find('input')
        .type('simple@example.com');
      cy.dataCy('form-register-coordinator-phone')
        .find('input')
        .type('+420 736 456 789');
      // test password
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.coordinator.form.messageFieldRequired', {
            fieldName: i18n.global.t('register.coordinator.form.labelPassword'),
          }),
        );
      cy.dataCy('form-register-coordinator-password-input').clear();
      cy.dataCy('form-register-coordinator-password-input').type('12345');
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.coordinator.form.messagePasswordStrong'),
        );
      cy.dataCy('form-register-coordinator-password-input').clear();
      cy.dataCy('form-register-coordinator-password-input').type('123456789');
      cy.dataCy('form-register-coordinator-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.coordinator.form.messagePasswordStrong'),
        );
      cy.dataCy('form-register-coordinator-password-input').clear();
      cy.dataCy('form-register-coordinator-password-input').type('12345a');
      cy.dataCy('form-register-coordinator-password-input').blur();
      cy.dataCy('form-register-coordinator-password')
        .find('.q-field__messages')
        .should('contain', i18n.global.t('register.form.hintPassword'));
    });

    it('validates password confirm correctly', () => {
      // fill in other parts of the form to be able to test password
      cy.dataCy('form-register-coordinator-first-name-input').type('John');
      cy.dataCy('form-register-coordinator-last-name-input').type('Doe');
      cy.dataCy('form-register-coordinator-company').click();
      cy.get('.q-menu .q-item').first().click();
      cy.dataCy('form-register-coordinator-job-title-input').type('IT');
      cy.dataCy('form-register-coordinator-email')
        .find('input')
        .type('simple@example.com');
      cy.dataCy('form-register-coordinator-phone')
        .find('input')
        .type('+420 736 456 789');
      // fill in password input to be able to test password confirm
      cy.dataCy('form-register-coordinator-password-input').type('12345a');
      // test password confirm empty
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-password-confirm')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.coordinator.form.messageFieldRequired', {
            fieldName: i18n.global.t(
              'register.coordinator.form.labelPasswordConfirm',
            ),
          }),
        );
      cy.dataCy('form-register-coordinator-password-confirm-input').clear();
      // test password confirm not matching
      cy.dataCy('form-register-coordinator-password-confirm-input').type(
        '12345b',
      );
      cy.dataCy('form-register-coordinator-password-confirm-input').blur();
      cy.dataCy('form-register-coordinator-password-confirm')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t(
            'register.coordinator.form.messagePasswordConfirmNotMatch',
          ),
        );
      cy.dataCy('form-register-coordinator-password-confirm-input').clear();
      // test password confirm matching
      cy.dataCy('form-register-coordinator-password-confirm-input').type(
        '12345a',
      );
      cy.dataCy('form-register-coordinator-password-confirm-input').blur();
      // testing non-existence of element fails on .find() method
      cy.get(
        '*[data-cy="form-register-coordinator-terms] .q-field__messages',
      ).should('not.exist');
    });

    it('validates checkboxes correctly', () => {
      // fill in other parts of the form to be able to test password
      cy.dataCy('form-register-coordinator-first-name-input').type('John');
      cy.dataCy('form-register-coordinator-last-name-input').type('Doe');
      cy.dataCy('form-register-coordinator-company').click();
      cy.get('.q-menu .q-item').first().click();
      cy.dataCy('form-register-coordinator-job-title-input').type('IT');
      cy.dataCy('form-register-coordinator-email')
        .find('input')
        .type('simple@example.com');
      cy.dataCy('form-register-coordinator-phone')
        .find('input')
        .type('+420 736 456 789');
      cy.dataCy('form-register-coordinator-password-input').type('12345a');
      cy.dataCy('form-register-coordinator-password-confirm-input').type(
        '12345a',
      );
      // test responsibility checkbox unchecked
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t(
            'register.coordinator.form.messageResponsibilityRequired',
          ),
        );
      // test responsibility checkbox checked
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox')
        .click();
      // testing non-existence of element fails on .find() method
      cy.get(
        '*[data-cy="form-register-coordinator-responsibility] .q-field__messages',
      ).should('not.exist');
      // test terms checkbox unchecked
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      cy.dataCy('form-register-coordinator-terms')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.coordinator.form.messageTermsRequired'),
        );
      // test terms checkbox checked
      cy.dataCy('form-register-coordinator-terms').find('.q-checkbox').click();
      // testing non-existence of element fails on .find() method
      cy.get(
        '*[data-cy="form-register-coordinator-terms] .q-field__messages',
      ).should('not.exist');
    });

    // TODO: Test successful submit
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
