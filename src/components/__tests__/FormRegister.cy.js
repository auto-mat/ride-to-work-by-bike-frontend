import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import FormRegister from '../register/FormRegister.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import route from '../../../src/router';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterStore } from '../../stores/register';
import { useLoginStore } from '../../stores/login';
import {
  httpSuccessfullStatus,
  httpInternalServerErrorStatus,
} from '../../../test/cypress/support/commonTests';
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';

// colors
const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const whiteOpacity = changeAlpha(
  white,
  rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
);

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
const selectorFormRegisterPrivacyConsent = 'form-register-privacy-consent';
const selectorFormRegisterNewsletterSubscription =
  'form-register-newsletter-subscription';
const selectorFormRegisterSeparator = 'form-register-separator';

// variables
const iconSize = 18;
const fontSizeText = 14;
const fontWeightText = 400;
const router = route();
const testEmail = 'test@test.com';
const testPassword = '12345a';
const { apiBase, apiDefaultLang, borderRadiusCardSmall, urlApiRegister } =
  rideToWorkByBikeConfig;

const compareRegisterResponseWithStore = (registerResponse) => {
  cy.contains(i18n.global.t('register.apiMessageSuccess')).should('be.visible');
  const registerStore = useRegisterStore();
  expect(registerStore.getEmail).to.equal(registerResponse.user.email);
  expect(registerStore.getIsEmailVerified).to.equal(false);
  const loginStore = useLoginStore();
  expect(loginStore.getUser).to.eql(registerResponse.user);
};

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
        'messagePasswordRequired',
        'messagePasswordStrong',
        'messagePasswordConfirmRequired',
        'messagePasswordConfirmNotMatch',
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
      setActivePinia(createPinia());
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

    it('renders separator', () => {
      cy.dataCy(selectorFormRegisterSeparator)
        .should('be.visible')
        .and('have.backgroundColor', whiteOpacity);
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

    it('validates privacy policy correctly', () => {
      // fill in email input to be able to test password
      cy.dataCy(selectorFormRegisterEmail).find('input').type('qw123@qw.com');
      // fill in password input to be able to test password confirm
      cy.dataCy(selectorFormRegisterPasswordInput).type('12345a');
      cy.dataCy(selectorFormRegisterPasswordConfirmInput).type('12345a');
      // validate privacy policy
      cy.dataCy(selectorFormRegisterSubmit).should('be.visible').click();
      cy.dataCy(selectorFormRegisterPrivacyConsent).within(() => {
        cy.contains(
          i18n.global.t('register.form.messagePrivacyConsentRequired'),
        ).should('be.visible');
      });
    });

    it('renders box with coordinator registration link', () => {
      const urlRegisterCoordinator = router.resolve({
        name: 'register-coordinator',
      }).href;
      // wrapper
      cy.dataCy(selectorFormRegisterCoordinator)
        .should('have.css', 'padding', '16px')
        .and('have.backgroundColor', whiteOpacity)
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

    it('shows an error if the registration fails', () => {
      const registerStore = useRegisterStore();
      // default store state
      expect(registerStore.getEmail).to.equal('');
      expect(registerStore.getIsEmailVerified).to.equal(false);
      // variables
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
      // intercept registration API call
      cy.intercept('POST', apiRegisterUrl, {
        statusCode: httpInternalServerErrorStatus,
      }).as('registerRequest');
      // register
      cy.wrap(registerStore.register(testEmail, testPassword)).then(
        (response) => {
          expect(response).to.deep.equal(null);
          // state does not change
          expect(registerStore.getEmail).to.equal('');
          expect(registerStore.getIsEmailVerified).to.equal(false);
          // error is shown
          cy.contains(
            i18n.global.t('register.apiMessageErrorWithMessage'),
          ).should('be.visible');
        },
      );
    });

    it('allows to register with email and password', () => {
      const registerStore = useRegisterStore();
      // default store state
      expect(registerStore.getEmail).to.equal('');
      expect(registerStore.getIsEmailVerified).to.equal(false);
      // variables
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
      cy.fixture('registerResponse.json').then((registerResponse) => {
        // intercept registration API call
        cy.intercept('POST', apiRegisterUrl, {
          statusCode: httpSuccessfullStatus,
          body: registerResponse,
        }).then(() => {
          // register
          cy.wrap(registerStore.register(testEmail, testPassword)).then(
            (response) => {
              // test function return value
              expect(response).to.deep.equal(registerResponse);
              // store state
              expect(registerStore.getEmail).to.equal(
                registerResponse.user.email,
              );
              expect(registerStore.getIsEmailVerified).to.equal(false);
            },
          );
        });
      });
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
      const challengeStore = useChallengeStore();
      challengeStore.setIsChallengeActive(false);
      expect(challengeStore.getIsChallengeActive).to.equal(false);
      cy.dataCy(selectorFormRegisterTextNoActiveChallenge)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.color', white)
        .and('contain', i18n.global.t('register.form.textNoActiveChallenge'));
    });

    it('shows checkboxes for privacy policy and newsletter subscription', () => {
      // privacy policy
      cy.dataCy(selectorFormRegisterPrivacyConsent)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.color', white)
        .and('contain', i18n.global.t('register.form.labelPrivacyConsent1'))
        .and('contain', i18n.global.t('register.form.labelPrivacyConsentLink'))
        .and('contain', i18n.global.t('register.form.labelPrivacyConsent2'));
      // newsletter subscription
      cy.dataCy(selectorFormRegisterNewsletterSubscription)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.color', white)
        .and(
          'contain',
          i18n.global.t('register.form.labelNewsletterSubscription'),
        );
    });

    it('allows to submit form after filling fields', () => {
      // variables
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
      cy.fixture('registerResponse.json').then((registerResponse) => {
        // intercept registration API call
        cy.intercept('POST', apiRegisterUrl, {
          statusCode: httpSuccessfullStatus,
          body: registerResponse,
        }).as('registerRequest');
        // fill in form
        cy.dataCy(selectorFormRegisterEmail).find('input').type(testEmail);
        cy.dataCy(selectorFormRegisterPasswordInput).type(testPassword);
        cy.dataCy(selectorFormRegisterPasswordConfirmInput).type(testPassword);
        // accept privacy policy
        cy.dataCy(selectorFormRegisterPrivacyConsent)
          .should('be.visible')
          .click('topLeft');
        // submit form
        cy.dataCy(selectorFormRegisterSubmit).should('be.visible').click();
        // check that form is submitted
        cy.wait('@registerRequest')
          .its('response.statusCode')
          .should('be.equal', httpSuccessfullStatus)
          .then(() => {
            compareRegisterResponseWithStore(registerResponse);
          });
      });
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
      const challengeStore = useChallengeStore();
      challengeStore.setIsChallengeActive(true);
      expect(challengeStore.getIsChallengeActive).to.equal(true);
      cy.dataCy(selectorFormRegisterTextNoActiveChallenge).should('not.exist');
    });

    it('does not show checkboxes for privacy policy and newsletter subscription', () => {
      const challengeStore = useChallengeStore();
      challengeStore.setIsChallengeActive(true);
      expect(challengeStore.getIsChallengeActive).to.equal(true);
      cy.dataCy(selectorFormRegisterPrivacyConsent).should('not.exist');
      cy.dataCy(selectorFormRegisterNewsletterSubscription).should('not.exist');
    });

    it('allows to submit form after filling fields and accepting privacy policy', () => {
      const challengeStore = useChallengeStore();
      challengeStore.setIsChallengeActive(true);
      expect(challengeStore.getIsChallengeActive).to.equal(true);
      // variables
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiRegisterUrl = `${apiBaseUrl}${urlApiRegister}`;
      cy.fixture('registerResponse.json').then((registerResponse) => {
        // intercept registration API call
        cy.intercept('POST', apiRegisterUrl, {
          statusCode: httpSuccessfullStatus,
          body: registerResponse,
        }).as('registerRequest');
        // fill in form
        cy.dataCy(selectorFormRegisterEmail).find('input').type(testEmail);
        cy.dataCy(selectorFormRegisterPasswordInput).type(testPassword);
        cy.dataCy(selectorFormRegisterPasswordConfirmInput).type(testPassword);
        // submit form
        cy.dataCy(selectorFormRegisterSubmit).should('be.visible').click();
        // check that form is submitted
        cy.wait('@registerRequest')
          .its('response.statusCode')
          .should('be.equal', httpSuccessfullStatus)
          .then(() => {
            compareRegisterResponseWithStore(registerResponse);
          });
      });
    });
  });
});
