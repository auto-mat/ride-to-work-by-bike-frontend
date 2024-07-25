import { colors } from 'quasar';

import FormRegister from '../register/FormRegister.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import route from '../../../src/router';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';

const { getPaletteColor } = colors;

const router = route();

const grey10 = getPaletteColor('grey-10');
const white = getPaletteColor('white');

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;
const colorWhiteOpacity = rideToWorkByBikeConfig.colorWhiteOpacity;
const borderRadiusCardSmall = rideToWorkByBikeConfig.borderRadiusCardSmall;

describe('<FormRegister>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleRegister',
        'hintPassword',
        'messageEmailReqired',
        'messageEmailInvalid',
        'messagePasswordRequired',
        'messagePasswordStrong',
        'messagePasswordConfirmRequired',
        'messagePasswordConfirmNotMatch',
      ],
      'register.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.dataCy('form-register-title')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('register.form.titleRegister'));
    });

    it('renders email field', () => {
      cy.dataCy('form-register-email').should('be.visible');
    });

    it('renders password field', () => {
      cy.dataCy('form-register-password')
        .should('be.visible')
        .find('label[for="form-register-password"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('register.form.labelPassword'));
      cy.dataCy('form-register-password')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password confirm field', () => {
      cy.dataCy('form-register-password-confirm')
        .should('be.visible')
        .find('label[for="form-register-password-confirm"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('register.form.labelPasswordConfirm'));
      cy.dataCy('form-register-password-confirm')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders show/hide icons for password inputs', () => {
      cy.viewport(500, 500).then(() => {
        cy.dataCy('form-register-password-icon').then((element) => {
          cy.testIcon({
            element: element,
            name: 'form-register-password-show',
            size: 18,
          });
        });
      });
      cy.dataCy('form-register-password-icon')
        .should('contain', 'visibility')
        .and('have.color', `${colorPrimary}`);
      cy.dataCy('form-register-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-password-icon')
        .invoke('width')
        .should('be.equal', 18);
      // password confirm
      cy.dataCy('form-register-password-confirm-icon')
        .should('contain', 'visibility')
        .and('have.color', `${colorPrimary}`);
      cy.dataCy('form-register-password-confirm-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-register-password-confirm-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    testPasswordInputReveal('form-register-password');
    testPasswordInputReveal('form-register-password-confirm');

    it('validates password correctly', () => {
      // fill in email input to be able to test password
      cy.dataCy('form-register-email').find('input').type('qw123@qw.com');
      // test password
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordRequired'),
        );
      cy.dataCy('form-register-password-input').clear();
      cy.dataCy('form-register-password-input').type('12345');
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordStrong'),
        );
      cy.dataCy('form-register-password-input').clear();
      cy.dataCy('form-register-password-input').type('123456789');
      cy.dataCy('form-register-password')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordStrong'),
        );
      cy.dataCy('form-register-password-input').clear();
      cy.dataCy('form-register-password-input').type('12345a');
      cy.dataCy('form-register-password-input').blur();
      cy.dataCy('form-register-password')
        .find('.q-field__messages')
        .should('contain', i18n.global.t('register.form.hintPassword'));
    });

    it('validates password confirm correctly', () => {
      // fill in email input to be able to test password
      cy.dataCy('form-register-email').find('input').type('qw123@qw.com');
      // fill in password input to be able to test password confirm
      cy.dataCy('form-register-password-input').type('12345a');
      // test password confirm empty
      cy.dataCy('form-register-submit').should('be.visible').click();
      cy.dataCy('form-register-password-confirm')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordConfirmRequired'),
        );
      cy.dataCy('form-register-password-confirm-input').clear();
      // test password confirm not matching
      cy.dataCy('form-register-password-confirm-input').type('12345b');
      cy.dataCy('form-register-password-confirm-input').blur();
      cy.dataCy('form-register-password-confirm')
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordConfirmNotMatch'),
        );
      cy.dataCy('form-register-password-confirm-input').clear();
      // test password confirm matching
      cy.dataCy('form-register-password-confirm-input').type('12345a');
      cy.dataCy('form-register-password-confirm-input').blur();
      // testing non-existence of element fails on .find() method
      cy.get(
        '*[data-cy="form-register-coordinator-terms] .q-field__messages',
      ).should('not.exist');
    });

    it('renders box with coordinator registration link', () => {
      const urlRegisterCoordinator = router.resolve({
        name: 'register-coordinator',
      }).href;
      // wrapper
      cy.dataCy('form-register-coordinator')
        .should('have.css', 'padding', '16px')
        .and('have.backgroundColor', colorWhiteOpacity)
        .and('have.css', 'border-radius', borderRadiusCardSmall);
      // description
      cy.dataCy('form-register-coordinator-description')
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.css', 'margin-top', '0px')
        .and('have.css', 'margin-bottom', '16px')
        .and('have.color', white)
        .and(
          'contain',
          i18n.global.t('register.form.hintRegisterAsCoordinator'),
        )
        .then(($description) => {
          expect($description.text()).to.equal(
            i18n.global.t('register.form.hintRegisterAsCoordinator'),
          );
        });
      // spacing
      cy.dataCy('form-register-coordinator-link-wrapper')
        .should('have.css', 'margin-top', '16px')
        .and('have.css', 'margin-bottom', '0px');
      // link
      cy.dataCy('form-register-coordinator-link')
        .should('have.color', white)
        .and('have.attr', 'href', urlRegisterCoordinator)
        .and(
          'contain',
          i18n.global.t('register.form.linkRegisterAsCoordinator'),
        );
    });

    it('renders link to login page', () => {
      const urlLogin = router.resolve({ name: 'login' }).href;
      // wrapper
      cy.dataCy('form-register-login')
        .should('have.color', white)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'margin-top', '24px')
        .and('contain', i18n.global.t('register.form.hintLogin'));
      // link
      cy.dataCy('form-register-login-link')
        .should('have.color', white)
        .and('have.css', 'font-size', '14px')
        .and('have.attr', 'href', urlLogin)
        .and('contain', i18n.global.t('register.form.linkLogin'));
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
