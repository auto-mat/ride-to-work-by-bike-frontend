import { computed } from 'vue';
import { colors, getCssVar } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import FormRegister from '../register/FormRegister.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import route from '../../../src/router';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';
import registerRequest from '../../../test/cypress/fixtures/registerRequest.json';
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterStore } from '../../stores/register';
import { useLoginStore } from '../../stores/login';
import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  httpInternalServerErrorStatus,
  systemTimeChallengeActive,
  systemTimeRegistrationPhaseInactive,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';
import { PhaseType } from '../types/Challenge';

// colors
const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const whiteOpacity = changeAlpha(
  white,
  rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
);
const customFormFieldValidationErrColor = getCssVar(
  'custom-form-field-validation-err',
);
const negative = getPaletteColor('negative');

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
const selectorFormRegisterPrivacyConsentLink =
  'form-register-privacy-consent-link';
const selectorFormRegisterSubmit = 'form-register-submit';
const selectorFormRegisterLogin = 'form-register-login';
const selectorFormRegisterLoginLink = 'form-register-login-link';
const selectorFormRegisterTextNoActiveChallenge =
  'form-register-text-no-active-challenge';
const selectorFormRegisterPrivacyConsent = 'form-register-privacy-consent';
const selectorFormRegisterSeparator = 'form-register-separator';

// variables
const iconSize = 18;
const fontSizeText = 14;
const fontWeightText = 400;
const router = route();
const defaultLoginUserEmailStoreValue = '';
const urlAppDataPrivacyPolicy = rideToWorkByBikeConfig.urlAppDataPrivacyPolicy;

const compareRegisterResponseWithStore = (
  loginStore,
  registerStore,
  registerResponse,
) => {
  expect(registerStore.getIsEmailVerified).to.equal(false);
  expect(loginStore.getUserEmail).to.equal(registerResponse.user.email);
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
      cy.interceptThisCampaignGetApi(rideToWorkByBikeConfig, i18n);
      setActivePinia(createPinia());
      cy.mount(FormRegister, {
        props: { useFormFieldValidationErrorCssClass: true },
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

    it('check default form field validation error color', () => {
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('macbook-16');
      [
        selectorFormRegisterEmail,
        selectorFormRegisterPassword,
        selectorFormRegisterPasswordConfirm,
        selectorFormRegisterPrivacyConsent,
      ].forEach((formField) => {
        cy.checkFormFieldValidationErrColor(formField, negative);
      });
    });
    it('check custom form field validation error color', () => {
      [
        selectorFormRegisterEmail,
        selectorFormRegisterPassword,
        selectorFormRegisterPasswordConfirm,
        selectorFormRegisterPrivacyConsent,
      ].forEach((formField) => {
        cy.checkFormFieldValidationErrColor(
          formField,
          customFormFieldValidationErrColor,
        );
      });
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
      cy.wait('@thisCampaignRequest');
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

    it('renders link to privacy policy', () => {
      cy.waitForThisCampaignApi();
      cy.clock()
        .as('clock')
        .then((clock) => {
          clock.setSystemTime(systemTimeChallengeActive);
        });
      cy.dataCy(selectorFormRegisterPrivacyConsentLink)
        .should('be.visible')
        .and('have.attr', 'href', urlAppDataPrivacyPolicy);
      cy.request({
        url: urlAppDataPrivacyPolicy,
        failOnStatusCode: failOnStatusCode,
        headers: { ...userAgentHeader },
      }).then((resp) => {
        if (resp.status === httpTooManyRequestsStatus) {
          cy.log(httpTooManyRequestsStatusMessage);
          return;
        }
        expect(resp.status).to.eq(httpSuccessfullStatus);
      });
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
      const loginStore = useLoginStore();
      // default store state
      expect(loginStore.getUserEmail).to.equal(defaultLoginUserEmailStoreValue);
      expect(registerStore.getIsEmailVerified).to.equal(false);
      cy.fixture('loginRegisterResponseChallengeInactive').then(
        (loginRegisterResponseChallengeInactive) => {
          cy.interceptRegisterApi(
            rideToWorkByBikeConfig,
            i18n,
            loginRegisterResponseChallengeInactive,
            httpInternalServerErrorStatus,
          );
        },
      );
      cy.wrap(
        registerStore.register(
          registerRequest.email,
          registerRequest.password1,
        ),
      ).then((response) => {
        expect(response).to.deep.equal(null);
        // state does not change
        expect(loginStore.getUserEmail).to.equal(
          defaultLoginUserEmailStoreValue,
        );
        expect(registerStore.getIsEmailVerified).to.equal(false);
        // error is shown
        cy.contains(
          i18n.global.t('register.apiMessageErrorWithMessage'),
        ).should('be.visible');
        // wait for error to disappear
        cy.contains(
          i18n.global.t('register.apiMessageErrorWithMessage'),
        ).should('not.exist');
      });
    });
    it('allows to register with email and password', () => {
      const registerStore = useRegisterStore();
      const loginStore = useLoginStore();
      // default store state
      expect(loginStore.getUserEmail).to.equal(defaultLoginUserEmailStoreValue);
      expect(registerStore.getIsEmailVerified).to.equal(false);
      cy.fixture('loginRegisterResponseChallengeActive.json').then(
        (registerResponse) => {
          // intercept registration API call, without callback func response object is null
          cy.interceptRegisterApi(
            rideToWorkByBikeConfig,
            i18n,
            registerResponse,
          ).then(() => {
            // register
            cy.wrap(
              registerStore.register(
                registerRequest.email,
                registerRequest.password1,
              ),
            ).then((response) => {
              cy.contains(i18n.global.t('register.apiMessageSuccess')).should(
                'be.visible',
              );
              // wait for success message to disappear
              cy.contains(i18n.global.t('register.apiMessageSuccess')).should(
                'not.exist',
              );
              // test function return value
              expect(response).to.deep.equal(registerResponse);
              // store state
              expect(loginStore.getUserEmail).to.equal(
                registerResponse.user.email,
              );
              expect(registerStore.getIsEmailVerified).to.equal(false);
            });
          });
        },
      );
    });
  });
  context('no active challenge', () => {
    beforeEach(() => {
      cy.interceptThisCampaignGetApi(rideToWorkByBikeConfig, i18n);
      setActivePinia(createPinia());
      cy.clock()
        .as('clock')
        .then((clock) => {
          clock.setSystemTime(systemTimeRegistrationPhaseInactive);
        });
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('stores days active and max team members values in challenge store', () => {
      cy.waitForThisCampaignApi();
      cy.wrap(useChallengeStore()).then((challengeStore) => {
        // access variables as computed properties
        const daysActive = computed(() => challengeStore.getDaysActive);
        const maxTeamMembers = computed(() => challengeStore.getMaxTeamMembers);
        // wait until values are set
        cy.wrap(daysActive).its('value').should('be.equal', 8);
        cy.wrap(maxTeamMembers).its('value').should('be.equal', 5);
      });
    });

    it('shows a text with no active challenge', () => {
      cy.waitForThisCampaignApi();
      const challengeStore = useChallengeStore();
      expect(
        challengeStore.getIsChallengeInPhase(PhaseType.competition),
      ).to.equal(false);
      cy.dataCy(selectorFormRegisterTextNoActiveChallenge)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.color', white)
        .and('contain', i18n.global.t('register.form.textNoActiveChallenge'));
    });

    it('shows checkbox for data privacy policy', () => {
      cy.waitForThisCampaignApi();
      // privacy policy
      cy.dataCy(selectorFormRegisterPrivacyConsent)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .and('have.color', white)
        .and('contain', i18n.global.t('register.form.labelPrivacyConsent1'))
        .and('contain', i18n.global.t('register.form.labelPrivacyConsentLink'));
    });

    it('allows to submit form after filling fields', () => {
      cy.waitForThisCampaignApi();
      const registerStore = useRegisterStore();
      const loginStore = useLoginStore();
      cy.fixture('loginRegisterResponseChallengeInactive').then(
        (loginRegisterResponseChallengeInactive) => {
          // intercept registration API call
          cy.interceptRegisterApi(
            rideToWorkByBikeConfig,
            i18n,
            loginRegisterResponseChallengeInactive,
          );

          // fill and submit form
          cy.fillAndSubmitRegisterForm();
          // check that form is submitted
          cy.wait('@registerRequest')
            .its('response.statusCode')
            .should('be.equal', httpSuccessfullStatus)
            .then(() => {
              compareRegisterResponseWithStore(
                loginStore,
                registerStore,
                loginRegisterResponseChallengeInactive,
              );
            });
        },
      );
    });
  });

  context('active challenge', () => {
    beforeEach(() => {
      cy.interceptThisCampaignGetApi(rideToWorkByBikeConfig, i18n);
      setActivePinia(createPinia());
      cy.clock()
        .as('clock')
        .then((clock) => {
          clock.setSystemTime(systemTimeChallengeActive);
        });
      cy.mount(FormRegister, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('does not show a text with no active challenge', () => {
      cy.waitForThisCampaignApi();
      cy.wrap(useChallengeStore()).then((store) => {
        const isChallengeCompetition = computed(() =>
          store.getIsChallengeInPhase(PhaseType.competition),
        );
        cy.wrap(isChallengeCompetition).its('value').should('equal', true);
        cy.dataCy(selectorFormRegisterTextNoActiveChallenge).should(
          'not.exist',
        );
      });
    });

    // Showing privacy data link in all condition (is not depend on challange competition phase)
    it.skip('does not show checkbox for data privacy policy', () => {
      cy.waitForThisCampaignApi();
      cy.wrap(useChallengeStore()).then((store) => {
        const isChallengeCompetition = computed(() =>
          store.getIsChallengeInPhase(PhaseType.competition),
        );
        cy.wrap(isChallengeCompetition).its('value').should('equal', true);
        cy.dataCy(selectorFormRegisterPrivacyConsent).should('not.exist');
      });
    });
    it('allows to submit form after filling fields and accepting privacy policy', () => {
      cy.waitForThisCampaignApi();
      cy.wrap(useChallengeStore()).then((challengeStore) => {
        const isChallengeCompetition = computed(() =>
          challengeStore.getIsChallengeInPhase(PhaseType.competition),
        );
        cy.wrap(isChallengeCompetition).its('value').should('equal', true);
        const loginStore = useLoginStore();
        const registerStore = useRegisterStore();
        // intercept registration API call
        cy.interceptRegisterApi(rideToWorkByBikeConfig, i18n);
        cy.fixture('loginRegisterResponseChallengeInactive').then(
          (loginRegisterResponseChallengeInactive) => {
            // fill and submit form
            cy.fillAndSubmitRegisterForm();
            // check that form is submitted
            cy.wait('@registerRequest')
              .its('response.statusCode')
              .should('be.equal', httpSuccessfullStatus)
              .then(() => {
                compareRegisterResponseWithStore(
                  loginStore,
                  registerStore,
                  loginRegisterResponseChallengeInactive,
                );
              });
          },
        );
      });
    });
  });
});
