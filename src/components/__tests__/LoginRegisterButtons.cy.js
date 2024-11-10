import { setActivePinia, createPinia } from 'pinia';
import { colors } from 'quasar';
import { useLoginStore } from '../../stores/login';
import LoginRegisterButtons from 'components/global/LoginRegisterButtons.vue';
import { i18n } from '../../boot/i18n';
import {
  httpSuccessfullStatus,
  interceptGoogleLoginApi,
} from '../../../test/cypress/support/commonTests';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

describe('<LoginRegisterButtons>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonGoogle', 'buttonFacebook'],
      'login.buttons',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonGoogle', 'buttonFacebook'],
      'register.buttons',
      i18n,
    );
  });

  context('variant: login', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      rideToWorkByBikeConfig.googleLoginAppId = 'TEST_SECRET';
      cy.mount(LoginRegisterButtons, {
        props: {
          variant: 'login',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders buttons with correct text', () => {
      cy.dataCy('login-register-button-google').should(
        'contain',
        i18n.global.t('login.buttons.buttonGoogle'),
      );
      cy.dataCy('login-register-button-facebook').should(
        'contain',
        i18n.global.t('login.buttons.buttonFacebook'),
      );
    });
  });

  context('variant: register', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(LoginRegisterButtons, {
        props: {
          variant: 'register',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders buttons with correct text', () => {
      cy.dataCy('login-register-button-google').should(
        'contain',
        i18n.global.t('register.buttons.buttonGoogle'),
      );
      cy.dataCy('login-register-button-facebook').should(
        'contain',
        i18n.global.t('register.buttons.buttonFacebook'),
      );
    });
  });

  function coreTests() {
    it('renders register button google', () => {
      cy.dataCy('login-register-button-google')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', white);
    });

    it('renders google button icon', () => {
      cy.dataCy('login-register-button-google-icon')
        .should('have.class', 'fab')
        .and('have.class', 'fa-google')
        .and('have.color', white);
      cy.dataCy('login-register-button-google-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('login-register-button-google-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders register button facebook', () => {
      cy.dataCy('login-register-button-facebook')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', primary);
    });

    it('renders facebook button icon', () => {
      cy.dataCy('login-register-button-facebook-icon')
        .should('contain', 'facebook')
        .and('have.color', primary);
      cy.dataCy('login-register-button-facebook-icon')
        .invoke('height')
        .should('be.equal', 24);
      cy.dataCy('login-register-button-facebook-icon')
        .invoke('width')
        .should('be.equal', 24);
    });

    it('renders buttons with correct spacing', () => {
      cy.dataCy('login-register-button-google').should(
        'have.css',
        'margin-bottom',
        '16px',
      );
    });

    it('sends request to google auth endpoint with Google login info', () => {
      const loginStore = useLoginStore();
      // intercept google login BE API call
      interceptGoogleLoginApi(rideToWorkByBikeConfig, i18n);
      // mock the Google API response (which we do not control)
      cy.fixture('googleLoginApiResponse.json').then((googleLoginResponse) => {
        cy.fixture('loginRegisterResponseChallengeActive.json').then(
          (loginResponse) => {
            // login with Google data
            loginStore.authenticateWithGoogle(googleLoginResponse);
            // test request to the BE endpoint
            cy.wait('@loginGoogle').then(({ request, response }) => {
              expect(request.body.code).to.eq(googleLoginResponse.code);
              expect(response.statusCode).to.eq(httpSuccessfullStatus);
              expect(response.body).to.deep.eq(loginResponse);
            });
            cy.contains(i18n.global.t('login.apiMessageSuccess')).should(
              'be.visible',
            );
          },
        );
      });
    });
  }
});
