import { testLanguageSwitcher } from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

const doneIcon = new URL(
  '../../../src/assets/svg/check.svg',
  cy.config().baseUrl,
).href;
// Stepper 1 imgs
const activeIconImgSrcStepper1 = new URL(
  '../../../src/assets/svg/numeric-1-fill.svg',
  cy.config().baseUrl,
).href;
const doneIconImgSrcStepper1 = doneIcon;
// Stepper 2 imgs
const iconImgSrcStepper2 = new URL(
  '../../../src/assets/svg/numeric-2-outline.svg',
  cy.config().baseUrl,
).href;
const activeIconImgSrcStepper2 = new URL(
  '../../../src/assets/svg/numeric-2-fill.svg',
  cy.config().baseUrl,
).href;
const doneIconImgSrcStepper2 = doneIcon;
// Stepper 3 imgs
const iconImgSrcStepper3 = new URL(
  '../../../src/assets/svg/numeric-3-outline.svg',
  cy.config().baseUrl,
).href;
const activeIconImgSrcStepper3 = new URL(
  '../../../src/assets/svg/numeric-3-fill.svg',
  cy.config().baseUrl,
).href;
const doneIconImgSrcStepper3 = doneIcon;
// Stepper 4 imgs
const iconImgSrcStepper4 = new URL(
  '../../../src/assets/svg/numeric-4-outline.svg',
  cy.config().baseUrl,
).href;
const activeIconImgSrcStepper4 = new URL(
  '../../../src/assets/svg/numeric-4-fill.svg',
  cy.config().baseUrl,
).href;

describe('Register Challenge page', () => {
  context('desktop', () => {
    beforeEach(() => {
      // config is defined without hash in the URL
      cy.visit('#' + routesConf['register-challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('renders login register header component', () => {
      cy.dataCy('login-register-header').should('be.visible');
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('language-switcher').should('be.visible');
    });

    // switching between languages can only be tested in E2E context
    testLanguageSwitcher();

    it('renders page title', () => {
      let i18n;
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window()
          .then((win) => {
            i18n = win.i18n;
          })
          .then(() => {
            cy.dataCy('login-register-title')
              .should('be.visible')
              .and('have.color', config.colorWhite)
              .and('have.css', 'font-size', '24px')
              .and('have.css', 'font-weight', '700')
              .and(
                'contain',
                i18n.global.t(
                  `register.challenge.titleRegisterToChallenge.${config.challengeMonth}`,
                ),
              );
          });
      });
    });

    it('renders stepper component', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let i18n;
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window()
          .then((win) => {
            i18n = win.i18n;
          })
          .then(() => {
            // display stepper with correct styles
            cy.dataCy('stepper')
              .should('be.visible')
              .and('have.backgroundColor', 'transparent')
              .and('have.css', 'box-shadow', 'none');
            // display first step with correct styles
            cy.dataCy('step-1')
              .should('be.visible')
              .and('have.backgroundColor', config.colorWhite)
              .and('have.css', 'border-radius', '16px');
            // display first step as open
            cy.dataCy('step-1')
              .find('.q-stepper__step-content')
              .should('be.visible');
            // display first step with active icon
            cy.dataCy('step-1')
              .find('.q-stepper__dot')
              .should('be.visible')
              .and('have.css', 'margin-right', '16px');
            // icon height
            cy.dataCy('step-1')
              .find('.q-stepper__dot')
              .invoke('height')
              .should('be.equal', 38);
            // icon width
            cy.dataCy('step-1')
              .find('.q-stepper__dot')
              .invoke('width')
              .should('be.equal', 38);
            // test icon src
            cy.dataCy('step-1')
              .find('img')
              .should('have.attr', 'src')
              .then(cy.log);
            cy.dataCy('step-1')
              .find('img')
              .should('have.attr', 'src', activeIconImgSrcStepper1);
            // display title
            cy.dataCy('step-1')
              .find('.q-stepper__title')
              .should('be.visible')
              .and(
                'contain',
                i18n.global.t('register.challenge.titleStepPersonalDetails'),
              );
          });
      });
    });

    it('changes icons when step changes', () => {
      // active icon 1
      cy.dataCy('step-1')
        .find('img')
        .should('have.attr', 'src', activeIconImgSrcStepper1);
      cy.dataCy('step-2')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper2);
      cy.dataCy('step-3')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper3);
      cy.dataCy('step-4')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper4);
      // change step
      cy.dataCy('step-1-continue').should('be.visible').click();
      // active icon 2
      cy.dataCy('step-1')
        .find('img')
        .should('have.attr', 'src', doneIconImgSrcStepper1);
      cy.dataCy('step-2')
        .find('img')
        .should('have.attr', 'src', activeIconImgSrcStepper2);
      cy.dataCy('step-3')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper3);
      cy.dataCy('step-4')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper4);
      // change step
      cy.dataCy('step-2-continue').should('be.visible').click();
      // active icon 3
      cy.dataCy('step-1')
        .find('img')
        .should('have.attr', 'src', doneIconImgSrcStepper1);
      cy.dataCy('step-2')
        .find('img')
        .should('have.attr', 'src', doneIconImgSrcStepper2);
      cy.dataCy('step-3')
        .find('img')
        .should('have.attr', 'src', activeIconImgSrcStepper3);
      cy.dataCy('step-4')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper4);
      // change step
      cy.dataCy('step-3-continue').should('be.visible').click();
      // active icon 4
      cy.dataCy('step-1')
        .find('img')
        .should('have.attr', 'src', doneIconImgSrcStepper1);
      cy.dataCy('step-2')
        .find('img')
        .should('have.attr', 'src', doneIconImgSrcStepper2);
      cy.dataCy('step-3')
        .find('img')
        .should('have.attr', 'src', doneIconImgSrcStepper3);
      cy.dataCy('step-4')
        .find('img')
        .should('have.attr', 'src', activeIconImgSrcStepper4);
    });

    it('allows user to pass through the registration process', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          // allows for a green route pass
          cy.dataCy('step-1-continue').should('be.visible').click();
          cy.dataCy('step-2-continue').should('be.visible').click();
          cy.dataCy('step-3-continue').should('be.visible').click();
          cy.dataCy('step-4-continue').should('be.visible').click();
        });
    });
  });
});
