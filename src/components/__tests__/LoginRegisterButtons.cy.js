import LoginRegisterButtons from 'components/LoginRegisterButtons.vue';
import { i18n } from '../../boot/i18n';

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

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
      cy.mount(LoginRegisterButtons, {
        props: {
          variant: 'login',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders login button google', () => {
      cy.dataCy('login-register-button-google')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', colorPrimary)
        .and('contain', i18n.global.t('login.buttons.buttonGoogle'));
    });

    it('renders google button icon', () => {
      cy.dataCy('login-register-button-google-icon')
        .should('have.class', 'fab')
        .and('have.class', 'fa-google')
        .and('have.color', colorPrimary);
      cy.dataCy('login-register-button-google-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('login-register-button-google-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders login button facebook', () => {
      cy.dataCy('login-register-button-facebook')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', colorPrimary)
        .and('contain', i18n.global.t('login.buttons.buttonFacebook'));
    });

    it('renders facebook button icon', () => {
      cy.dataCy('login-register-button-facebook-icon')
        .should('contain', 'facebook')
        .and('have.color', colorPrimary);
      cy.dataCy('login-register-button-facebook-icon')
        .invoke('height')
        .should('be.equal', 24);
      cy.dataCy('login-register-button-facebook-icon')
        .invoke('width')
        .should('be.equal', 24);
    });

    it('renders buttons with correct spacing', () => {
      cy.dataCy('login-register-button-facebook').should(
        'have.css',
        'margin-top',
        '16px',
      );
    });
  });

  context('variant: register', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterButtons, {
        props: {
          variant: 'register',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders register button google', () => {
      cy.dataCy('login-register-button-google')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', colorPrimary)
        .and('contain', i18n.global.t('register.buttons.buttonGoogle'));
    });

    it('renders google button icon', () => {
      cy.dataCy('login-register-button-google-icon')
        .should('have.class', 'fab')
        .and('have.class', 'fa-google')
        .and('have.color', colorPrimary);
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
        .and('have.color', colorPrimary)
        .and('contain', i18n.global.t('register.buttons.buttonFacebook'));
    });

    it('renders facebook button icon', () => {
      cy.dataCy('login-register-button-facebook-icon')
        .should('contain', 'facebook')
        .and('have.color', colorPrimary);
      cy.dataCy('login-register-button-facebook-icon')
        .invoke('height')
        .should('be.equal', 24);
      cy.dataCy('login-register-button-facebook-icon')
        .invoke('width')
        .should('be.equal', 24);
    });

    it('renders buttons with correct spacing', () => {
      cy.dataCy('login-register-button-facebook').should(
        'have.css',
        'margin-top',
        '16px',
      );
    });
  });
});
