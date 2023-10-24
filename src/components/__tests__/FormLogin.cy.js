import FormLogin from 'components/FormLogin.vue';
import { i18n } from '../../boot/i18n';

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<FormLogin>', () => {
  it('has translation for all strings', () => {
    // Not testing form labels since they are the same in all languages
    cy.testLanguageStringsInContext(['emailReqired', 'passwordRequired'], 'login.form', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('should render email field', () => {
      cy.dataCy('form-login-email')
        .should('be.visible')
        .find('label[for="form-login-email"]')
        .should('be.visible')
        .should('have.text', i18n.global.t('login.form.email'));

      cy.dataCy('form-login-email')
        .find('.q-field__control')
        .should('be.visible')
        .should('have.css', 'border-radius', '8px');
    });

    it('should render password field', () => {
      cy.dataCy('form-login-password')
        .should('be.visible')
        .find('label[for="form-login-password"]')
        .should('be.visible')
        .should('have.text', i18n.global.t('login.form.password'));

      cy.dataCy('form-login-password')
        .find('.q-field__control')
        .should('be.visible')
        .should('have.css', 'border-radius', '8px');
    });

    it('should render password show/hide icon', () => {
      cy.dataCy('form-login-password-icon')
        .should('contain', 'visibility')
        .should('have.color', `${colorPrimary}`);
      cy.dataCy('form-login-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-login-password-icon')
        .invoke('width')
        .should('be.equal', 18);
    })
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
