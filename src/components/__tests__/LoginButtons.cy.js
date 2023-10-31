import LoginButtons from 'components/LoginButtons.vue';
import { i18n } from '../../boot/i18n';

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<LoginButtons>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonGoogle', 'buttonFacebook'],
      'login.buttons',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(LoginButtons, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders login button google', () => {
      cy.dataCy('login-button-google')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', colorPrimary)
        .and('contain', i18n.global.t('login.buttons.buttonGoogle'));
    });

    it('renders google button icon', () => {
      cy.dataCy('login-button-google-icon')
        .should('have.class', 'fab')
        .and('have.class', 'fa-google')
        .and('have.color', colorPrimary);
      cy.dataCy('login-button-google-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('login-button-google-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('renders login button facebook', () => {
      cy.dataCy('login-button-facebook')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', colorPrimary)
        .and('contain', i18n.global.t('login.buttons.buttonFacebook'));
    });

    it('renders facebook button icon', () => {
      cy.dataCy('login-button-facebook-icon')
        .should('contain', 'facebook')
        .and('have.color', colorPrimary);
      cy.dataCy('login-button-facebook-icon')
        .invoke('height')
        .should('be.equal', 24);
      cy.dataCy('login-button-facebook-icon')
        .invoke('width')
        .should('be.equal', 24);
    });

    it('renders buttons with correct spacing', () => {
      cy.dataCy('login-button-facebook').should(
        'have.css',
        'margin-top',
        '16px',
      );
    });
  });
});
