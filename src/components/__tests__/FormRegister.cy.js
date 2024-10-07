import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import FormRegister from '../register/FormRegister.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import route from '../../../src/router';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';
import { useGlobalStore } from '../../stores/global';
import { useRegisterStore } from '../../stores/register';
import { httpSuccessfullStatus } from '../../../test/cypress/support/commonTests';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');

// selectors
const selectorFormRegisterTitle = 'form-register-title';
const selectorFormRegisterEmail = 'form-register-email';
const selectorFormRegisterPassword = 'form-register-password';
const selectorFormRegisterPasswordInput = 'form-register-password-input';
const selectorFormRegisterPasswordIcon = 'form-register-password-icon';
const selectorFormRegisterPasswordConfirm = 'form-register-password-confirm';
const selectorFormRegisterPasswordConfirmInput =
  'form-register-password-confirm-input';
const selectorFormRegisterPasswordConfirmIcon =
  'form-register-password-confirm-icon';
const selectorFormRegisterSubmit = 'form-register-submit';
const selectorFormRegisterCoordinator = 'form-register-coordinator';
const selectorFormRegisterCoordinatorDescription =
  'form-register-coordinator-description';
const selectorFormRegisterCoordinatorLinkWrapper =
  'form-register-coordinator-link-wrapper';
const selectorFormRegisterCoordinatorLink = 'form-register-coordinator-link';
const selectorFormRegisterLogin = 'form-register-login';
const selectorFormRegisterLoginLink = 'form-register-login-link';
const selectorFormRegisterTextNoActiveChallenge =
  'form-register-text-no-active-challenge';
const selectorFormRegisterForm = 'form-register-form';
const selectorEmailConfirmation = 'email-confirmation';

// variables
const iconSize = 18;
const fontSizeText = 14;
const fontWeightText = 400;
const router = route();
const testEmail = 'test@test.com';
const testPassword = '12345a';
const { apiBase, colorWhiteOpacity, borderRadiusCardSmall, urlApiRegister } =
  rideToWorkByBikeConfig;
const apiRegisterUrl = `${apiBase}${urlApiRegister}`;

describe('<FormRegister>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'hintLogin',
        'hintPassword',
        'hintRegisterAsCoordinator',
        'labelEmail',
        'labelPassword',
        'labelPasswordConfirm',
        'linkLogin',
        'linkRegisterAsCoordinator',
        'messageEmailReqired',
        'messageEmailInvalid',
        'messageError',
        'messagePasswordRequired',
        'messagePasswordStrong',
        'messagePasswordConfirmRequired',
        'messagePasswordConfirmNotMatch',
        'messageSuccess',
        'submitRegister',
        'textNoActiveChallenge',
        'titleRegister',
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
      cy.dataCy(selectorFormRegisterTitle)
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('register.form.titleRegister'));
    });

    it('renders email field', () => {
      cy.dataCy(selectorFormRegisterEmail).should('be.visible');
    });

    it('renders password field', () => {
      cy.dataCy(selectorFormRegisterPassword)
        .should('be.visible')
        .find('label[for="form-register-password"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('register.form.labelPassword'));
      cy.dataCy(selectorFormRegisterPassword)
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password confirm field', () => {
      cy.dataCy(selectorFormRegisterPasswordConfirm)
        .should('be.visible')
        .find('label[for="form-register-password-confirm"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('register.form.labelPasswordConfirm'));
      cy.dataCy(selectorFormRegisterPasswordConfirm)
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders show/hide icons for password inputs', () => {
      // password
      cy.dataCy(selectorFormRegisterPasswordIcon)
        .should('contain', 'visibility')
        .and('have.color', white);
      cy.dataCy(selectorFormRegisterPasswordIcon)
        .invoke('height')
        .should('be.equal', iconSize);
      cy.dataCy(selectorFormRegisterPasswordIcon)
        .invoke('width')
        .should('be.equal', iconSize);
      // password confirm
      cy.dataCy(selectorFormRegisterPasswordConfirmIcon)
        .should('contain', 'visibility')
        .and('have.color', white);
      cy.dataCy(selectorFormRegisterPasswordConfirmIcon)
        .invoke('height')
        .should('be.equal', iconSize);
      cy.dataCy(selectorFormRegisterPasswordConfirmIcon)
        .invoke('width')
        .should('be.equal', iconSize);
    });

    testPasswordInputReveal(selectorFormRegisterPassword);
    testPasswordInputReveal(selectorFormRegisterPasswordConfirm);

    it('validates password correctly', () => {
      // fill in email input to be able to test password
      cy.dataCy(selectorFormRegisterEmail).find('input').type('qw123@qw.com');
      // test password
      cy.dataCy(selectorFormRegisterSubmit).should('be.visible').click();
      cy.dataCy(selectorFormRegisterPassword)
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordRequired'),
        );
      cy.dataCy(selectorFormRegisterPasswordInput).clear();
      cy.dataCy(selectorFormRegisterPasswordInput).type('12345');
      cy.dataCy(selectorFormRegisterSubmit).should('be.visible').click();
      cy.dataCy(selectorFormRegisterPassword)
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordStrong'),
        );
      cy.dataCy(selectorFormRegisterPasswordInput).clear();
      cy.dataCy(selectorFormRegisterPasswordInput).type('123456789');
      cy.dataCy(selectorFormRegisterPassword)
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordStrong'),
        );
      cy.dataCy(selectorFormRegisterPasswordInput).clear();
      cy.dataCy(selectorFormRegisterPasswordInput).type('12345a');
      cy.dataCy(selectorFormRegisterPasswordInput).blur();
      cy.dataCy(selectorFormRegisterPassword)
        .find('.q-field__messages')
        .should('contain', i18n.global.t('register.form.hintPassword'));
    });

    it('validates password confirm correctly', () => {
      // fill in email input to be able to test password
      cy.dataCy(selectorFormRegisterEmail).find('input').type('qw123@qw.com');
      // fill in password input to be able to test password confirm
      cy.dataCy(selectorFormRegisterPasswordInput).type('12345a');
      // test password confirm empty
      cy.dataCy(selectorFormRegisterSubmit).should('be.visible').click();
      cy.dataCy(selectorFormRegisterPasswordConfirm)
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordConfirmRequired'),
        );
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).clear();
      // test password confirm not matching
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).type('12345b');
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).blur();
      cy.dataCy(selectorFormRegisterPasswordConfirm)
        .find('.q-field__messages')
        .should(
          'contain',
          i18n.global.t('register.form.messagePasswordConfirmNotMatch'),
        );
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).clear();
      // test password confirm matching
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).type('12345a');
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).blur();
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
      cy.dataCy(selectorFormRegisterCoordinator)
        .should('have.css', 'padding', '16px')
        .and('have.backgroundColor', colorWhiteOpacity)
        .and('have.css', 'border-radius', borderRadiusCardSmall);
      // description
      cy.dataCy(selectorFormRegisterCoordinatorDescription)
        .should('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
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
      cy.dataCy(selectorFormRegisterCoordinatorLinkWrapper)
        .should('have.css', 'margin-top', '16px')
        .and('have.css', 'margin-bottom', '0px');
      // link
      cy.dataCy(selectorFormRegisterCoordinatorLink)
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
      cy.dataCy(selectorFormRegisterLogin)
        .should('have.color', white)
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.css', 'margin-top', '24px')
        .and('contain', i18n.global.t('register.form.hintLogin'));
      // link
      cy.dataCy(selectorFormRegisterLoginLink)
        .should('have.color', white)
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.attr', 'href', urlLogin)
        .and('contain', i18n.global.t('register.form.linkLogin'));
    });
  });

  context('no active challenge', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('shows a text with no active challenge', () => {
      const store = useGlobalStore();
      store.setIsActiveChallenge(false);
      expect(store.getIsActiveChallenge).to.equal(false);
      cy.dataCy(selectorFormRegisterTextNoActiveChallenge)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.color', white)
        .and('contain', i18n.global.t('register.form.textNoActiveChallenge'));
    });
  });

  context('active challenge', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('does not show a text with no active challenge', () => {
      const store = useGlobalStore();
      store.setIsActiveChallenge(true);
      expect(store.getIsActiveChallenge).to.equal(true);
      cy.dataCy(selectorFormRegisterTextNoActiveChallenge).should('not.exist');
    });

    it('allows to register with email and password', () => {
      const registerStore = useRegisterStore();
      // default store state
      expect(registerStore.getEmail).to.equal('');
      expect(registerStore.getIsAwaitingConfirmation).to.equal(false);
      // form is visible, confirmation is not
      cy.dataCy(selectorFormRegisterForm).should('be.visible');
      cy.dataCy(selectorEmailConfirmation).should('not.exist');
      cy.intercept('POST', apiRegisterUrl, {
        statusCode: httpSuccessfullStatus,
        body: {
          email: testEmail,
        },
      }).then(() => {
        // register
        cy.wrap(registerStore.register(testEmail, testPassword)).then(() => {
          // new store state
          expect(registerStore.getEmail).to.equal(testEmail);
          expect(registerStore.getIsAwaitingConfirmation).to.equal(true);
          // show confirmation
          cy.dataCy(selectorFormRegisterForm).should('not.exist');
          cy.dataCy(selectorEmailConfirmation).should('be.visible');
        });
      });
    });
  });
});
