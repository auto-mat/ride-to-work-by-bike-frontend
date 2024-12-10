import {
  testLanguageSwitcher,
  testBackgroundImage,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';

const doneIcon = new URL(
  '../../../src/assets/svg/check.svg',
  cy.config().baseUrl,
).href;
// Stepper 1 imgs
const iconImgSrcStepper1 = new URL(
  '../../../src/assets/svg/numeric-1-outline.svg',
  cy.config().baseUrl,
).href;
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
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
          // setup API intercepts
          cy.fixture('formOrganizationOptions').then(
            (formOrganizationOptions) => {
              cy.interceptSubsidiariesGetApi(
                config,
                win.i18n,
                formOrganizationOptions[0].id,
              );
              cy.interceptTeamsGetApi(
                config,
                win.i18n,
                formOrganizationOptions[0].subsidiaries[0].id,
              );
            },
          );
        });
      });
    });

    testBackgroundImage();

    it('renders login register header component', () => {
      cy.dataCy('login-register-header').should('be.visible');
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('language-switcher').should('be.visible');
    });

    // switching between languages can only be tested in E2E context
    testLanguageSwitcher();

    it('renders page elements', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
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
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
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
            .then(($el) => {
              cy.wrap(
                i18n.global.t('register.challenge.titleStepPersonalDetails'),
              ).then((translation) => {
                expect($el.text()).to.equal(translation);
              });
            });
        });
      });
    });

    it('validates first step (personal details) and shows icons', () => {
      cy.dataCy('form-personal-details').should('be.visible');
      checkActiveIcon(1);
      // click
      cy.dataCy('step-1-continue').should('be.visible').click();
      // not on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      // fill firstName
      cy.dataCy('form-firstName-input').type('John');
      // click
      cy.dataCy('step-1-continue').should('be.visible').click();
      // not on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      // fill lastName
      cy.dataCy('form-lastName-input').type('Doe');
      // click
      cy.dataCy('step-1-continue').should('be.visible').click();
      // not on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('not.exist');
      // fill gender
      cy.dataCy('form-personal-details-gender')
        .find('.q-radio__label')
        .first()
        .click();
      // click
      cy.dataCy('step-1-continue').should('be.visible').click();
      // on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
      checkActiveIcon(2);
    });

    it('validates third step (organization type)', () => {
      passToStep3();
      checkActiveIcon(3);

      cy.dataCy('step-3-continue').should('be.visible').click();
      // not on step 4
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('form-field-option').first().click();
      cy.dataCy('step-3-continue').should('be.visible').click();
      // on step 4
      cy.dataCy('step-4').find('.q-stepper__step-content').should('be.visible');
    });

    it('validates fourth step (organization and address)', () => {
      passToStep4();
      checkActiveIcon(4);

      cy.dataCy('step-4-continue').should('be.visible').click();
      // not on step 5
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      // select company
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .first()
        .click();
      // click
      cy.dataCy('step-4-continue').should('be.visible').click();
      // not on step 5
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      // select address
      cy.dataCy('form-company-address-input').click();
      // select subsidiary from dropdown
      cy.fixture('apiGetSubsidiariesResponse').then((subsidiariesResponse) => {
        cy.fixture('apiGetSubsidiariesResponseNext').then(
          (subsidiariesResponseNext) => {
            cy.get('.q-item__label')
              .should('be.visible')
              .and((opts) => {
                expect(
                  opts.length,
                  subsidiariesResponse.results.length +
                    subsidiariesResponseNext.results.length,
                );
              })
              .first()
              .click();
          },
        );
      });
      // click
      cy.dataCy('step-4-continue').should('be.visible').click();
      // on step 5
      cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
    });

    it('validates fifth step (team)', () => {
      passToStep5();
      checkActiveIcon(5);

      // Try to continue without selecting a team
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // Select a team
      cy.dataCy('form-select-table-team')
        .should('be.visible')
        .find('.q-radio')
        .first()
        .click();
      // Continue to step 6
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('be.visible');
      checkActiveIcon(6);
    });

    it('allows user to pass back and forth through stepper', () => {
      passToStep6();

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

    it('shows correct step title on organization step', () => {
      cy.get('@i18n').then((i18n) => {
        // go to step participation (organization type)
        passToStep3();
        // select company
        cy.dataCy('form-field-option')
          .contains(i18n.global.t('form.participation.labelColleagues'))
          .click();
        // title company (visible even if step is not active)
        cy.contains(i18n.global.t('form.labelCompanyShort')).should(
          'be.visible',
        );
        // no title school
        cy.contains(i18n.global.t('form.labelSchoolShort')).should('not.exist');
        // no title family
        cy.contains(i18n.global.t('form.labelFamilyShort')).should('not.exist');
        // select school
        cy.dataCy('form-field-option')
          .contains(i18n.global.t('form.participation.labelSchoolmates'))
          .click();
        // no title company
        cy.contains(i18n.global.t('form.labelCompanyShort')).should(
          'not.exist',
        );
        // title school
        cy.contains(i18n.global.t('form.labelSchoolShort')).should(
          'be.visible',
        );
        // no title family
        cy.contains(i18n.global.t('form.labelFamilyShort')).should('not.exist');
        // select family
        cy.dataCy('form-field-option')
          .contains(i18n.global.t('form.participation.labelFamily'))
          .click();
        // no title company
        cy.contains(i18n.global.t('form.labelCompanyShort')).should(
          'not.exist',
        );
        // no title school
        cy.contains(i18n.global.t('form.labelSchoolShort')).should('not.exist');
        // title family
        cy.contains(i18n.global.t('form.labelFamilyShort')).should(
          'be.visible',
        );
      });
    });
  });
});

function passToStep2() {
  cy.dataCy('form-firstName-input').type('John');
  cy.dataCy('form-lastName-input').type('Doe');
  cy.dataCy('form-personal-details-gender')
    .find('.q-radio__label')
    .first()
    .click();
  cy.dataCy('step-1-continue').should('be.visible').click();
  // on step 2
  cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
}

function passToStep3() {
  passToStep2();
  // payment - no validation
  cy.dataCy('step-2-continue').should('be.visible').click();
  // on step 3
  cy.dataCy('step-3').find('.q-stepper__step-content').should('be.visible');
}

function passToStep4() {
  passToStep3();
  cy.dataCy('form-field-option').first().click();
  cy.dataCy('step-3-continue').should('be.visible').click();
  // on step 4
  cy.dataCy('step-4').find('.q-stepper__step-content').should('be.visible');
}

function passToStep5() {
  passToStep4();
  // select company
  cy.dataCy('form-select-table-company')
    .should('be.visible')
    .find('.q-radio')
    .first()
    .click();
  // select address
  cy.dataCy('form-company-address-input').click();
  // select option
  cy.get('.q-menu')
    .should('be.visible')
    .within(() => {
      cy.get('.q-item').first().click();
    });
  cy.dataCy('step-4-continue').should('be.visible').click();
  // on step 5
  cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
}

function passToStep6() {
  passToStep5();
  // select a team
  cy.dataCy('form-select-table-team')
    .should('be.visible')
    .find('.q-radio')
    .first()
    .click();
  cy.dataCy('step-5-continue').should('be.visible').click();
  // on step 6
  cy.dataCy('step-6').find('.q-stepper__step-content').should('be.visible');
}

function checkActiveIcon(activeStep) {
  const steps = [1, 2, 3, 4, 5, 6];
  steps.forEach((step) => {
    let expectedSrc;
    if (step === activeStep) {
      expectedSrc =
        step === 1
          ? activeIconImgSrcStepper1
          : step === 2
            ? activeIconImgSrcStepper2
            : step === 3
              ? activeIconImgSrcStepper3
              : step === 4
                ? activeIconImgSrcStepper4
                : step === 5
                  ? activeIconImgSrcStepper5
                  : activeIconImgSrcStepper6; // for step 6
    } else if (step < activeStep) {
      expectedSrc =
        step === 1
          ? doneIconImgSrcStepper1
          : step === 2
            ? doneIconImgSrcStepper2
            : step === 3
              ? doneIconImgSrcStepper3
              : step === 4
                ? doneIconImgSrcStepper4
                : doneIconImgSrcStepper5;
    } else {
      expectedSrc =
        step === 1
          ? iconImgSrcStepper1
          : step === 2
            ? iconImgSrcStepper2
            : step === 3
              ? iconImgSrcStepper3
              : step === 4
                ? iconImgSrcStepper4
                : step === 5
                  ? iconImgSrcStepper5
                  : iconImgSrcStepper6; // for step 6
    }

    cy.dataCy(`step-${step}`)
      .find('img')
      .should('have.attr', 'src', expectedSrc);
  });
}
