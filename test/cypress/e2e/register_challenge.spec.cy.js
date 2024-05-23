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
const doneIconImgSrcStepper4 = doneIcon;
// Stepper 5 imgs
const iconImgSrcStepper5 = new URL(
  '../../../src/assets/svg/numeric-5-outline.svg',
  cy.config().baseUrl,
).href;
const activeIconImgSrcStepper5 = new URL(
  '../../../src/assets/svg/numeric-5-fill.svg',
  cy.config().baseUrl,
).href;
const doneIconImgSrcStepper5 = doneIcon;
// Stepper 7 imgs
const iconImgSrcStepper6 = new URL(
  '../../../src/assets/svg/numeric-6-outline.svg',
  cy.config().baseUrl,
).href;
const activeIconImgSrcStepper6 = new URL(
  '../../../src/assets/svg/numeric-6-fill.svg',
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

    it('renders page elements', () => {
      let i18n;
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window()
          .then((win) => {
            i18n = win.i18n;
          })
          .then(() => {
            let title = '';
            if (config.challengeMonth === 'may') {
              title = i18n.global.t(
                'register.challenge.titleRegisterToChallenge.may',
              );
            } else if (config.challengeMonth === 'october') {
              title = i18n.global.t(
                'register.challenge.titleRegisterToChallenge.october',
              );
            }
            cy.dataCy('top-bar-countdown').should('be.visible');
            cy.dataCy('login-register-title')
              .should('be.visible')
              .and('have.color', config.colorWhite)
              .and('have.css', 'font-size', '24px')
              .and('have.css', 'font-weight', '700')
              .and('contain', title);
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

    it('does not change step if form is not valid', () => {
      // click when form is empty
      cy.dataCy('step-1-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // click when last name is missing
      cy.dataCy('form-firstName-input').type('John');
      cy.dataCy('step-1-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // click when terms are not checked
      cy.dataCy('form-firstName-input').type('John');
      cy.dataCy('form-lastName-input').type('Doe');
      cy.dataCy('step-1-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');

      // click when form is valid
      cy.dataCy('form-firstName-input').type('John');
      cy.dataCy('form-lastName-input').type('Doe');
      cy.dataCy('form-terms-input').click();
      cy.dataCy('step-1-continue').should('be.visible').click();
      cy.dataCy('step-2-continue').should('be.visible').click();
      // click when participation is not selected
      cy.dataCy('step-3-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // click when participation is selected
      cy.dataCy('form-field-option').first().click();
      cy.dataCy('step-3-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // click when address is not selected
      cy.dataCy('step-4-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // select company and address
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .first()
        .click();
      cy.dataCy('form-company-address-input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // click when address is selected
      cy.dataCy('step-4-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // click when team is not selected
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // click when team is selected
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio')
        .first()
        .click();
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-1').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-3').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('be.visible');
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
      cy.dataCy('step-5')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper5);
      cy.dataCy('step-6')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper6);
      // fill in form data
      cy.dataCy('form-firstName-input').type('John');
      cy.dataCy('form-lastName-input').type('Doe');
      cy.dataCy('form-nickname-input').type('Johnny');
      cy.dataCy('form-terms-input').click();
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
      cy.dataCy('step-5')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper5);
      cy.dataCy('step-6')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper6);
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
      cy.dataCy('step-5')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper5);
      cy.dataCy('step-6')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper6);
      // select participation option
      cy.dataCy('form-field-option').first().click();
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
      cy.dataCy('step-5')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper5);
      cy.dataCy('step-6')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper6);
      // select company and address
      cy.dataCy('form-select-table-company')
        .should('be.visible')
        .find('.q-radio')
        .first()
        .click();
      cy.dataCy('form-company-address-input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // change step
      cy.dataCy('step-4-continue').should('be.visible').click();
      // active icon 5
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
        .should('have.attr', 'src', doneIconImgSrcStepper4);
      cy.dataCy('step-5')
        .find('img')
        .should('have.attr', 'src', activeIconImgSrcStepper5);
      cy.dataCy('step-6')
        .find('img')
        .should('have.attr', 'src', iconImgSrcStepper6);
      // select option
      cy.dataCy('form-select-table-team')
        .should('be.visible')
        .find('.q-radio')
        .first()
        .click();
      // change step
      cy.dataCy('step-5-continue').should('be.visible').click();
      // active icon 7
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
        .should('have.attr', 'src', doneIconImgSrcStepper4);
      cy.dataCy('step-5')
        .find('img')
        .should('have.attr', 'src', doneIconImgSrcStepper5);
      cy.dataCy('step-6')
        .find('img')
        .should('have.attr', 'src', activeIconImgSrcStepper6);
    });

    it('allows user to pass back and forth through stepper', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          // allows for a green route pass
          // fill in form data
          cy.dataCy('form-firstName-input').type('John');
          cy.dataCy('form-lastName-input').type('Doe');
          cy.dataCy('form-nickname-input').type('Johnny');
          cy.dataCy('form-terms-input').click();
          cy.dataCy('step-1-continue').should('be.visible').click();
          cy.dataCy('step-2-continue').should('be.visible').click();
          // select participation option
          cy.dataCy('form-field-option').first().click();
          cy.dataCy('step-3-continue').should('be.visible').click();
          // select company and address
          cy.dataCy('form-select-table-company')
            .should('be.visible')
            .find('.q-radio')
            .first()
            .click();
          cy.dataCy('step-4-info').should('be.visible');
          cy.dataCy('step-4-info').find('i').invoke('width').should('eq', 18);
          cy.dataCy('step-4-info').find('i').invoke('height').should('eq', 18);
          cy.dataCy('step-4-info')
            .find('p')
            .should('be.visible')
            .should('have.css', 'font-size', '12px')
            .and('contain', i18n.global.t('form.company.textCoordinator'));
          cy.dataCy('form-company-address-input').click();
          // select option
          cy.get('.q-menu')
            .should('be.visible')
            .within(() => {
              cy.get('.q-item').first().click();
            });
          cy.dataCy('step-4-continue').should('be.visible').click();
          // select option
          cy.dataCy('form-select-table-team')
            .should('be.visible')
            .find('.q-radio')
            .first()
            .click();
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-6-continue')
            .should('be.visible')
            .and('contain', i18n.global.t('form.buttonCompleteRegistration'));
          // test back navigation in the stepper
          cy.dataCy('step-6-back').should('be.visible').click();
          cy.dataCy('step-5-back').should('be.visible').click();
          cy.dataCy('step-4-back').should('be.visible').click();
          cy.dataCy('step-3-back').should('be.visible').click();
          cy.dataCy('step-2-back').should('be.visible').click();
          cy.dataCy('step-1-continue').should('be.visible');
          // test using the step headers
          // go to the last step
          cy.dataCy('step-1-continue').should('be.visible').click();
          cy.dataCy('step-2-continue').should('be.visible').click();
          cy.dataCy('step-3-continue').should('be.visible').click();
          cy.dataCy('step-4-continue').should('be.visible').click();
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-6-continue').should('be.visible');
          // test goint to step 1
          cy.dataCy('step-1').should('be.visible').click();
          cy.dataCy('step-1-continue').should('be.visible');
          // go to the last step
          cy.dataCy('step-1-continue').should('be.visible').click();
          cy.dataCy('step-2-continue').should('be.visible').click();
          cy.dataCy('step-3-continue').should('be.visible').click();
          cy.dataCy('step-4-continue').should('be.visible').click();
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-6-continue').should('be.visible');
          // test goint to step 2
          cy.dataCy('step-2').should('be.visible').click();
          cy.dataCy('step-2-continue').should('be.visible');
          // go to the last step
          cy.dataCy('step-2-continue').should('be.visible').click();
          cy.dataCy('step-3-continue').should('be.visible').click();
          cy.dataCy('step-4-continue').should('be.visible').click();
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-6-continue').should('be.visible');
          // test goint to step 3
          cy.dataCy('step-3').should('be.visible').click();
          cy.dataCy('step-3-continue').should('be.visible');
          // go to the last step
          cy.dataCy('step-3-continue').should('be.visible').click();
          cy.dataCy('step-4-continue').should('be.visible').click();
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-6-continue').should('be.visible');
          // test goint to step 4
          cy.dataCy('step-4').should('be.visible').click();
          cy.dataCy('step-4-continue').should('be.visible');
          // go to the last step
          cy.dataCy('step-4-continue').should('be.visible').click();
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-6-continue').should('be.visible');
          // test goint to step 5
          cy.dataCy('step-5').should('be.visible').click();
          cy.dataCy('step-5-continue').should('be.visible');
          // go to the last step
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-6-continue').should('be.visible');
          // test goint to step 7
          cy.dataCy('step-6').should('be.visible').click();
          cy.dataCy('step-6-continue').should('be.visible');
        });
    });
  });
});
