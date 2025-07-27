import {
  interceptOrganizationsApi,
  testLanguageSwitcher,
  testBackgroundImage,
  interceptRegisterCoordinatorApi,
  systemTimeChallengeActive,
  systemTimeBeforeCompetitionStart,
  systemTimeRegistrationPhase1May,
  systemTimeRegistrationPhaseInactive,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { OrganizationType } from '../../../src/components/types/Organization';
import { getRadioOption } from 'test/cypress/utils';
import { PaymentSubject } from 'src/components/enums/Payment';
import { defLocale } from '../../../src/i18n/def_locale';
import { getCurrentPriceLevelsUtil } from '../../../src/utils/price_levels';
import { PriceLevelCategory } from '../../../src/components/enums/Challenge';
import { HttpStatusCode } from 'axios';
import { calculateCountdownIntervals } from '../../../src/utils';

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
// Stepper 6 imgs
const iconImgSrcStepper6 = new URL(
  '../../../src/assets/svg/numeric-6-outline.svg',
  cy.config().baseUrl,
).href;
const activeIconImgSrcStepper6 = new URL(
  '../../../src/assets/svg/numeric-6-fill.svg',
  cy.config().baseUrl,
).href;
const doneIconImgSrcStepper6 = doneIcon;
// Stepper 7 imgs
const iconImgSrcStepper7 = new URL(
  '../../../src/assets/svg/numeric-7-outline.svg',
  cy.config().baseUrl,
).href;
const activeIconImgSrcStepper7 = new URL(
  '../../../src/assets/svg/numeric-7-fill.svg',
  cy.config().baseUrl,
).href;
const doneIconImgSrcStepper7 = doneIcon;

let prices;
let paymentAmountDonation;

describe('Register Challenge page', () => {
  let defaultPaymentAmountMin = 0;

  before(() => {
    // dynamically load default payment amount from fixture
    //cy.clock(new Date(systemTimeChallengeActive), ['Date']).then(( => ))
    cy.fixture('apiGetThisCampaign.json').then((response) => {
      const priceLevels = response.results[0].price_level;
      const currentPriceLevels = getCurrentPriceLevelsUtil(
        priceLevels,
        new Date(systemTimeChallengeActive),
      );
      defaultPaymentAmountMin =
        currentPriceLevels[PriceLevelCategory.basic].price;
    });
    cy.task('getAppConfig', process).then((config) => {
      prices = config.entryFeePaymentOptions.split(',');
      paymentAmountDonation = prices[0];
    });
  });

  beforeEach(() => {
    cy.task('getAppConfig', process).then((config) => {
      cy.interceptMyTeamGetApi(config, defLocale);
      cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
        (response) => {
          cy.interceptIsUserOrganizationAdminGetApi(
            config,
            defLocale,
            response,
          );
        },
      );
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.interceptRegisterChallengeGetApi(config, defLocale);
        cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.dataCy('challenge-inactive-info').should('be.visible');
        cy.waitForThisCampaignApi();
        // config is defined without hash in the URL
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
          // setup API intercepts
          cy.fixture('formOrganizationOptions').then(
            (formOrganizationOptions) => {
              interceptOrganizationsApi(
                config,
                win.i18n,
                OrganizationType.company,
              );
              cy.interceptCitiesGetApi(config, win.i18n);
              cy.interceptSubsidiariesGetApi(
                config,
                win.i18n,
                formOrganizationOptions[0].id,
              );
              // intercept query for subsidiaries of second organization
              cy.interceptSubsidiariesGetApi(
                config,
                win.i18n,
                formOrganizationOptions[1].id,
              );
              cy.interceptSubsidiaryPostApi(
                config,
                win.i18n,
                formOrganizationOptions[0].id,
              );
              cy.fixture('formFieldCompanyCreate.json').then((response) => {
                cy.interceptSubsidiaryPostApi(config, win.i18n, response.id);
              });
              // intercept teams for first subsidiary
              cy.interceptTeamsGetApi(
                config,
                win.i18n,
                formOrganizationOptions[0].subsidiaries[0].id,
              );
              // intercept teams for second subsidiary
              cy.interceptTeamsGetApi(
                config,
                win.i18n,
                formOrganizationOptions[0].subsidiaries[1].id,
              );
              cy.interceptTeamPostApi(
                config,
                win.i18n,
                formOrganizationOptions[0].subsidiaries[0].id,
              );
              interceptOrganizationsApi(
                config,
                win.i18n,
                OrganizationType.company,
              );
              interceptOrganizationsApi(
                config,
                win.i18n,
                OrganizationType.school,
              );
              cy.interceptMerchandiseGetApi(config, win.i18n);
              cy.fixture('formFieldCompany').then(
                (formFieldCompanyResponse) => {
                  // for first organization, intercept API call with response true
                  cy.fixture('apiGetHasOrganizationAdminResponseTrue').then(
                    (response) => {
                      cy.interceptHasOrganizationAdminGetApi(
                        config,
                        win.i18n,
                        formFieldCompanyResponse.results[0].id,
                        response,
                      );
                    },
                  );
                  // for second organization, intercept API call with response false
                  cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
                    (response) => {
                      cy.interceptHasOrganizationAdminGetApi(
                        config,
                        win.i18n,
                        formFieldCompanyResponse.results[1].id,
                        response,
                      );
                    },
                  );
                },
              );
              // intercept with default "payment_status": "none"
              cy.fixture(
                'apiPostRegisterChallengeResponsePaymentNone.json',
              ).then((registerChallengeResponse) => {
                cy.interceptRegisterChallengePostApi(
                  config,
                  win.i18n,
                  registerChallengeResponse,
                );
              });
              cy.interceptMerchandiseNoneGetApi(config, win.i18n);
              cy.interceptIpAddressGetApi(config);
              cy.interceptPayuCreateOrderPostApi(config, win.i18n);
              interceptRegisterCoordinatorApi(config, win.i18n);
            },
          );
        });
      });
    });

    testBackgroundImage();

    it('renders login register header component', () => {
      cy.dataCy('login-register-header').should('be.visible');
      // TODO: enable when help dialog is implemented
      cy.dataCy('button-help').should('not.exist');
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

    it('renders step names', () => {
      cy.get('@i18n').then((i18n) => {
        // step 1: personal details
        cy.contains(
          i18n.global.t('register.challenge.titleStepPersonalDetails'),
        ).should('be.visible');
        // step 2: payment
        cy.contains(
          i18n.global.t('register.challenge.titleStepPayment'),
        ).should('be.visible');
        // step 3: participation
        cy.contains(
          i18n.global.t('register.challenge.titleStepParticipation'),
        ).should('be.visible');
        // step 4: organization
        cy.contains(i18n.global.t('form.labelCompanyShort')).should(
          'be.visible',
        );
        // step 5: team
        cy.contains(i18n.global.t('register.challenge.titleStepTeam')).should(
          'be.visible',
        );
        // step 6: merch
        cy.contains(i18n.global.t('register.challenge.titleStepMerch')).should(
          'be.visible',
        );
        // step 7: summary
        cy.contains(
          i18n.global.t('register.challenge.titleStepSummary'),
        ).should('be.visible');
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
      // agree with terms
      cy.dataCy('form-personal-details-terms')
        .find('.q-checkbox__inner')
        .first()
        .click();
      // click
      cy.dataCy('step-1-continue').should('be.visible').click();
      // on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
      checkActiveIcon(2);
    });

    it('sends correct API payload when empty nickname', () => {
      cy.dataCy('form-personal-details').should('be.visible');
      // fill firstName
      cy.dataCy('form-firstName-input').type('John');
      // fill lastName
      cy.dataCy('form-lastName-input').type('Doe');
      // skip nickname
      // fill gender
      cy.dataCy('form-personal-details-gender')
        .find('.q-radio__label')
        .first()
        .click();
      // skip newsletter
      // agree with terms
      cy.dataCy('form-personal-details-terms')
        .find('.q-checkbox__inner')
        .first()
        .click();
      // click
      cy.dataCy('step-1-continue').should('be.visible').click();
      // wait for request
      cy.fixture('apiPostRegisterChallengePersonalDetailsNoNickname').then(
        (testData) => {
          cy.waitForRegisterChallengePostApi(testData);
        },
      );
    });

    it('sends correct create order request for different payment configurations', () => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiPostPayuCreateOrderResponseNoRedirect.json').then(
            (responseBody) => {
              /**
               * Intercept create order with no redirect so that we can test all
               * options in a single test.
               */
              cy.fixture('apiPostPayuCreateOrderResponseNoRedirect.json').then(
                (responseBody) => {
                  cy.interceptPayuCreateOrderPostApi(
                    config,
                    i18n,
                    responseBody,
                  );
                },
              );
              /**
               * Case: Individual payment - min amount
               */
              cy.passToStep2();
              // select individual payment
              cy.dataCy(getRadioOption(PaymentSubject.individual))
                .should('be.visible')
                .click();
              // select default amount
              cy.dataCy(getRadioOption(defaultPaymentAmountMin))
                .should('be.visible')
                .click();
              // click submit payment
              cy.dataCy('step-2-submit-payment').should('be.visible').click();
              // wait for request and check payload
              cy.fixture(
                'apiPostPayuCreateOrderRequestIndividualNoDonation.json',
              ).then((requestBody) => {
                cy.waitForPayuCreateOrderPostApi(requestBody, responseBody);
              });
              /**
               * Case: Individual payment + donation
               */
              cy.dataCy(getRadioOption(paymentAmountDonation))
                .should('be.visible')
                .click();
              // click submit payment
              cy.dataCy('step-2-submit-payment').should('be.visible').click();
              cy.fixture(
                'apiPostPayuCreateOrderRequestIndividualWithDonation.json',
              ).then((requestBody) => {
                cy.waitForPayuCreateOrderPostApi(requestBody, responseBody);
              });
              /**
               * Case voucher HALF - min amount
               */
              // select voucher payment
              cy.dataCy(getRadioOption(PaymentSubject.voucher))
                .should('be.visible')
                .click();
              // apply voucher HALF
              cy.applyHalfVoucher(config, i18n, defaultPaymentAmountMin);
              // min amount is selected - submit payment
              cy.dataCy('step-2-submit-payment').should('be.visible').click();
              cy.fixture(
                'apiPostPayuCreateOrderRequestVoucherHalfNoDonation.json',
              ).then((requestBody) => {
                cy.waitForPayuCreateOrderPostApi(requestBody, responseBody);
              });
              /**
               * Case voucher HALF + donation
               */
              // select higher amount
              cy.dataCy(getRadioOption(paymentAmountDonation))
                .should('be.visible')
                .click();
              // submit payment
              cy.dataCy('step-2-submit-payment').should('be.visible').click();
              cy.fixture(
                'apiPostPayuCreateOrderRequestVoucherHalfWithDonation.json',
              ).then((requestBody) => {
                cy.waitForPayuCreateOrderPostApi(requestBody, responseBody);
              });
              /**
               * Case voucher FULL + donation
               */
              // remove voucher
              cy.dataCy('voucher-button-remove').should('be.visible').click();
              // apply voucher FULL
              cy.applyFullVoucher(config, i18n);
              // add donation (default donation = defaultPaymentAmountMin)
              cy.dataCy('form-field-donation-checkbox').click();
              // submit payment
              cy.dataCy('step-2-submit-payment').should('be.visible').click();
              cy.fixture(
                'apiPostPayuCreateOrderRequestVoucherFullWithDonation.json',
              ).then((requestBody) => {
                cy.waitForPayuCreateOrderPostApi(requestBody, responseBody);
              });
              /**
               * Case company + donation
               */
              // select company payment
              cy.dataCy(getRadioOption(PaymentSubject.company))
                .should('be.visible')
                .click();
              // default donation stays - submit payment
              cy.dataCy('step-2-submit-payment').should('be.visible').click();
              cy.fixture(
                'apiPostPayuCreateOrderRequestCompanyWithDonation.json',
              ).then((requestBody) => {
                cy.waitForPayuCreateOrderPostApi(requestBody, responseBody);
              });
              /**
               * Case school + donation
               */
              // select school payment
              cy.dataCy(getRadioOption(PaymentSubject.school))
                .should('be.visible')
                .click();
              // default donation stays - submit payment
              cy.dataCy('step-2-submit-payment').should('be.visible').click();
              // should be identical to company request
              cy.fixture(
                'apiPostPayuCreateOrderRequestSchoolWithDonation.json',
              ).then((requestBody) => {
                cy.waitForPayuCreateOrderPostApi(requestBody, responseBody);
              });
            },
          );
        });
      });
    });

    it('allows to post company coordinator registration', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
            (response) => {
              // user status should reload
              cy.waitForIsUserOrganizationAdminApi(response);
            },
          );
          cy.passToStep2();
          // select company
          cy.dataCy(getRadioOption(OrganizationType.company)).click();
          // select paying company (required)
          cy.fixture('formFieldCompany').then((formFieldCompany) => {
            cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
              cy.dataCy('form-field-company').find('.q-field__append').click();
              // select option without coordinator
              cy.get('.q-item__label')
                .should('be.visible')
                .and((opts) => {
                  expect(
                    opts.length,
                    formFieldCompany.results.length +
                      formFieldCompanyNext.results.length,
                  );
                })
                .eq(1)
                .click();
              cy.get('.q-menu').should('not.exist');
            });
          });
          cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
            (response) => {
              cy.waitForHasOrganizationAdminApi(response);
            },
          );
          // click the coordinator checkbox
          cy.dataCy('register-coordinator-checkbox')
            .should('be.visible')
            .click();
          cy.fixture('apiPostRegisterCoordinatorRequest').then(
            (formRegisterCoordinatorData) => {
              // fill in the register coordinator form
              cy.dataCy('register-coordinator-job-title')
                .find('input')
                .type(formRegisterCoordinatorData.jobTitle);
              cy.dataCy('register-coordinator-phone')
                .find('input')
                .type(formRegisterCoordinatorData.phone);
              // enable checkbox responsibility
              cy.dataCy('register-coordinator-responsibility')
                .find('.q-checkbox')
                .click();
              // enable checkbox terms
              cy.dataCy('register-coordinator-terms')
                .find('.q-checkbox')
                .click();
              cy.fixture('formFieldCompany').then(
                (formFieldCompanyResponse) => {
                  cy.fixture('apiGetHasOrganizationAdminResponseTrue').then(
                    (responseHasOrganizationAdmin) => {
                      cy.fixture(
                        'apiGetIsUserOrganizationAdminResponseTrue',
                      ).then((responseIsUserOrganizationAdmin) => {
                        /**
                         * Before submitting coordinator application intercept
                         * hasOrganizationAdmin request to return true.
                         */
                        cy.interceptHasOrganizationAdminGetApi(
                          config,
                          i18n,
                          formFieldCompanyResponse.results[1].id,
                          responseHasOrganizationAdmin,
                        );
                        // also intercept isUserOrganizationAdmin API
                        cy.interceptIsUserOrganizationAdminGetApi(
                          config,
                          i18n,
                          responseIsUserOrganizationAdmin,
                        );
                        // go to next step
                        cy.dataCy('step-2-continue')
                          .should('be.visible')
                          .click();
                        // wait for request
                        cy.waitForRegisterCoordinatorPostApi();
                        // verify that we are on step 3
                        cy.dataCy('step-3')
                          .find('.q-stepper__step-content')
                          .should('be.visible');
                        // go back a step
                        cy.dataCy('step-3-back').should('be.visible').click();
                        // user status should reload
                        cy.waitForIsUserOrganizationAdminApi(
                          responseIsUserOrganizationAdmin,
                        );
                        cy.waitForHasOrganizationAdminApi(
                          responseHasOrganizationAdmin,
                        );
                        // verify that company no longer has the option coordinator
                        cy.dataCy('register-coordinator-checkbox').should(
                          'not.exist',
                        );
                      });
                    },
                  );
                },
              );
            },
          );
        });
      });
    });

    it('validates third step (organization type)', () => {
      cy.passToStep3();
      checkActiveIcon(3);

      cy.dataCy('step-3-continue').should('be.visible').click();
      // not on step 4
      cy.dataCy('step-4').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('form-field-option').first().click();
      cy.dataCy('step-3-continue').should('be.visible').click();
      // on step 4
      cy.dataCy('step-4').find('.q-stepper__step-content').should('be.visible');
    });

    it('pre-selects company in step 3 based on payment subject', () => {
      cy.get('@i18n').then((i18n) => {
        cy.passToStep2();
        // in payment step, select "paid by company"
        cy.dataCy(getRadioOption(OrganizationType.company))
          .should('be.visible')
          .click();
        // select paying company (required)
        cy.selectRegisterChallengePayingOrganization();
        // go to next step "organization type"
        cy.dataCy('step-2-continue').should('be.visible').click();
        // option "company" is selected
        cy.dataCy('form-field-option-group')
          .find('.q-radio__inner.q-radio__inner--truthy')
          .siblings('.q-radio__label')
          .should(
            'contain',
            i18n.global.t('form.participation.labelColleagues'),
          );
      });
    });

    it('pre-selects school in step 3 based on payment subject', () => {
      cy.get('@i18n').then((i18n) => {
        cy.passToStep2();
        // in payment step, select "paid by school"
        cy.dataCy(getRadioOption(OrganizationType.school))
          .should('be.visible')
          .click();
        // select paying school (required)
        cy.selectRegisterChallengePayingOrganization();
        // go to next step "organization type"
        cy.dataCy('step-2-continue').should('be.visible').click();
        // option "school" is selected
        cy.dataCy('form-field-option-group')
          .find('.q-radio__inner.q-radio__inner--truthy')
          .siblings('.q-radio__label')
          .should(
            'contain',
            i18n.global.t('form.participation.labelSchoolmates'),
          );
      });
    });

    it('validates fourth step (organization and address)', () => {
      cy.passToStep4();
      checkActiveIcon(4);

      cy.dataCy('step-4-continue').should('be.visible').click();
      // not on step 5
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      // select company
      cy.dataCy('form-select-table-option')
        .find('.q-radio__label')
        .first()
        .click();
      // click
      cy.dataCy('step-4-continue').should('be.visible').click();
      // not on step 5
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      // select address
      cy.dataCy('form-company-address').find('.q-field__append').last().click();
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

    it('allows user to create a new subsidiary address', () => {
      cy.passToStep4();
      checkActiveIcon(4);
      // select company
      cy.dataCy('form-select-table-option')
        .find('.q-radio__label')
        .first()
        .click();
      cy.fixture('apiPostSubsidiaryRequest').then((subsidiaryRequest) => {
        cy.fixture('apiPostSubsidiaryResponse').then((subsidiaryResponse) => {
          // open dialog
          cy.dataCy('button-add-address').click();
          cy.dataCy('dialog-add-address').should('be.visible');
          // fill the form
          cy.dataCy('form-add-subsidiary').within(() => {
            cy.dataCy('form-add-subsidiary-street').type(
              subsidiaryRequest.address.street,
            );
            cy.dataCy('form-add-subsidiary-house-number').type(
              subsidiaryRequest.address.street_number,
            );
            cy.dataCy('form-add-subsidiary-city').type(
              subsidiaryRequest.address.city,
            );
            cy.dataCy('form-add-subsidiary-zip').type(
              subsidiaryRequest.address.psc,
            );
            cy.dataCy('form-add-subsidiary-department').type(
              subsidiaryRequest.address.recipient,
            );
            // select city challenge
            cy.dataCy('form-add-subsidiary-city-challenge').click();
          });
          // select city challenge (outside the form)
          cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
            cy.get('.q-menu').within(() => {
              cy.contains(citiesResponse.results[0].name)
                .should('be.visible')
                .click();
            });
          });
          // submit form
          cy.dataCy('dialog-button-submit').click();
          // wait for API response
          cy.waitForSubsidiaryPostApi(subsidiaryResponse);
          // verify dialog was closed
          cy.dataCy('dialog-add-address').should('not.exist');
          // verify the new address is selected in the dropdown
          cy.dataCy('form-company-address')
            .find('.q-field__input')
            .invoke('val')
            .should('contain', subsidiaryRequest.address.street);
          // verify we can proceed to step 5
          cy.dataCy('step-4-continue').click();
          cy.dataCy('step-5')
            .find('.q-stepper__step-content')
            .should('be.visible');
        });
      });
    });

    it('validates fifth step (team)', () => {
      cy.passToStep5();
      checkActiveIcon(5);

      // Try to continue without selecting a team
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('not.exist');
      // Select a team
      cy.dataCy('form-select-table-team')
        .should('be.visible')
        .find('.q-radio:not(.disabled)')
        .first()
        .click();
      // Continue to step 6
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-5').find('.q-stepper__step-content').should('not.exist');
      cy.dataCy('step-6').find('.q-stepper__step-content').should('be.visible');
      checkActiveIcon(6);
    });

    it('validates sixth step (merch)', () => {
      cy.get('@i18n').then((i18n) => {
        cy.passToStep6();
        checkActiveIcon(6);
        // by default, next step button is disabled
        cy.dataCy('step-6-continue').should('be.visible').and('be.disabled');
        // check no merch checkbox
        cy.dataCy('form-merch-no-merch-checkbox').should('be.visible').click();
        cy.waitForMerchandiseNoneApi();
        // Check size conversion char URL link
        cy.dataCy('form-merch-size-conversion-chart-link')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('form.merch.labelUrlSizeConversionChartLink'),
          )
          .click();
        // next step button is enabled
        cy.dataCy('step-6-continue')
          .should('be.visible')
          .and('not.be.disabled')
          .click();
        // validation does not pass (phone is required)
        cy.dataCy('step-6')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // uncheck no merch checkbox
        cy.dataCy('form-merch-no-merch-checkbox').should('be.visible').click();
        // next step button is disabled
        cy.dataCy('step-6-continue').should('be.visible').and('be.disabled');
        /**
         * DISABLE THIS PART OF THE TEST FOR THE CHROMIUM WEB BROWSER FAMILY
         * RUNNING ONLY IN THE HEADLESS MODE, BEACAUSE IT IS FAILS
         *
         * ERROR MESSAGE:
         *
         * ```
         *  AssertionError: Timed out retrying after 60000ms: expected '<span>' to be 'visible'
         *
         *  This element `<span>` is not visible because its parent
         *
         * `<div.q-dialog__inner.flex.no-pointer-events.q-dialog__inner--minimized.q-dialog__inner
         * --standard.fixed-full.flex-center.q-dialog__inner--square.q-transition--scale-enter-from.q-transition
         * --scale-enter-active>` has CSS property: `opacity: 0` at Context.eval
         *
         * (webpack://ride-to-work-by-bike/./test/cypress/e2e/register_challenge.spec.cy.js:881:35)
         * ```
         */
        if (
          Cypress.browser.family !== 'chromium' &&
          Cypress.browser.isHeadless === true
        ) {
          // select size
          cy.fixture('apiGetMerchandiseResponse').then((response) => {
            const item = response.results[0];
            // open dialog
            cy.dataCy('form-card-merch-female')
              .first()
              .find('[data-cy="button-more-info"]')
              .click();
            cy.dataCy('dialog-merch')
              .should('be.visible')
              .within(() => {
                cy.contains(item.name).should('be.visible');
                cy.contains(item.description).should('be.visible');
              });
            cy.dataCy('slider-merch').should('be.visible');
            // close dialog
            cy.dataCy('dialog-close').click();
            // first option is selected
            cy.dataCy('form-card-merch-female')
              .first()
              .find('[data-cy="button-selected"]')
              .should('be.visible');
            cy.dataCy('form-card-merch-female')
              .first()
              .find('[data-cy="button-more-info"]')
              .should('not.exist');
          });
          // next step button is enabled
          cy.dataCy('step-6-continue')
            .should('be.visible')
            .and('not.be.disabled')
            .click();
          // validation does not pass (phone is required)
          cy.dataCy('step-6')
            .find('.q-stepper__step-content')
            .should('be.visible');
          // phone error message is shown
          cy.contains(
            i18n.global.t('form.messageFieldRequired', {
              fieldName: i18n.global.t('form.labelPhone'),
            }),
          ).should('be.visible');
          // fill in phone number
          cy.fixture('apiPostRegisterChallengeMerchandiseRequest').then(
            (request) => {
              cy.dataCy('form-merch-phone-input')
                .find('input')
                .type(request.telephone);
            },
          );
          // next step button is enabled
          cy.dataCy('step-6-continue')
            .should('be.visible')
            .and('not.be.disabled')
            .click();
          // go to next step
          cy.dataCy('step-6')
            .find('.q-stepper__step-content')
            .should('not.exist');
          cy.dataCy('step-7')
            .find('.q-stepper__step-content')
            .should('be.visible');
        }
      });
    });

    it('allows user to create a new team', () => {
      cy.passToStep5();
      checkActiveIcon(5);

      // use formOrganizationOptions to get subsidiary id
      // get team post request/response data fixture
      cy.fixture('apiPostTeamRequest').then((teamRequest) => {
        cy.fixture('apiPostTeamResponse').then((teamResponse) => {
          // create new team
          cy.dataCy('form-select-table-team').within(() => {
            cy.dataCy('button-add-option').click();
          });
          cy.dataCy('dialog-add-option').should('be.visible');
          cy.dataCy('form-add-team-name').find('input').type(teamRequest.name);
          // get teams fixture data to compare with updated list
          cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
            cy.fixture('apiGetTeamsResponseNext').then((teamsResponseNext) => {
              // submit form
              cy.dataCy('dialog-button-submit').click();
              // wait for POST and subsequent GET
              cy.waitForTeamPostApi();
              // verify dialog closed
              cy.dataCy('dialog-add-option').should('not.exist');
              // verify new team appears in the list
              cy.dataCy('form-select-table-team')
                .find('.q-radio__label')
                .should(
                  'have.length',
                  teamsResponse.results.length +
                    teamsResponseNext.results.length +
                    1,
                )
                .and('contain', teamResponse.name);
              // new team is selected
              cy.dataCy('form-select-table-team')
                .find('.q-radio__inner.q-radio__inner--truthy')
                .siblings('.q-radio__label')
                .should('contain', teamResponse.name);
            });
          });
        });
      });
    });

    it('allows user to pass back and forth through stepper', () => {
      cy.passToStep7();

      // test back navigation in the stepper
      cy.dataCy('step-7-back').should('be.visible').click();
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
      cy.dataCy('step-6-continue').should('be.visible').click();
      cy.dataCy('step-7-continue').should('be.visible');
      // test going to step 1
      cy.dataCy('step-1').should('be.visible').click();
      cy.dataCy('step-1-continue').should('be.visible');
      // go to the last step
      cy.dataCy('step-1-continue').should('be.visible').click();
      cy.dataCy('step-2-continue').should('be.visible').click();
      cy.dataCy('step-3-continue').should('be.visible').click();
      cy.dataCy('step-4-continue').should('be.visible').click();
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-6-continue').should('be.visible').click();
      cy.dataCy('step-7-continue').should('be.visible');
      // test going to step 2
      cy.dataCy('step-2').should('be.visible').click();
      cy.dataCy('step-2-continue').should('be.visible');
      // go to the last step
      cy.dataCy('step-2-continue').should('be.visible').click();
      cy.dataCy('step-3-continue').should('be.visible').click();
      cy.dataCy('step-4-continue').should('be.visible').click();
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-6-continue').should('be.visible').click();
      cy.dataCy('step-7-continue').should('be.visible');
      // test going to step 3
      cy.dataCy('step-3').should('be.visible').click();
      cy.dataCy('step-3-continue').should('be.visible');
      // go to the last step
      cy.dataCy('step-3-continue').should('be.visible').click();
      cy.dataCy('step-4-continue').should('be.visible').click();
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-6-continue').should('be.visible').click();
      cy.dataCy('step-7-continue').should('be.visible');
      // test going to step 4
      cy.dataCy('step-4').should('be.visible').click();
      cy.dataCy('step-4-continue').should('be.visible');
      // go to the last step
      cy.dataCy('step-4-continue').should('be.visible').click();
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-6-continue').should('be.visible').click();
      cy.dataCy('step-7-continue').should('be.visible');
      // test going to step 5
      cy.dataCy('step-5').should('be.visible').click();
      cy.dataCy('step-5-continue').should('be.visible');
      // go to the last step
      cy.dataCy('step-5-continue').should('be.visible').click();
      cy.dataCy('step-6-continue').should('be.visible').click();
      cy.dataCy('step-7-continue').should('be.visible');
      // test going to step 6
      cy.dataCy('step-6').should('be.visible').click();
      cy.dataCy('step-6-continue').should('be.visible');
      // go to the last step
      cy.dataCy('step-6-continue').should('be.visible').click();
      cy.dataCy('step-7-continue').should('be.visible');
    });

    it('allows user to apply voucher HALF', () => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep2();
          // switch to paying via voucher
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // apply voucher HALF
          cy.applyHalfVoucher(config, i18n, defaultPaymentAmountMin).then(
            (discountAmount) => {
              // discounted price is shown as option
              cy.dataCy(getRadioOption(discountAmount)).should('be.visible');
              // discounted total price is shown
              cy.dataCy('total-price-value').should('contain', discountAmount);
            },
          );
        });
      });
    });

    it('allows user to apply voucher FULL', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep2();
          // switch to paying via voucher
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // apply voucher FULL
          cy.applyFullVoucher(config, i18n);
          // total price is not shown
          cy.dataCy('total-price-value').should('not.exist');
        });
      });
    });

    it('when company pays - disables other participation options', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@allOrganizations').then((allOrganizations) => {
          // go to payment step
          cy.passToStep2();
          // select company
          cy.dataCy(getRadioOption(PaymentSubject.company))
            .should('be.visible')
            .click();
          // select paying company (required)
          cy.selectRegisterChallengePayingOrganization();
          // go to next step
          cy.dataCy('step-2-continue').should('be.visible').click();
          // other participation options are disabled
          cy.dataCy('form-field-option-group').within(() => {
            // one active option - company
            cy.get('.q-radio:not(.disabled)')
              .should('have.length', 1)
              .and(
                'contain',
                i18n.global.t('form.participation.labelColleagues'),
              );
            // two disabled options - school and family
            cy.get('.q-radio.disabled')
              .should('have.length', 2)
              .and(
                'contain',
                i18n.global.t('form.participation.labelSchoolmates'),
              )
              .and('contain', i18n.global.t('form.participation.labelFamily'));
          });
          // go to next step
          cy.dataCy('step-3-continue').should('be.visible').click();
          // organization #1 is preselected
          cy.dataCy('form-select-table-company')
            .find('.q-radio__inner.q-radio__inner--truthy')
            .siblings('.q-radio__label')
            .should('contain', allOrganizations[0].name);
          // all other options are disabled
          cy.dataCy('form-select-table-company')
            .find('.q-radio.disabled')
            .should('have.length', allOrganizations.length - 1);
          // select address
          cy.fixture('apiGetSubsidiariesResponse.json').then(
            (apiGetSubsidiariesResponse) => {
              cy.fixture('apiGetSubsidiariesResponseNext.json').then(
                (apiGetSubsidiariesResponseNext) => {
                  cy.waitForSubsidiariesApi(
                    apiGetSubsidiariesResponse,
                    apiGetSubsidiariesResponseNext,
                  );
                },
              );
            },
          );
          // select address
          cy.dataCy('form-company-address')
            .find('.q-field__append')
            .last()
            .click();
          // select option
          cy.get('.q-menu')
            .should('be.visible')
            .within(() => {
              cy.get('.q-item').first().click();
            });
          // go back to step 3
          cy.dataCy('step-4-back').should('be.visible').click();
          // go back to step 2
          cy.dataCy('step-3-back').should('be.visible').click();
          // select payment subject school
          cy.dataCy(getRadioOption(PaymentSubject.school))
            .should('be.visible')
            .click();
          // open organization select
          cy.selectRegisterChallengePayingOrganization(1);
          // go to next step
          cy.dataCy('step-2-continue').should('be.visible').click();
          // other participation options are disabled
          cy.dataCy('form-field-option-group').within(() => {
            // one active option - school
            cy.get('.q-radio:not(.disabled)')
              .should('have.length', 1)
              .and(
                'contain',
                i18n.global.t('form.participation.labelSchoolmates'),
              );
            // two disabled options - company and family
            cy.get('.q-radio.disabled')
              .should('have.length', 2)
              .and(
                'contain',
                i18n.global.t('form.participation.labelColleagues'),
              )
              .and('contain', i18n.global.t('form.participation.labelFamily'));
          });
          // go to next step
          cy.dataCy('step-3-continue').should('be.visible').click();
          // organization #2 is preselected
          cy.get('@allOrganizations').then((allOrganizations) => {
            cy.dataCy('form-select-table-company')
              .find('.q-radio__inner.q-radio__inner--truthy')
              .siblings('.q-radio__label')
              .should('contain', allOrganizations[1].name);
          });
          // all other options are disabled
          cy.dataCy('form-select-table-company')
            .find('.q-radio.disabled')
            .should('have.length', allOrganizations.length - 1);
          // address is cleared
          cy.dataCy('form-company-address')
            .find('input')
            .should('have.value', '');
        });
      });
    });

    it('when school pays - disables other participation options', () => {
      cy.get('@i18n').then((i18n) => {
        cy.get('@allOrganizations').then((allOrganizations) => {
          // go to payment step
          cy.passToStep2();
          // select school
          cy.dataCy(getRadioOption(PaymentSubject.school))
            .should('be.visible')
            .click();
          // select paying school (required)
          cy.selectRegisterChallengePayingOrganization();
          // go to next step
          cy.dataCy('step-2-continue').should('be.visible').click();
          // other participation options are disabled
          cy.dataCy('form-field-option-group').within(() => {
            // one active option - school
            cy.get('.q-radio:not(.disabled)')
              .should('have.length', 1)
              .and(
                'contain',
                i18n.global.t('form.participation.labelSchoolmates'),
              );
            // two disabled options - company and family
            cy.get('.q-radio.disabled')
              .should('have.length', 2)
              .and(
                'contain',
                i18n.global.t('form.participation.labelColleagues'),
              )
              .and('contain', i18n.global.t('form.participation.labelFamily'));
          });
          // go to next step
          cy.dataCy('step-3-continue').should('be.visible').click();
          // organization #1 is preselected
          cy.dataCy('form-select-table-company')
            .find('.q-radio__inner.q-radio__inner--truthy')
            .siblings('.q-radio__label')
            .should('contain', allOrganizations[0].name);
          // all other options are disabled
          cy.dataCy('form-select-table-company')
            .find('.q-radio.disabled')
            .should('have.length', allOrganizations.length - 1);
        });
      });
    });

    it('when individual payment - all participation options are enabled', () => {
      // go to payment step
      cy.passToStep2();
      // select individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      cy.dataCy(getRadioOption(paymentAmountDonation)).click();
      // submit payment
      cy.dataCy('step-2-submit-payment').should('be.visible').click();
      cy.waitForPayuCreateOrderPostApi();
    });

    it('when voucher payment - all participation options are enabled', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // go to payment step
          cy.passToStep2();
          // select voucher
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // enter voucher code
          cy.applyFullVoucher(config, i18n);
          // go to next step
          cy.dataCy('step-2-continue').should('be.visible').click();
          // verify step 3
          cy.dataCy('step-3')
            .find('.q-stepper__step-content')
            .should('be.visible');
          // all options are enabled
          cy.dataCy('form-field-option-group').within(() => {
            cy.get('.q-radio:not(.disabled)').should('have.length', 3);
          });
        });
      });
    });

    it('shows correct step title on organization step', () => {
      cy.get('@i18n').then((i18n) => {
        // go to step participation (organization type)
        cy.passToStep3();
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

    it('shows correct summary data on summary step', () => {
      cy.get('@i18n').then((i18n) => {
        cy.passToStep7();
        // check personal details section
        cy.dataCy('summary-personal-name').should('contain', 'John Doe');
        cy.dataCy('summary-personal-gender').should(
          'contain',
          i18n.global.t('register.challenge.textGender.male'),
        );
        // check participation section
        cy.fixture('formFieldCompany').then((formFieldCompany) => {
          cy.dataCy('summary-participation-team').should('be.visible');
          cy.dataCy('summary-participation-organization')
            .should('be.visible')
            .and('contain', formFieldCompany.results[0].name);
        });
        // check merch section
        cy.fixture('apiGetMerchandiseResponse.json').then(
          (apiGetMerchandiseResponse) => {
            cy.dataCy('summary-merch-label')
              .should('be.visible')
              .and('contain', apiGetMerchandiseResponse.results[0].name);
            cy.dataCy('summary-merch-description')
              .should('be.visible')
              .and('contain', apiGetMerchandiseResponse.results[0].description);
          },
        );
        // check delivery section
        cy.fixture('apiGetSubsidiariesResponse.json').then(
          (apiGetSubsidiariesResponse) => {
            cy.dataCy('summary-delivery-address')
              .should('be.visible')
              .and(
                'contain',
                apiGetSubsidiariesResponse.results[0].address.street,
              );
          },
        );
      });
    });

    it('validates coordinator form when user wants to become coordinator', () => {
      cy.get('@i18n').then((i18n) => {
        cy.passToStep2();
        // select company
        cy.dataCy(getRadioOption(PaymentSubject.company))
          .should('be.visible')
          .click();
        // open organization select
        cy.dataCy('form-field-company').should('be.visible').click();
        // select second organization
        cy.get('.q-menu').within(() => {
          cy.get('.q-item').eq(1).click();
        });
        // checkbox become coordinator should be visible
        cy.dataCy('register-coordinator-checkbox').should('be.visible');
        // enable checkbox
        cy.dataCy('register-coordinator-checkbox').click();
        // validation prevents going to next step
        cy.dataCy('step-2-continue').should('be.visible').click();
        cy.dataCy('step-2-continue').should('be.visible');
        cy.dataCy('step-3-continue').should('not.exist');
        // validation message is displayed (job title)
        cy.contains(
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelJobTitleShort'),
          }),
        ).should('be.visible');
        // fill job title
        cy.dataCy('register-coordinator-job-title')
          .find('input')
          .type('Manager');
        // validation prevents going to next step
        cy.dataCy('step-2-continue').should('be.visible').click();
        cy.dataCy('step-2-continue').should('be.visible');
        cy.dataCy('step-3-continue').should('not.exist');
        // validation message is displayed (phone)
        cy.contains(
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelPhone'),
          }),
        ).should('be.visible');
        // fill phone
        cy.dataCy('register-coordinator-phone')
          .find('input')
          .type('736 123 456');
        // validation prevents going to next step
        cy.dataCy('step-2-continue').should('be.visible').click();
        cy.dataCy('step-2-continue').should('be.visible');
        cy.dataCy('step-3-continue').should('not.exist');
        // validation message is displayed (responsibility)
        cy.contains(
          i18n.global.t('register.coordinator.form.labelResponsibility'),
        ).should('be.visible');
        // enable checkbox responsibility
        cy.dataCy('register-coordinator-responsibility').click();
        // validation prevents going to next step
        cy.dataCy('step-2-continue').should('be.visible').click();
        cy.dataCy('step-2-continue').should('be.visible');
        cy.dataCy('step-3-continue').should('not.exist');
        // validation message is displayed (terms)
        cy.contains(
          i18n.global.t('register.coordinator.form.messageTermsRequired'),
        ).should('be.visible');
        // enable checkbox terms
        cy.dataCy('register-coordinator-terms').click();
        // going to next step
        cy.dataCy('step-2-continue').should('be.visible').click();
        cy.dataCy('step-3-continue').should('be.visible');
      });
    });

    it('reset organization, subsidiary and team on parent data change', () => {
      cy.passToStep5();
      cy.fixture('apiGetSubsidiariesResponse').then((subsidiariesResponse) => {
        cy.fixture('apiGetSubsidiariesResponseNext').then(
          (subsidiariesResponseNext) => {
            cy.waitForTeamsGetApi();
            // select first available team
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio:not(.disabled)')
              .first()
              .click();
            // organization, subsidiary and team are set (check debug component)
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should('not.be.empty');
                cy.dataCy('debug-subsidiary-id-value').should('not.be.empty');
                cy.dataCy('debug-team-id-value').should('not.be.empty');
              });
            // go back
            cy.dataCy('step-5-back').should('be.visible').click();
            // organization and address inputs are visible
            cy.dataCy('form-select-table-company').should('be.visible');
            // open subsidiary select
            cy.dataCy('form-company-address')
              .should('be.visible')
              .find('.q-field__append')
              .last()
              .click();
            // select different subsidiary (second one)
            cy.get('.q-menu')
              .should('be.visible')
              .within(() => {
                cy.get('.q-item').eq(1).click();
              });
            cy.dataCy('step-4-continue').should('be.visible').click();
            // wait for teams API refresh
            cy.waitForTeamsGetApi();
            // team is reset (check debug component)
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-team-id-value').should('be.empty');
              });
            // select first available team
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio:not(.disabled)')
              .first()
              .click();
            // team is set (check debug component)
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-team-id-value').should('not.be.empty');
              });
            // go back
            cy.dataCy('step-5-back').should('be.visible').click();
            // select a different organization (second one)
            cy.dataCy('form-select-table-company')
              .should('be.visible')
              .find('.q-radio:not(.disabled)')
              .eq(1)
              .click();
            // wait for subsidiaries API refresh
            cy.waitForSubsidiariesApi(
              subsidiariesResponse,
              subsidiariesResponseNext,
            );
            // subsidiary and team are reset (check debug component)
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-subsidiary-id-value').should('be.empty');
                cy.dataCy('debug-team-id-value').should('be.empty');
              });
            // open subsidiary select
            cy.dataCy('form-company-address')
              .should('be.visible')
              .find('.q-field__append')
              .last()
              .click();
            // select first available subsidiary
            cy.get('.q-menu')
              .should('be.visible')
              .within(() => {
                cy.get('.q-item').first().click();
              });
            // go to step 5
            cy.dataCy('step-4-continue').should('be.visible').click();
            // wait for teams API refresh
            cy.waitForTeamsGetApi();
            // select first available team
            cy.dataCy('form-select-table-team')
              .should('be.visible')
              .find('.q-radio:not(.disabled)')
              .first()
              .click();
            // organization, subsidiary and team are set (check debug component)
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should('not.be.empty');
                cy.dataCy('debug-subsidiary-id-value').should('not.be.empty');
                cy.dataCy('debug-team-id-value').should('not.be.empty');
              });
            // go back
            cy.dataCy('step-5-back').should('be.visible').click();
            cy.dataCy('step-4-back').should('be.visible').click();
            // select a different organization type
            cy.dataCy('form-field-option').eq(1).click();
            // organization, subsidiary and team are reset (check debug component)
            cy.dataCy('debug-register-challenge-ids')
              .should('be.visible')
              .within(() => {
                cy.dataCy('debug-organization-id-value').should('be.empty');
                cy.dataCy('debug-subsidiary-id-value').should('be.empty');
                cy.dataCy('debug-team-id-value').should('be.empty');
              });
          },
        );
      });
    });

    it('when voucher FULL + donation, submits step before creating PayU order', () => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep2();
          cy.fixture(
            'apiPostRegisterChallengePersonalDetailsRequest.json',
          ).then((request) => {
            cy.waitForRegisterChallengePostApi(request);
          });
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // apply voucher FULL
          cy.applyFullVoucher(config, i18n);
          // enable donation checkbox
          cy.dataCy('form-field-donation-checkbox')
            .should('be.visible')
            .click();
          cy.dataCy('form-field-donation-slider').should('be.visible');
          // next step button should not be visible
          cy.dataCy('step-2-continue').should('not.exist');
          // submit payment
          cy.dataCy('step-2-submit-payment')
            .should('be.visible')
            .and('not.be.disabled')
            .click();
          cy.fixture('apiPostRegisterChallengeVoucherFullRequest.json').then(
            (request) => {
              cy.waitForRegisterChallengePostApi(request);
            },
          );
          // create PayU order
          cy.fixture(
            'apiPostPayuCreateOrderRequestVoucherFullWithDonation.json',
          ).then((request) => {
            cy.waitForPayuCreateOrderPostApi(request);
          });
          // config is defined without hash in the URL
          cy.visit('#' + routesConf['register_challenge']['path']);
        });
      });
    });
    it('submits form state on 1st 2nd, 5th and 6th step (voucher payment)', () => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.window().should('have.property', 'i18n');
      cy.get('@i18n').then((i18n) => {
        cy.get('@config').then((config) => {
          cy.passToStep2();
          // test API post request (personal details)
          cy.fixture(
            'apiPostRegisterChallengePersonalDetailsRequest.json',
          ).then((request) => {
            cy.waitForRegisterChallengePostApi(request);
          });
          // on step 2
          cy.dataCy('step-2')
            .find('.q-stepper__step-content')
            .should('be.visible');
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // apply voucher FULL
          cy.applyFullVoucher(config, i18n);
          // go to next step
          cy.dataCy('step-2-continue').should('be.visible').click();
          // test API post request (payment)
          cy.fixture('apiPostRegisterChallengeVoucherFullRequest.json').then(
            (request) => {
              cy.waitForRegisterChallengePostApi(request);
            },
          );
          // select participation - continue
          cy.dataCy('form-field-option').should('be.visible').first().click();
          cy.dataCy('step-3-continue').should('be.visible').click();
          // select company
          cy.dataCy('form-select-table-company')
            .should('be.visible')
            .find('.q-radio')
            .first()
            .click();
          // wait for subsidiaries to load
          cy.fixture('apiGetSubsidiariesResponse.json').then(
            (apiGetSubsidiariesResponse) => {
              cy.fixture('apiGetSubsidiariesResponseNext.json').then(
                (apiGetSubsidiariesResponseNext) => {
                  cy.waitForSubsidiariesApi(
                    apiGetSubsidiariesResponse,
                    apiGetSubsidiariesResponseNext,
                  );
                },
              );
            },
          );
          cy.dataCy('form-company-address')
            .find('.q-field__append')
            .last()
            .click();
          // select option
          cy.get('.q-menu')
            .should('be.visible')
            .within(() => {
              cy.get('.q-item').first().click();
            });
          // go to next step
          cy.dataCy('step-4-continue').should('be.visible').click();
          // select first available team (this is the second team, first is full)
          cy.dataCy('form-select-table-team')
            .should('be.visible')
            .find('.q-radio:not(.disabled)')
            .first()
            .click();
          // go to next step
          cy.dataCy('step-5-continue').should('be.visible').click();
          // test API post request
          cy.fixture('apiPostRegisterChallengeTeamRequest.json').then(
            (request) => {
              cy.waitForRegisterChallengePostApi(request);
            },
          );
          // select first merch option
          cy.dataCy('form-card-merch-female')
            .first()
            .find('[data-cy="form-card-merch-link"]')
            .click();
          // close dialog
          cy.dataCy('dialog-close').click();
          // verify dialog is closed
          cy.dataCy('dialog-merch').should('not.exist');
          // fill in phone number
          cy.fixture('apiPostRegisterChallengeMerchandiseRequest.json').then(
            (request) => {
              cy.dataCy('form-merch-phone-input')
                .find('input')
                .type(request.telephone);
            },
          );
          // enable telephone opt-in
          cy.dataCy('form-merch-phone-opt-in-input').click();
          // go to next step
          cy.dataCy('step-6-continue').should('be.visible').click();
          // test API post request (merchandise)
          cy.fixture('apiPostRegisterChallengeMerchandiseRequest.json').then(
            (request) => {
              cy.waitForRegisterChallengePostApi(request);
            },
          );
        });
      });
    });

    it('submits form state on 1st, 5th and 6th step (company payment)', () => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.passToStep2();
      // test API post request (personal details)
      cy.fixture('apiPostRegisterChallengePersonalDetailsRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
      // on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy(getRadioOption(OrganizationType.company))
        .should('be.visible')
        .click();
      // open organization select
      cy.dataCy('form-field-company').should('be.visible').click();
      // from menu select first organization
      cy.get('.q-menu').within(() => {
        cy.get('.q-item').first().click();
      });
      // go to next step
      cy.dataCy('step-2-continue').should('be.visible').click();
      // test API post request (empty voucher)
      cy.fixture('apiPostRegisterChallengeVoucherNoneRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
      // participation is preselected - continue
      cy.dataCy('step-3-continue').should('be.visible').click();
      // organization is preselected - select address
      cy.dataCy('form-company-address').find('.q-field__append').last().click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // go to next step
      cy.dataCy('step-4-continue').should('be.visible').click();
      // select first available team (this is the second team, first is full)
      cy.dataCy('form-select-table-team')
        .should('be.visible')
        .find('.q-radio:not(.disabled)')
        .first()
        .click();
      // go to next step
      cy.dataCy('step-5-continue').should('be.visible').click();
      // test API post request
      cy.fixture('apiPostRegisterChallengeTeamCompanyPaymentRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
      // select first merch option
      cy.dataCy('form-card-merch-female')
        .first()
        .find('[data-cy="form-card-merch-link"]')
        .click();
      // close dialog
      cy.dataCy('dialog-close').click();
      // verify dialog is closed
      cy.dataCy('dialog-merch').should('not.exist');
      // fill in phone number
      cy.fixture('apiPostRegisterChallengeMerchandiseRequest.json').then(
        (request) => {
          cy.dataCy('form-merch-phone-input')
            .find('input')
            .type(request.telephone);
        },
      );
      // enable telephone opt-in
      cy.dataCy('form-merch-phone-opt-in-input').click();
      // go to next step
      cy.dataCy('step-6-continue').should('be.visible').click();
      // test API post request (merchandise)
      cy.fixture('apiPostRegisterChallengeMerchandiseRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
    });

    it('submits form state on 1st, 5th and 6th step (school payment)', () => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.passToStep2();
      // test API post request (personal details)
      cy.fixture('apiPostRegisterChallengePersonalDetailsRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
      // on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
      cy.dataCy(getRadioOption(OrganizationType.school))
        .should('be.visible')
        .click();
      // open organization select
      cy.dataCy('form-field-company').should('be.visible').click();
      // from menu select first organization
      cy.get('.q-menu').within(() => {
        cy.get('.q-item').first().click();
      });
      // go to next step
      cy.dataCy('step-2-continue').should('be.visible').click();
      // test API post request (empty voucher)
      cy.fixture('apiPostRegisterChallengeVoucherNoneRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
      // participation is preselected - continue
      cy.dataCy('step-3-continue').should('be.visible').click();
      // organization is preselected - select address
      cy.dataCy('form-company-address').find('.q-field__append').last().click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // go to next step
      cy.dataCy('step-4-continue').should('be.visible').click();
      // select first available team (this is the second team, first is full)
      cy.dataCy('form-select-table-team')
        .should('be.visible')
        .find('.q-radio:not(.disabled)')
        .first()
        .click();
      // go to next step
      cy.dataCy('step-5-continue').should('be.visible').click();
      // test API post request
      cy.fixture('apiPostRegisterChallengeTeamSchoolPaymentRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
      // select first merch option
      cy.dataCy('form-card-merch-female')
        .first()
        .find('[data-cy="form-card-merch-link"]')
        .click();
      // close dialog
      cy.dataCy('dialog-close').click();
      // verify dialog is closed
      cy.dataCy('dialog-merch').should('not.exist');
      // fill in phone number
      cy.fixture('apiPostRegisterChallengeMerchandiseRequest.json').then(
        (request) => {
          cy.dataCy('form-merch-phone-input')
            .find('input')
            .type(request.telephone);
        },
      );
      // enable telephone opt-in
      cy.dataCy('form-merch-phone-opt-in-input').click();
      // go to next step
      cy.dataCy('step-6-continue').should('be.visible').click();
      // test API post request (merchandise)
      cy.fixture('apiPostRegisterChallengeMerchandiseRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
    });

    it('submits personal details with empty newsletter', () => {
      cy.fixture('apiPostRegisterChallengePersonalDetailsRequest').then(
        (personalDetailsRequest) => {
          // fill in name and nickname
          cy.dataCy('form-firstName-input').type(
            personalDetailsRequest.first_name,
          );
          cy.dataCy('form-lastName-input').type(
            personalDetailsRequest.last_name,
          );
          cy.dataCy('form-nickname-input').type(
            personalDetailsRequest.nickname,
          );
          // select first newsletter option
          cy.dataCy('newsletter-option').first().click();
          // select gender
          cy.dataCy('form-personal-details-gender')
            .find('.q-radio__label')
            .first()
            .click();
          // agree with terms
          cy.dataCy('form-personal-details-terms')
            .find('.q-checkbox__inner')
            .first()
            .click();
          // continue to step 2
          cy.dataCy('step-1-continue').should('be.visible').click();
          cy.dataCy('step-1-continue').find('.q-spinner').should('be.visible');
          // test API POST request
          cy.fixture(
            'apiPostRegisterChallengePersonalDetailsChallengeNewsletter.json',
          ).then((request) => {
            cy.waitForRegisterChallengePostApi(request);
          });
          // on step 2
          cy.dataCy('step-2')
            .find('.q-stepper__step-content')
            .should('be.visible');
          // go back
          cy.dataCy('step-2-back').should('be.visible').click();
          // on step 1
          cy.dataCy('step-1')
            .find('.q-stepper__step-content')
            .should('be.visible');
          // deselect newsletter option
          cy.dataCy('newsletter-option').first().click();
          // continue to step 2
          cy.dataCy('step-1-continue').should('be.visible').click();
          cy.dataCy('step-1-continue').find('.q-spinner').should('be.visible');
          // test API POST request
          cy.fixture(
            'apiPostRegisterChallengePersonalDetailsNoNewsletter.json',
          ).then((request) => {
            cy.waitForRegisterChallengePostApi(request);
          });
        },
      );
    });

    it('displays correct nav buttons on payment step based on payment configuration', () => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // pass to step 2 (payment)
          cy.passToStep2();

          // case 1: individual payment
          cy.dataCy(getRadioOption(PaymentSubject.individual))
            .should('be.visible')
            .click();
          // submit payment button should be visible and enabled
          cy.dataCy('step-2-submit-payment')
            .should('be.visible')
            .and('not.be.disabled');
          // next step button should not be visible
          cy.dataCy('step-2-continue').should('not.exist');

          // case 2: voucher payment with no entered voucher
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // submit payment button should be hidden
          cy.dataCy('step-2-submit-payment').should('not.exist');
          // next step button should be visible and enabled
          cy.dataCy('step-2-continue').should('be.visible').and('be.disabled');

          // case 3: voucher payment with voucher FULL
          cy.applyFullVoucher(config, i18n);
          // submit payment button should be hidden
          cy.dataCy('step-2-submit-payment').should('not.exist');
          // next step button should be visible and enabled
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');

          // remove voucher
          cy.dataCy('voucher-button-remove').should('be.visible').click();

          // case 4: voucher payment with voucher HALF
          cy.applyHalfVoucher(config, i18n, defaultPaymentAmountMin);
          // submit payment button should be visible and enabled
          cy.dataCy('step-2-submit-payment')
            .should('be.visible')
            .and('not.be.disabled');
          // next step button should not be visible
          cy.dataCy('step-2-continue').should('not.exist');

          // case 5: company payment with no donation
          cy.dataCy(getRadioOption(PaymentSubject.company))
            .should('be.visible')
            .click();
          // submit payment button should be hidden
          cy.dataCy('step-2-submit-payment').should('not.exist');
          // next step button should be visible and enabled
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');

          // case 6: company payment with donation
          cy.dataCy('form-field-donation-checkbox')
            .should('be.visible')
            .click();
          cy.dataCy('form-field-donation-slider').should('be.visible');
          // submit payment button should be visible and enabled
          cy.dataCy('step-2-submit-payment')
            .should('be.visible')
            .and('not.be.disabled');
          // next step button should not be visible
          cy.dataCy('step-2-continue').should('not.exist');
          // disable donation checkbox
          cy.dataCy('form-field-donation-checkbox')
            .should('be.visible')
            .click();

          // case 7: school payment with no donation
          cy.dataCy(getRadioOption(PaymentSubject.school))
            .should('be.visible')
            .click();
          // submit payment button should be hidden
          cy.dataCy('step-2-submit-payment').should('not.exist');
          // next step button should be visible and enabled
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');

          // case 8: company payment with donation
          cy.dataCy('form-field-donation-checkbox')
            .should('be.visible')
            .click();
          cy.dataCy('form-field-donation-slider').should('be.visible');
          // submit payment button should be visible and enabled
          cy.dataCy('step-2-submit-payment')
            .should('be.visible')
            .and('not.be.disabled');
          // next step button should not be visible
          cy.dataCy('step-2-continue').should('not.exist');
          // disable donation checkbox
          cy.dataCy('form-field-donation-checkbox')
            .should('be.visible')
            .click();
        });
      });
    });

    it('allows to complete registration with voucher payment FULL', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep2();
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          cy.applyFullVoucher(config, i18n);
          // go to next step
          cy.dataCy('step-2-continue').should('be.visible').click();
          // override POST register-challenge response (payment status "done")
          cy.fixture('apiPostRegisterChallengeResponsePaymentDone.json').then(
            (response) => {
              cy.interceptRegisterChallengePostApi(config, i18n, response);
            },
          );
          // select participation - company
          cy.dataCy('form-field-option').should('be.visible').first().click();
          // go to next step
          cy.dataCy('step-3-continue').should('be.visible').click();
          // select company
          cy.dataCy('form-select-table-company')
            .should('be.visible')
            .find('.q-radio')
            .first()
            .click();
          cy.fixture('apiGetSubsidiariesResponse.json').then(
            (apiGetSubsidiariesResponse) => {
              cy.fixture('apiGetSubsidiariesResponseNext.json').then(
                (apiGetSubsidiariesResponseNext) => {
                  cy.waitForSubsidiariesApi(
                    apiGetSubsidiariesResponse,
                    apiGetSubsidiariesResponseNext,
                  );
                },
              );
            },
          );
          // select address
          cy.dataCy('form-company-address')
            .find('.q-field__append')
            .last()
            .should('be.visible')
            .click();
          // select option
          cy.get('.q-menu')
            .should('be.visible')
            .within(() => {
              cy.get('.q-item').first().click();
            });
          // go to next step
          cy.dataCy('step-4-continue').should('be.visible').click();
          // select first available team (this is the second team, first is full)
          cy.dataCy('form-select-table-team')
            .should('be.visible')
            .find('.q-radio:not(.disabled)')
            .first()
            .click();
          // go to next step
          cy.dataCy('step-5-continue').should('be.visible').click();
          // select first merch option
          cy.dataCy('form-card-merch-female')
            .first()
            .find('[data-cy="form-card-merch-link"]')
            .click();
          // close dialog
          cy.dataCy('dialog-close').click();
          // verify dialog is closed
          cy.dataCy('dialog-merch').should('not.exist');
          // fill in phone number
          cy.fixture('apiPostRegisterChallengeMerchandiseRequest.json').then(
            (request) => {
              cy.dataCy('form-merch-phone-input')
                .find('input')
                .type(request.telephone);
            },
          );
          // enable telephone opt-in
          cy.dataCy('form-merch-phone-opt-in-input').click();
          // go to next step
          cy.dataCy('step-6-continue').should('be.visible').click();
          // complete registration
          cy.dataCy('step-7-continue')
            .should('be.visible')
            .and('not.be.disabled');
        });
      });
    });

    it('does not allow to continue if fails to submit personal details step', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // override intercept for personal details step POST request
          cy.interceptRegisterChallengePostApi(
            config,
            i18n,
            null,
            HttpStatusCode.BadRequest,
          );
          // try to pass to step 2
          cy.fixture('apiPostRegisterChallengePersonalDetailsRequest').then(
            (personalDetailsRequest) => {
              cy.dataCy('form-firstName-input').type(
                personalDetailsRequest.first_name,
              );
              cy.dataCy('form-lastName-input').type(
                personalDetailsRequest.last_name,
              );
              cy.dataCy('form-nickname-input').type(
                personalDetailsRequest.nickname,
              );
              cy.dataCy('newsletter-option').each((newsletterOption) => {
                cy.wrap(newsletterOption).click();
              });
              cy.dataCy('form-personal-details-gender')
                .find('.q-radio__label')
                .first()
                .click();
              // agree with terms
              cy.dataCy('form-personal-details-terms')
                .find('.q-checkbox__inner')
                .first()
                .click();
              cy.dataCy('step-1-continue').should('be.visible').click();
              cy.dataCy('step-1-continue')
                .find('.q-spinner')
                .should('be.visible');
              // still on step 1
              cy.dataCy('step-2-continue').should('not.exist');
              cy.dataCy('step-1-continue').should('be.visible');
            },
          );
        });
      });
    });

    it('does not allow to continue if fails to submit payment step', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep2();
          // override intercept for payment step POST request
          cy.interceptRegisterChallengePostApi(
            config,
            i18n,
            null,
            HttpStatusCode.BadRequest,
          );
          // payment - choose a free pass voucher
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          cy.applyFullVoucher(config, i18n);
          // next step button should be visible and enabled
          cy.dataCy('step-2-continue').should('be.visible').click();
          cy.dataCy('step-2-continue').find('.q-spinner').should('be.visible');
          // still on step 2
          cy.dataCy('step-3-continue').should('not.exist');
          cy.dataCy('step-2-continue').should('be.visible');
        });
      });
    });

    it('does not allow to continue if fails to submit team step', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep5();
          // override intercept for team step POST request
          cy.interceptRegisterChallengePostApi(
            config,
            i18n,
            null,
            HttpStatusCode.BadRequest,
          );
          // try to submit team step
          cy.dataCy('form-select-table-team')
            .should('be.visible')
            .find('.q-radio:not(.disabled)')
            .first()
            .click();
          cy.dataCy('step-5-continue').should('be.visible').click();
          cy.dataCy('step-5-continue').find('.q-spinner').should('be.visible');
          // still on step 5
          cy.dataCy('step-6-continue').should('not.exist');
          cy.dataCy('step-5-continue').should('be.visible');
        });
      });
    });

    it('does not allow to continue if fails to submit merchandise step', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep6();
          // override intercept for merchandise step POST request
          cy.interceptRegisterChallengePostApi(
            config,
            i18n,
            null,
            HttpStatusCode.BadRequest,
          );
          // try to submit merchandise step
          cy.fixture('apiPostRegisterChallengeMerchandiseRequest').then(
            (request) => {
              // select merch
              cy.dataCy('form-card-merch-female')
                .first()
                .find('[data-cy="form-card-merch-link"]')
                .click();
              // close dialog
              cy.dataCy('dialog-close').click();
              // verify dialog is closed
              cy.dataCy('dialog-merch').should('not.exist');
              // fill phone number
              cy.dataCy('form-merch-phone-input')
                .should('be.visible')
                .find('input')
                .type(request.telephone);
              // opt in to info phone calls
              cy.dataCy('form-merch-phone-opt-in-input')
                .should('be.visible')
                .click();
              // go to next step
              cy.dataCy('step-6-continue').should('be.visible').click();
              cy.dataCy('step-6-continue')
                .find('.q-spinner')
                .should('be.visible');
              // still on step 6
              cy.dataCy('step-7-continue').should('not.exist');
              cy.dataCy('step-6-continue').should('be.visible');
            },
          );
        });
      });
    });

    it('allows to submit form inside registration with Enter key', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep2();
          // select payment voucher
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // fill voucher code
          cy.fixture('apiGetDiscountCouponResponseFull').then((apiResponse) => {
            // intercept coupon endpoint
            cy.interceptDiscountCouponGetApi(
              config,
              i18n,
              apiResponse.results[0].name,
              apiResponse,
            );
            // submit voucher
            cy.dataCy('form-field-voucher-input').type(
              apiResponse.results[0].name,
            );
            cy.dataCy('form-field-voucher-input').type('{enter}');
            // wait for API response
            cy.waitForDiscountCouponApi(apiResponse);
            // check success message
            cy.contains(i18n.global.t('notify.voucherApplySuccess')).should(
              'be.visible',
            );
            // verify banner content
            cy.dataCy('voucher-banner-code')
              .should('be.visible')
              .and('contain', apiResponse.results[0].name);
            cy.dataCy('voucher-banner-name')
              .should('be.visible')
              .and(
                'contain',
                i18n.global.t(
                  'register.challenge.labelVoucherFreeRegistration',
                ),
              );
          });
          // go to next step
          cy.dataCy('step-2-continue').should('be.visible').click();
          // select participation - company
          cy.dataCy('form-field-option').should('be.visible').first().click();
          // go to next step
          cy.dataCy('step-3-continue').should('be.visible').click();
          // create a new company
          cy.dataCy('form-select-table-company').within(() => {
            cy.dataCy('button-add-option').should('be.visible').click();
          });
          // dialog is open
          cy.dataCy('dialog-add-option').should('be.visible');
          // fill in form
          cy.fixture('companyAddress').then((companyAddress) => {
            // fill in basic fields
            cy.dataCy('form-add-company-name')
              .find('input')
              .type(companyAddress.name);
            cy.dataCy('form-add-company-vat-id')
              .find('input')
              .type(companyAddress.vatId);
            // fill in address fields
            cy.dataCy('form-add-subsidiary-street')
              .find('input')
              .type(companyAddress.address.street);
            cy.dataCy('form-add-subsidiary-house-number')
              .find('input')
              .type(companyAddress.address.houseNumber);
            cy.dataCy('form-add-subsidiary-city')
              .find('input')
              .type(companyAddress.address.city);
            cy.dataCy('form-add-subsidiary-zip')
              .find('input')
              .type(companyAddress.address.zip);
            cy.dataCy('form-add-subsidiary-city-challenge').click();
            cy.get('.q-menu')
              .should('be.visible')
              .within(() => {
                cy.get('.q-item').first().click();
              });
            cy.dataCy('form-add-subsidiary-department').type(
              companyAddress.address.department,
            );
            // submit form with enter
            cy.dataCy('form-add-subsidiary-department').type('{enter}');
            // dialog is closed
            cy.dataCy('dialog-add-option').should('not.exist');
            // new company is created and selected
            cy.dataCy('form-select-table-option')
              .first()
              .should('be.visible')
              .find('.q-radio__inner')
              .should('have.class', 'q-radio__inner--truthy');
            cy.dataCy('form-select-table-option')
              .first()
              .should('contain', companyAddress.name);
          });
          // create new address
          cy.dataCy('button-add-address').should('be.visible').click();
          // dialog is open
          cy.dataCy('dialog-add-address').should('be.visible');
          // fill in form
          cy.fixture('apiPostSubsidiaryResponse.json').then(
            (subsidiaryResponse) => {
              cy.dataCy('form-add-subsidiary-street')
                .find('input')
                .type(subsidiaryResponse.address.street);
              // house number
              cy.dataCy('form-add-subsidiary-house-number')
                .find('input')
                .type(subsidiaryResponse.address.street_number);
              // city
              cy.dataCy('form-add-subsidiary-city')
                .find('input')
                .type(subsidiaryResponse.address.city);
              // ZIP
              cy.dataCy('form-add-subsidiary-zip')
                .find('input')
                .type(subsidiaryResponse.address.psc);
              // city challenge
              cy.dataCy('form-add-subsidiary-city-challenge').click();
              // test loaded city options
              cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
                cy.fixture('apiGetCitiesResponseNext').then(
                  (citiesResponseNext) => {
                    cy.get('.q-menu .q-item__label')
                      .should('be.visible')
                      .and(
                        'have.length',
                        citiesResponse.results.length +
                          citiesResponseNext.results.length,
                      );
                    cy.get('.q-menu .q-item__label').first().click();
                  },
                );
              });
              // department
              cy.dataCy('form-add-subsidiary-department').type(
                subsidiaryResponse.address.recipient,
              );
              cy.dataCy('form-add-subsidiary-department').type('{enter}');
              // dialog is closed
              cy.dataCy('dialog-add-address').should('not.exist');
              // address is filled in
              cy.dataCy('form-company-address-input')
                .invoke('val')
                .should('contain', subsidiaryResponse.address.street);
            },
          );
          // go to next step
          cy.dataCy('step-4-continue').should('be.visible').click();
          // create new team
          cy.dataCy('form-select-table-team').within(() => {
            cy.dataCy('button-add-option').should('be.visible').click();
          });
          // dialog is open
          cy.dataCy('dialog-add-option').should('be.visible');
          // fill in form
          cy.dataCy('form-add-team-name').find('input').type('Test Team');
          cy.dataCy('form-add-team-name').find('input').type('{enter}');
          // dialog is closed
          cy.dataCy('dialog-add-option').should('not.exist');
        });
      });
    });

    it('does not allow to continue if team max members have been reached before submitting team step', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.passToStep5();
          cy.waitForTeamsGetApi();
          // override intercept for team GET request
          cy.fixture('formOrganizationOptions').then(
            (formOrganizationOptions) => {
              cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
                cy.fixture('apiGetTeamsResponseNextFullTeam').then(
                  (teamsResponseNextFullTeam) => {
                    // intercept teams for first subsidiary
                    cy.interceptTeamsGetApi(
                      config,
                      i18n,
                      formOrganizationOptions[0].subsidiaries[0].id,
                      teamsResponse,
                      teamsResponseNextFullTeam,
                    );
                    // UI should allow to select 3rd (last) team
                    cy.dataCy('form-select-table-team')
                      .should('be.visible')
                      .find('.q-radio')
                      .eq(2)
                      .should('be.visible')
                      .and('not.be.disabled')
                      .click();
                    // check that 3rd team is selected
                    cy.dataCy('form-select-table-team')
                      .should('be.visible')
                      .find('.q-radio')
                      .eq(2)
                      .find('.q-radio__inner')
                      .should('have.class', 'q-radio__inner--truthy');
                    // try to submit team step
                    cy.dataCy('step-5-continue').should('be.visible').click();
                    // wait for updated team API request
                    cy.waitForTeamsGetApi(
                      teamsResponse,
                      teamsResponseNextFullTeam,
                    );
                    // check that we are still on step 5
                    cy.dataCy('step-5-continue').should('be.visible');
                    // check error message
                    cy.contains(
                      i18n.global.t(
                        'postRegisterChallenge.messageTeamMaxMembersReached',
                      ),
                    ).should('be.visible');
                    // check that 3rd team is not available
                    cy.dataCy('form-select-table-team')
                      .should('be.visible')
                      .find('.q-radio')
                      .eq(2)
                      .should('be.visible')
                      .and('have.class', 'disabled');
                    // check that 3rd team is deselected
                    cy.dataCy('form-select-table-team')
                      .should('be.visible')
                      .find('.q-radio')
                      .eq(2)
                      .find('.q-radio__inner')
                      .should('not.have.class', 'q-radio__inner--truthy');
                    // select 2nd team
                    cy.dataCy('form-select-table-team')
                      .should('be.visible')
                      .find('.q-radio')
                      .eq(1)
                      .should('be.visible')
                      .and('not.be.disabled')
                      .click();
                    // check that 2nd team is selected
                    cy.dataCy('form-select-table-team')
                      .should('be.visible')
                      .find('.q-radio')
                      .eq(1)
                      .find('.q-radio__inner')
                      .should('have.class', 'q-radio__inner--truthy');
                    // submit team step
                    cy.dataCy('step-5-continue').should('be.visible').click();
                    // wait for team API request to refetch again
                    cy.waitForTeamsGetApi(
                      teamsResponse,
                      teamsResponseNextFullTeam,
                    );
                    // check that we are on step 6
                    cy.dataCy('step-6-continue').should('be.visible');
                  },
                );
              });
            },
          );
        });
      });
    });
  });

  context('registration in progress, individual payment "done"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.viewport('macbook-16');
    });

    it('loads payment page - payment status "done" (set-is-paid-from-ui-true)', () => {
      // visit page
      cy.visit('#' + routesConf['register_challenge']['path']);
      // !isPayuTransactionInitiated is set via test title
      cy.dataCy('debug-is-paid-from-ui-value').should('contain', 'true');
      // intercept "individual paid" registration data
      cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
        (response) => {
          cy.testRegisterChallengePaymentMessage(
            response,
            'step-2-paid-message',
          );
          cy.dataCy('register-challenge-payment').should('not.exist');
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');
        },
      );
    });

    it('allows to complete registration with individual payment "done"', () => {
      // visit page
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        // intercept "individual paid" registration data
        cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
          (response) => {
            cy.testRegisterChallengePaymentMessage(
              response,
              'step-2-paid-message',
            );
            cy.dataCy('register-challenge-payment').should('not.exist');
            cy.dataCy('step-2-continue')
              .should('be.visible')
              .and('not.be.disabled');
            cy.dataCy('step-2-continue').should('be.visible').click();
            cy.testRegisterChallengeLoadedStepsThreeToFive(win.i18n, response);
            // select merch size
            cy.dataCy('form-card-merch-female')
              .first()
              .find('[data-cy="button-more-info"]')
              .click();
            cy.dataCy('dialog-close').click();
            // fill in phone number
            cy.fixture('apiPostRegisterChallengeMerchandiseRequest').then(
              (request) => {
                cy.dataCy('form-merch-phone-input')
                  .find('input')
                  .type(request.telephone);
              },
            );
            // next step button is enabled
            cy.dataCy('step-6-continue')
              .should('be.visible')
              .and('not.be.disabled')
              .click();
            // go to next step
            cy.dataCy('step-6')
              .find('.q-stepper__step-content')
              .should('not.exist');
            // button complete registration should be visible and enabled
            cy.dataCy('step-7-continue')
              .should('be.visible')
              .and('not.be.disabled')
              .click();
            // confirm that complete registration button redirects to homepage
            cy.dataCy('index-title').should('be.visible');
          },
        );
      });
    });
  });

  context('registration in progress, individual payment "no_admission"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeIndividualNoAdmission.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.fixture('apiPostRegisterChallengeResponsePaymentNoAdmission').then(
          (registerChallengeResponse) => {
            cy.interceptRegisterChallengePostApi(
              config,
              defLocale,
              registerChallengeResponse,
            );
          },
        );
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.viewport('macbook-16');
    });

    it('loads payment page - payment status "no_admission" (set-is-paid-from-ui-true)', () => {
      cy.fixture('apiGetRegisterChallengeIndividualNoAdmission.json').then(
        (registerChallengeResponse) => {
          // visit page
          cy.visit('#' + routesConf['register_challenge']['path']);
          // !isPayuTransactionInitiated is set via test title
          cy.dataCy('debug-is-paid-from-ui-value').should('contain', 'true');
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.get('@config').then((config) => {
              cy.testRegisterChallengeLoadedStepOne(
                win.i18n,
                registerChallengeResponse,
              );
              // check that the "paid" message is visible
              cy.dataCy('step-2-paid-message')
                .should('be.visible')
                .then(($el) => {
                  const content = $el.text();
                  cy.stripHtmlTags(
                    win.i18n.global.t(
                      'register.challenge.textRegistrationPaid',
                      { contactEmail: config.contactEmail },
                    ),
                  ).then((text) => {
                    expect(content).to.equal(text);
                  });
                });
              // go to next step
              cy.dataCy('step-2-continue')
                .should('be.visible')
                .and('not.be.disabled')
                .click();
            });
          });
        },
      );
    });
  });

  context('registration in progress, individual payment "unknown"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeIndividualUnknown.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.fixture('apiPostRegisterChallengeResponsePaymentUnknown').then(
          (registerChallengeResponse) => {
            cy.interceptRegisterChallengePostApi(
              config,
              defLocale,
              registerChallengeResponse,
            );
          },
        );
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.viewport('macbook-16');
    });

    it('loads payment page - payment status "unknown" (set-is-paid-from-ui-true)', () => {
      cy.fixture('apiGetRegisterChallengeIndividualUnknown.json').then(
        (response) => {
          // visit page
          cy.visit('#' + routesConf['register_challenge']['path']);
          // !isPayuTransactionInitiated is set via test title
          cy.dataCy('debug-is-paid-from-ui-value').should('contain', 'true');
          // intercept "individual paid" registration data
          cy.testRegisterChallengePaymentMessage(
            response,
            'registration-payu-payment-failed',
          );
        },
      );
    });
  });

  context('registration in progress, individual payment "none"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeIndividualNotPaid.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.fixture('apiPostRegisterChallengeResponsePaymentNone.json').then(
          (registerChallengeResponse) => {
            cy.interceptRegisterChallengePostApi(
              config,
              defLocale,
              registerChallengeResponse,
            );
          },
        );
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.viewport('macbook-16');
    });

    it('loads payment page - payment status "none" (set-is-paid-from-ui-true)', () => {
      cy.get('@config').then((config) => {
        // visit URL
        cy.visit('#' + routesConf['register_challenge']['path']);
        // !isPayuTransactionInitiated is set via test title
        cy.dataCy('debug-is-paid-from-ui-value').should('contain', 'true');
        // intercept "individual paid" registration data
        cy.fixture('apiGetRegisterChallengeIndividualNotPaid.json').then(
          (response) => {
            cy.testRegisterChallengePaymentMessage(
              response,
              'registration-payu-waiting-for-payment',
            );
            // within timeout window, getRegisterChallenge will be called again
            cy.get('@getRegisterChallenge.all', {
              // custom timeout for interval + 1s
              timeout:
                config.checkRegisterChallengeStatusIntervalSeconds * 1000 +
                1000,
            }).should('have.length', 2);
          },
        );
      });
    });
  });

  context('registration in progress, individual payment "paid"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      // config is defined without hash in the URL
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('fetches the registration status on load (set-is-paid-from-ui-true)', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.get('@config').then((config) => {
          cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then(
            (registerChallengeResponse) => {
              cy.testRegisterChallengeLoadedStepOne(
                win.i18n,
                registerChallengeResponse,
              );
              // check that the "paid" message is visible
              cy.dataCy('step-2-paid-message')
                .should('be.visible')
                .then(($el) => {
                  const content = $el.text();
                  cy.stripHtmlTags(
                    win.i18n.global.t(
                      'register.challenge.textRegistrationPaid',
                      { contactEmail: config.contactEmail },
                    ),
                  ).then((text) => {
                    expect(content).to.equal(text);
                  });
                });
              // go to next step
              cy.dataCy('step-2-continue')
                .should('be.visible')
                .and('not.be.disabled')
                .click();
              cy.testRegisterChallengeLoadedStepsThreeToFive(
                win.i18n,
                registerChallengeResponse,
              );
            },
          );
        });
      });
    });
  });

  context('registration in progress, voucher payment FULL', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeVoucherFull.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.fixture('apiGetDiscountCouponResponseFull.json').then((response) => {
          cy.interceptDiscountCouponGetApi(
            config,
            defLocale,
            response.results[0].name,
            response,
          );
        });
        // intercept common response (not currently used)
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('loads payment page - voucher payment FULL', () => {
      cy.fixture('apiGetRegisterChallengeVoucherFull.json').then((response) => {
        // showing payment form (not the "locked" paid message)
        cy.dataCy('register-challenge-payment').should('be.visible');
        // show enabled voucher with voucher name
        cy.dataCy('voucher-banner').should('be.visible');
        cy.dataCy('voucher-banner-code')
          .should('be.visible')
          .and('contain', response.results[0].personal_details.discount_coupon);
        // next step button should be visible and enabled
        cy.dataCy('step-2-continue')
          .should('be.visible')
          .and('not.be.disabled');
      });
    });
  });

  context('registration in progress, voucher payment FULL + donation', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeVoucherFullWithDonation.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.fixture('apiGetDiscountCouponResponseFull.json').then((response) => {
          cy.interceptDiscountCouponGetApi(
            config,
            defLocale,
            response.results[0].name,
            response,
          );
        });
        // intercept common response (not currently used)
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('loads payment page - voucher payment FULL + donation', () => {
      cy.fixture('apiGetRegisterChallengeVoucherFullWithDonation.json').then(
        (response) => {
          // showing payment form (not the "locked" paid message)
          cy.dataCy('register-challenge-payment').should('be.visible');
          // show enabled voucher with voucher name
          cy.dataCy('voucher-banner').should('be.visible');
          cy.dataCy('voucher-banner-code')
            .should('be.visible')
            .and(
              'contain',
              response.results[0].personal_details.discount_coupon,
            );
          // next step button should be visible and enabled
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');
          // check that the "donation" message is visible
          cy.dataCy('registration-donation-payment-successful').should(
            'be.visible',
          );
        },
      );
    });
  });

  context('registration in progress, voucher payment HALF', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeVoucherHalf.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.fixture('apiGetDiscountCouponResponseHalf.json').then((response) => {
          cy.interceptDiscountCouponGetApi(
            config,
            defLocale,
            response.results[0].name,
            response,
          );
        });
        // intercept common response (not currently used)
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('loads payment page - voucher payment HALF', () => {
      cy.fixture('apiGetRegisterChallengeVoucherHalf.json').then((response) => {
        cy.testRegisterChallengePaymentMessage(response, 'step-2-paid-message');
        cy.dataCy('register-challenge-payment').should('not.exist');
        cy.dataCy('step-2-continue')
          .should('be.visible')
          .and('not.be.disabled');
      });
    });
  });

  context('registration in progress, voucher payment HALF + donation', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeVoucherHalfWithDonation.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.fixture('apiGetDiscountCouponResponseHalf.json').then((response) => {
          cy.interceptDiscountCouponGetApi(
            config,
            defLocale,
            response.results[0].name,
            response,
          );
        });
        // intercept common response (not currently used)
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('loads payment page - voucher payment HALF + donation', () => {
      cy.fixture('apiGetRegisterChallengeVoucherHalfWithDonation.json').then(
        (response) => {
          cy.testRegisterChallengePaymentMessage(
            response,
            'step-2-paid-message',
          );
          cy.dataCy('register-challenge-payment').should('not.exist');
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');
          // check that the "donation" message is visible
          cy.dataCy('registration-donation-payment-successful').should(
            'be.visible',
          );
        },
      );
    });
  });

  context('registration in progress, voucher payment FULL ONE-TIME', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeVoucherFull.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.fixture('apiGetDiscountCouponResponseOneTime.json').then(
          (response) => {
            cy.interceptDiscountCouponGetApi(
              config,
              defLocale,
              response.results[0].name,
              response,
            );
          },
        );
        // intercept common response (not currently used)
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('loads payment page - voucher payment ONE-TIME (valid but not available)', () => {
      cy.fixture('apiGetRegisterChallengeVoucherFull.json').then((response) => {
        cy.fixture('apiGetDiscountCouponResponseOneTime.json').then(
          (responseCoupon) => {
            cy.waitForDiscountCouponApi(responseCoupon);
          },
        );
        // show enabled voucher with voucher name
        cy.dataCy('voucher-banner').should('be.visible');
        cy.dataCy('voucher-banner-code')
          .should('be.visible')
          .and('contain', response.results[0].personal_details.discount_coupon);
      });
    });
  });

  context('registration in progress, company payment "unknown"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeCompanyUnknown.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.fixture('apiPostRegisterChallengeResponsePaymentUnknown.json').then(
          (registerChallengeResponse) => {
            cy.interceptRegisterChallengePostApi(
              config,
              defLocale,
              registerChallengeResponse,
            );
          },
        );
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.viewport('macbook-16');
    });

    it('loads payment page - payment status "unknown" (set-is-paid-from-ui-true)', () => {
      cy.fixture('apiGetRegisterChallengeCompanyUnknown.json').then(
        (response) => {
          // visit page
          cy.visit('#' + routesConf['register_challenge']['path']);
          // !isPayuTransactionInitiated is set via test title
          cy.dataCy('debug-is-paid-from-ui-value').should('contain', 'true');
          // intercept "company paid" registration data
          cy.testRegisterChallengePaymentMessage(
            response,
            'registration-payu-payment-failed',
          );
        },
      );
    });
  });

  context('registration in progress, company payment "waiting"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.fixture('apiPostRegisterChallengeResponsePaymentWaiting').then(
          (registerChallengeResponse) => {
            cy.interceptRegisterChallengePostApi(
              config,
              defLocale,
              registerChallengeResponse,
            );
          },
        );
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      // config is defined without hash in the URL
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('fetches the registration status on load', () => {
      cy.get('@config').then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then(
            (registerChallengeResponse) => {
              // intercept GET API for coordinator details
              cy.fixture('apiGetMyOrganizationAdmin.json').then((data) => {
                cy.interceptMyOrganizationAdminGetApi(config, win.i18n, data);
                cy.testRegisterChallengeLoadedStepOne(
                  win.i18n,
                  registerChallengeResponse,
                );
                // go to next step
                cy.dataCy('step-1-continue').should('be.visible').click();
                // TODO: check if we can change company before approval
                // check that the company options is selected
                cy.dataCy(getRadioOption(PaymentSubject.company))
                  .parents('.q-radio__label')
                  .siblings('.q-radio__inner')
                  .should('have.class', 'q-radio__inner--truthy');
                // shows waiting for confirmation message
                cy.dataCy('registration-waiting-for-confirmation').should(
                  'be.visible',
                );
                // go to next step
                cy.dataCy('step-2-continue')
                  .should('be.visible')
                  .and('not.be.disabled')
                  .click();
                // wait for hasOrganizationAdmin API call
                cy.fixture('apiGetHasOrganizationAdminResponseTrue').then(
                  (response) => {
                    cy.waitForHasOrganizationAdminApi(response);
                  },
                );
                cy.testRegisterChallengeLoadedStepsThreeToFive(
                  win.i18n,
                  registerChallengeResponse,
                );
                cy.testRegisterChallengeLoadedStepSix(
                  win.i18n,
                  registerChallengeResponse,
                );
                cy.dataCy('step-7-continue').should('not.exist');
                // wait for my organization admin API call
                cy.waitForMyOrganizationAdminGetApi();
                // check that the "waiting for coordinator" message is visible
                cy.dataCy('registration-coordinator-details')
                  .should('be.visible')
                  .then(($el) => {
                    // element contains text
                    const textContent = $el.text();
                    cy.stripHtmlTags(
                      win.i18n.global.t(
                        'register.challenge.textRegistrationWaitingForCoordinatorWithNameAndEmail',
                        {
                          name: data.organization_admin[0].admin_name,
                          email: data.organization_admin[0].admin_email,
                        },
                      ),
                    ).then((text) => {
                      expect(textContent).to.contain(text);
                    });
                    // element has a mailto href attribute with email
                    cy.wrap($el)
                      .find('a')
                      .should('have.attr', 'href')
                      .should(
                        'include',
                        `mailto:${data.organization_admin[0].admin_email}`,
                      );
                  });
              });
            },
          );
        });
      });
    });
  });

  context(
    'registration in progress, company payment "waiting" + no coordinator',
    () => {
      beforeEach(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.interceptThisCampaignGetApi(config, defLocale);
          // visit challenge inactive page to load campaign data
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.waitForThisCampaignApi();
          cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then(
            (response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            },
          );
          // intercept common response (not currently used)
          cy.fixture('apiPostRegisterChallengeResponsePaymentWaiting').then(
            (registerChallengeResponse) => {
              cy.interceptRegisterChallengePostApi(
                config,
                defLocale,
                registerChallengeResponse,
              );
            },
          );
          cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
          // override has organization admin API call "false"
          cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
            (response) => {
              cy.fixture('formFieldCompany').then(
                (formFieldCompanyResponse) => {
                  cy.interceptHasOrganizationAdminGetApi(
                    config,
                    defLocale,
                    formFieldCompanyResponse.results[0].id,
                    response,
                  );
                },
              );
            },
          );
        });
        // config is defined without hash in the URL
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
      });

      it('fetches the registration status on load', () => {
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then(
            (registerChallengeResponse) => {
              cy.testRegisterChallengeLoadedStepOne(
                win.i18n,
                registerChallengeResponse,
              );
              // go to next step
              cy.dataCy('step-1-continue').should('be.visible').click();
              // TODO: check if we can change company before approval
              // check that the company options is selected
              cy.dataCy(getRadioOption(PaymentSubject.company))
                .parents('.q-radio__label')
                .siblings('.q-radio__inner')
                .should('have.class', 'q-radio__inner--truthy');
              // shows waiting for confirmation message
              cy.dataCy('registration-waiting-for-confirmation').should(
                'be.visible',
              );
              // go to next step
              cy.dataCy('step-2-continue')
                .should('be.visible')
                .and('not.be.disabled')
                .click();
              // wait for hasOrganizationAdmin API call
              cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
                (response) => {
                  cy.waitForHasOrganizationAdminApi(response);
                },
              );
              cy.testRegisterChallengeLoadedStepsThreeToFive(
                win.i18n,
                registerChallengeResponse,
              );
              cy.testRegisterChallengeLoadedStepSix(
                win.i18n,
                registerChallengeResponse,
              );
              cy.dataCy('step-7-continue').should('not.exist');
              // check that the "waiting for coordinator" message is visible
              cy.dataCy('registration-waiting-for-confirmation-no-coordinator')
                .should('be.visible')
                .and(
                  'contain',
                  win.i18n.global.t(
                    'register.challenge.textRegistrationWaitingForConfirmationNoCoordinator',
                  ),
                );
            },
          );
        });
      });
    },
  );

  context(
    'registration in progress, company payment "waiting" + donation',
    () => {
      beforeEach(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.wrap(config).as('config');
          cy.interceptThisCampaignGetApi(config, defLocale);
          // visit challenge inactive page to load campaign data
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.waitForThisCampaignApi();
          cy.fixture(
            'apiGetRegisterChallengeCompanyWaitingWithDonation.json',
          ).then((response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          });
          // intercept common response (not currently used)
          cy.interceptRegisterChallengePostApi(config, defLocale);
          cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        });
        // config is defined without hash in the URL
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
      });

      it('fetches the registration status on load (set-is-paid-from-ui-true)', () => {
        cy.fixture(
          'apiGetRegisterChallengeCompanyWaitingWithDonation.json',
        ).then((registerChallengeResponse) => {
          // visit page
          cy.visit('#' + routesConf['register_challenge']['path']);
          // !isPayuTransactionInitiated is set via test title
          cy.dataCy('debug-is-paid-from-ui-value').should('contain', 'true');
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.testRegisterChallengeLoadedStepOne(
              win.i18n,
              registerChallengeResponse,
            );
            // shows form
            cy.dataCy('register-challenge-payment').should('be.visible');
            // option company is selected
            cy.dataCy(getRadioOption(PaymentSubject.company))
              .parents('.q-radio__label')
              .siblings('.q-radio__inner')
              .should('have.class', 'q-radio__inner--truthy');
            // shows donation message
            cy.dataCy('registration-donation-payment-successful').should(
              'be.visible',
            );
            // shows waiting for confirmation message
            cy.dataCy('registration-waiting-for-confirmation').should(
              'be.visible',
            );
            // go to next step
            cy.dataCy('step-2-continue')
              .should('be.visible')
              .and('not.be.disabled')
              .click();
          });
        });
      });
    },
  );

  context(
    'registration in progress, company payment "waiting" + I dont want merch',
    () => {
      beforeEach(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.interceptThisCampaignGetApi(config, defLocale);
          // visit challenge inactive page to load campaign data
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.waitForThisCampaignApi();
          cy.fixture('apiGetRegisterChallengeNoMerch.json').then((response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          });
          // intercept common response (not currently used)
          cy.fixture('apiPostRegisterChallengeResponsePaymentWaiting').then(
            (registerChallengeResponse) => {
              cy.interceptRegisterChallengePostApi(
                config,
                defLocale,
                registerChallengeResponse,
              );
            },
          );
          cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        });
        // config is defined without hash in the URL
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
      });

      it('fetches the registration status on load', () => {
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.fixture('apiGetRegisterChallengeNoMerch.json').then(
            (registerChallengeResponse) => {
              cy.testRegisterChallengeLoadedStepOne(
                win.i18n,
                registerChallengeResponse,
              );
              // go to next step
              cy.dataCy('step-1-continue').should('be.visible').click();
              // check that the company options is selected
              cy.dataCy(getRadioOption(PaymentSubject.company))
                .parents('.q-radio__label')
                .siblings('.q-radio__inner')
                .should('have.class', 'q-radio__inner--truthy');
              // go to next step
              cy.dataCy('step-2-continue')
                .should('be.visible')
                .and('not.be.disabled')
                .click();
              cy.testRegisterChallengeLoadedStepsThreeToFive(
                win.i18n,
                registerChallengeResponse,
              );
              // validate that step 6 contains "I don't want merch" selected
              cy.dataCy('form-merch-no-merch-checkbox')
                .should('be.visible')
                .find('.q-checkbox__inner')
                .should('have.class', 'q-checkbox__inner--truthy');
              // merch cards should not be visible
              cy.dataCy('list-merch').should('not.be.visible');
              // go to next step
              cy.dataCy('step-6-continue').should('be.visible').click();
              // on step 7
              cy.dataCy('step-7')
                .find('.q-stepper__step-content')
                .should('be.visible');
              cy.dataCy('step-7-continue').should('not.exist');
            },
          );
        });
      });
    },
  );

  /**
   * Company payment "no_admission" indicates successful registration.
   * Works the same as payment state "done".
   */
  context('registration in progress, company payment "no_admission"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeCompanyNoAdmission.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.fixture('apiPostRegisterChallengeResponsePaymentNoAdmission').then(
          (registerChallengeResponse) => {
            cy.interceptRegisterChallengePostApi(
              config,
              defLocale,
              registerChallengeResponse,
            );
          },
        );
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      // config is defined without hash in the URL
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('fetches the registration status on load (set-is-paid-from-ui-true)', () => {
      cy.fixture('apiGetRegisterChallengeCompanyNoAdmission.json').then(
        (registerChallengeResponse) => {
          // visit page
          cy.visit('#' + routesConf['register_challenge']['path']);
          // !isPayuTransactionInitiated is set via test title
          cy.dataCy('debug-is-paid-from-ui-value').should('contain', 'true');
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.get('@config').then((config) => {
              cy.testRegisterChallengeLoadedStepOne(
                win.i18n,
                registerChallengeResponse,
              );
              // check that the "paid" message is visible
              cy.dataCy('step-2-paid-message')
                .should('be.visible')
                .then(($el) => {
                  const content = $el.text();
                  cy.stripHtmlTags(
                    win.i18n.global.t(
                      'register.challenge.textRegistrationPaid',
                      { contactEmail: config.contactEmail },
                    ),
                  ).then((text) => {
                    expect(content).to.equal(text);
                  });
                });
              // go to next step
              cy.dataCy('step-2-continue')
                .should('be.visible')
                .and('not.be.disabled')
                .click();
            });
          });
        },
      );
    });
  });

  context('specific time before challenge', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeCompanyNoAdmission.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // intercept common response (not currently used)
        cy.fixture('apiPostRegisterChallengeResponsePaymentNoAdmission').then(
          (registerChallengeResponse) => {
            cy.interceptRegisterChallengePostApi(
              config,
              defLocale,
              registerChallengeResponse,
            );
          },
        );
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });

      cy.clock(systemTimeRegistrationPhaseInactive, ['Date']).then(() => {
        // config is defined without hash in the URL
        cy.visit('#' + routesConf['register_challenge']['path']);
      });
      cy.viewport('macbook-16');
    });

    it('renders top banner with countdown', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.fixture('apiGetThisCampaign.json').then((campaign) => {
          const competitionPhase = campaign.results[0].phase_set.find(
            (phase) => phase.phase_type === 'competition',
          );
          const competitionStart = new Date(
            competitionPhase.date_from,
          ).getTime();
          const currentDate = new Date(
            systemTimeRegistrationPhaseInactive,
          ).getTime();
          // calculate time difference in milliseconds
          const timeDifference = competitionStart - currentDate;

          const { days, hours, minutes, seconds } =
            calculateCountdownIntervals(timeDifference);

          // check countdown values
          cy.dataCy('top-bar-countdown').should(
            'contain',
            win.i18n.global.t('register.challenge.textCountdown.may', {
              days: days.toString(),
              hours: hours.toString(),
              minutes: minutes.toString(),
              seconds: seconds.toString(),
            }),
          );
        });
      });
    });
  });

  context('registration with payment voucher 95% discount', () => {
    beforeEach(() => {
      cy.clock(systemTimeRegistrationPhase1May, ['Date']);
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
          cy.interceptThisCampaignGetApi(config, defLocale, campaign);
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.waitForThisCampaignApi(campaign);
        });
        cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        cy.fixture('apiGetDiscountCouponResponse95.json').then((response) => {
          cy.interceptDiscountCouponGetApi(
            config,
            defLocale,
            response.results[0].name,
            response,
          );
        });
        // intercept register challenge POST API endpoint
        cy.fixture('apiPostRegisterChallengeResponsePaymentNone.json').then(
          (response) => {
            cy.interceptRegisterChallengePostApi(config, defLocale, response);
          },
        );
        cy.interceptIpAddressGetApi(config);
        cy.interceptPayuCreateOrderPostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        cy.fixture('apiPostPayuCreateOrderResponseNoRedirect.json').then(
          (responseBody) => {
            cy.interceptPayuCreateOrderPostApi(config, defLocale, responseBody);
          },
        );
      });
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('allows to apply 95% discount coupon and continue to payment', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.fixture('apiGetRegisterChallengeEmpty.json').then(() => {
          cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
            // extract current price from campaign data
            const priceLevels = campaign.results[0].price_level;
            const currentPriceLevels = getCurrentPriceLevelsUtil(
              priceLevels,
              new Date(systemTimeRegistrationPhase1May),
            );
            // current min price given the date
            const defaultPaymentAmountMinMay =
              currentPriceLevels[PriceLevelCategory.basic].price;
            // pass to step 2
            cy.passToStep2();
            // wait for register challenge POST API call
            cy.fixture(
              'apiPostRegisterChallengePersonalDetailsRequest.json',
            ).then((request) => {
              cy.waitForRegisterChallengePostApi(request);
            });
            // select option voucher payment
            cy.dataCy(getRadioOption(PaymentSubject.voucher)).click();
            // apply voucher 95% discount
            cy.fixture('apiGetDiscountCouponResponse95.json').then(
              (voucherApiResponse) => {
                // submit voucher
                cy.dataCy('form-field-voucher-input').type(
                  voucherApiResponse.results[0].name,
                );
                cy.dataCy('form-field-voucher-submit').click();
                // wait for API response
                cy.waitForDiscountCouponApi(voucherApiResponse);
                // check success message
                cy.contains(
                  win.i18n.global.t('notify.voucherApplySuccess'),
                ).should('be.visible');
                // calculate discount amount
                const discountAmountInt = Math.round(
                  defaultPaymentAmountMinMay -
                    (defaultPaymentAmountMinMay *
                      voucherApiResponse.results[0].discount) /
                      100,
                );
                // verify banner content
                cy.dataCy('voucher-banner-code')
                  .should('be.visible')
                  .and('contain', voucherApiResponse.results[0].name);
                cy.dataCy('voucher-banner-name')
                  .should('be.visible')
                  .and('contain', win.i18n.global.t('global.discount'))
                  .and('contain', voucherApiResponse.results[0].discount)
                  .and('contain', discountAmountInt);
                // verify total amount
                cy.dataCy('total-price-value')
                  .should('be.visible')
                  .and('contain', discountAmountInt);
              },
            );
            // submit payment button should be visible and enabled
            cy.dataCy('step-2-submit-payment')
              .should('be.visible')
              .and('not.be.disabled')
              .click();
            // wait for PayU create order API call
            cy.fixture(
              'apiPostPayuCreateOrderRequestVoucher95NoDonation.json',
            ).then((request) => {
              cy.fixture('apiPostPayuCreateOrderResponseNoRedirect.json').then(
                (response) => {
                  cy.waitForPayuCreateOrderPostApi(request, response);
                },
              );
            });
          });
        });
      });
    });
  });

  context('registration with payment voucher 95% discount', () => {
    beforeEach(() => {
      cy.clock(systemTimeRegistrationPhase1May, ['Date']);
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
          cy.interceptThisCampaignGetApi(config, defLocale, campaign);
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.waitForThisCampaignApi(campaign);
        });
        cy.fixture('apiGetRegisterChallengeVoucher95NotApplied.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        cy.fixture('apiGetDiscountCouponResponse95.json').then((response) => {
          cy.interceptDiscountCouponGetApi(
            config,
            defLocale,
            response.results[0].name,
            response,
          );
        });
        // intercept register challenge POST API endpoint
        cy.fixture('apiPostRegisterChallengeResponsePaymentNone.json').then(
          (response) => {
            cy.interceptRegisterChallengePostApi(config, defLocale, response);
          },
        );
        cy.interceptIpAddressGetApi(config);
        cy.interceptPayuCreateOrderPostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        cy.fixture('apiPostPayuCreateOrderResponseNoRedirect.json').then(
          (responseBody) => {
            cy.interceptPayuCreateOrderPostApi(config, defLocale, responseBody);
          },
        );
      });
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('correctly loads discount coupon after refresh', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.fixture('apiGetRegisterChallengeVoucher95NotApplied.json').then(
          (registerChallengeApiResponse) => {
            cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
              // voucher 95% discount is applied
              cy.fixture('apiGetDiscountCouponResponse95.json').then(
                (voucherApiResponse) => {
                  // wait for register challenge GET API call
                  cy.waitForRegisterChallengeGetApi(
                    registerChallengeApiResponse,
                  );
                  // coupon is checked via API GET request
                  cy.waitForDiscountCouponApi(voucherApiResponse);
                  // extract current price from campaign data
                  const priceLevels = campaign.results[0].price_level;
                  const currentPriceLevels = getCurrentPriceLevelsUtil(
                    priceLevels,
                    new Date(systemTimeRegistrationPhase1May),
                  );
                  // current min price given the date
                  const defaultPaymentAmountMinMay =
                    currentPriceLevels[PriceLevelCategory.basic].price;
                  // go to step 2
                  cy.dataCy('step-1-continue')
                    .should('be.visible')
                    .and('not.be.disabled')
                    .click();
                  // select option voucher payment
                  cy.dataCy(getRadioOption(PaymentSubject.voucher))
                    .parents('.q-radio__label')
                    .siblings('.q-radio__inner')
                    .should('have.class', 'q-radio__inner--truthy');
                  // calculate discount amount
                  const discountAmountInt = Math.round(
                    defaultPaymentAmountMinMay -
                      (defaultPaymentAmountMinMay *
                        voucherApiResponse.results[0].discount) /
                        100,
                  );
                  // verify banner content
                  cy.dataCy('voucher-banner-code')
                    .should('be.visible')
                    .and('contain', voucherApiResponse.results[0].name);
                  cy.dataCy('voucher-banner-name')
                    .should('be.visible')
                    .and('contain', win.i18n.global.t('global.discount'))
                    .and('contain', voucherApiResponse.results[0].discount)
                    .and('contain', discountAmountInt);
                  // verify total amount
                  cy.dataCy('total-price-value')
                    .should('be.visible')
                    .and('contain', discountAmountInt);
                  // submit payment button should be visible and enabled
                  cy.dataCy('step-2-submit-payment')
                    .should('be.visible')
                    .and('not.be.disabled')
                    .click();
                  // wait for PayU create order API call
                  cy.fixture(
                    'apiPostPayuCreateOrderRequestVoucher95NoDonation.json',
                  ).then((request) => {
                    cy.fixture(
                      'apiPostPayuCreateOrderResponseNoRedirect.json',
                    ).then((response) => {
                      cy.waitForPayuCreateOrderPostApi(request, response);
                    });
                  });
                },
              );
            });
          },
        );
      });
    });
  });

  context('registration with selected full team', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeFullTeam.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        cy.interceptMyTeamGetApi(config, defLocale);
        cy.interceptMerchandiseGetApi(config, defLocale);
      });
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        // alias i18n
        cy.wrap(win.i18n).as('i18n');
      });
      // visit register challenge page
      cy.visit('#' + routesConf['register_challenge']['path']);
      cy.viewport('macbook-16');
    });

    it('allows to pass on full team if user is already a member', () => {
      cy.fixture('apiGetTeamsResponse.json').then((responseTeams) => {
        // we are on step 2
        cy.dataCy('step-2')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // go to step 3
        cy.dataCy('step-2-continue').click();
        // we are on step 3
        cy.dataCy('step-3')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // go to step 4
        cy.dataCy('step-3-continue').click();
        // we are on step 4
        cy.dataCy('step-4')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // go to step 5
        cy.dataCy('step-4-continue').click();
        // we are on step 5
        cy.dataCy('step-5')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // first teams request is to show teams in the table
        cy.waitForTeamsGetApi();
        // check that first team (full) is selected
        cy.dataCy('form-select-table-option')
          .first()
          .find('.q-radio__inner')
          .should('have.class', 'q-radio__inner--truthy');
        // check that first team option is disabled
        cy.dataCy('form-select-table-option')
          .first()
          .should('have.class', 'disabled')
          .and('contain', responseTeams.results[0].name);
        // click continue button
        cy.dataCy('step-5-continue').click();
        // second teams request is to refresh availability
        cy.waitForTeamsGetApi();
        // wait for my_team GET API call
        cy.waitForMyTeamGetApi();
        // check that we can pass to step 6
        cy.dataCy('step-6')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // on step 6 (merch) we should see merch options
        cy.dataCy('text-merch-unavailable').should('not.exist');
        cy.dataCy('no-merch').should('be.visible');
        cy.dataCy('list-merch-tabs').should('be.visible');
        cy.dataCy('form-merch-size-conversion-chart-link').should('be.visible');
        cy.dataCy('form-merch-phone-input').should('be.visible');
        cy.dataCy('phone-opt-in').should('be.visible');
      });
    });

    it('does not allow to pass on full team if user is not a member', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          cy.fixture('apiGetMyTeamResponseEmpty.json').then(
            (responseMyTeam) => {
              cy.fixture('apiGetTeamsResponse.json').then((responseTeams) => {
                // intercept my_team GET API call
                cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
                // we are on step 2
                cy.dataCy('step-2')
                  .find('.q-stepper__step-content')
                  .should('be.visible');
                // go to step 3
                cy.dataCy('step-2-continue').click();
                // we are on step 3
                cy.dataCy('step-3')
                  .find('.q-stepper__step-content')
                  .should('be.visible');
                // go to step 4
                cy.dataCy('step-3-continue').click();
                // we are on step 4
                cy.dataCy('step-4')
                  .find('.q-stepper__step-content')
                  .should('be.visible');
                // go to step 5
                cy.dataCy('step-4-continue').click();
                // we are on step 5
                cy.dataCy('step-5')
                  .find('.q-stepper__step-content')
                  .should('be.visible');
                // first teams request is to show teams in the table
                cy.waitForTeamsGetApi();
                // check that first team (full) is selected
                cy.dataCy('form-select-table-option')
                  .first()
                  .find('.q-radio__inner')
                  .should('have.class', 'q-radio__inner--truthy');
                // check that first team option is disabled
                cy.dataCy('form-select-table-option')
                  .first()
                  .should('have.class', 'disabled')
                  .and('contain', responseTeams.results[0].name);
                // click continue button
                cy.dataCy('step-5-continue').click();
                // second teams request is to refresh availability
                cy.waitForTeamsGetApi();
                // wait for my_team GET API call
                cy.waitForMyTeamGetApi(responseMyTeam);
                // check that we can pass to step 6
                cy.dataCy('step-5-continue').should('be.visible');
                // show error message
                cy.contains(
                  i18n.global.t(
                    'postRegisterChallenge.messageTeamMaxMembersReached',
                  ),
                ).should('be.visible');
                // check that team option stays disabled
                cy.dataCy('form-select-table-option')
                  .first()
                  .should('have.class', 'disabled')
                  .and('contain', responseTeams.results[0].name);
                // check that team option has been deselected
                cy.dataCy('form-select-table-option')
                  .first()
                  .find('.q-radio__inner')
                  .should('not.have.class', 'q-radio__inner--truthy')
                  .and('have.class', 'q-radio__inner--falsy');
              });
            },
          );
        });
      });
    });
  });

  /**
   * This test check behavior after going to PayU payment,
   * and clicking back button in browser.
   * UI initiates a periodic check for payment status, during which
   * other UI elements on payment step need to be disabled and an info
   * message needs to be displayed.
   */
  context('registration in process, waiting for individual payment', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.clock(systemTimeChallengeActive, [
        'Date',
        'setInterval',
        'clearInterval',
      ]).then((clock) => {
        cy.wrap(clock).as('clock');
        cy.task('getAppConfig', process).then((config) => {
          cy.wrap(config).as('config');
          // intercept register challenge API
          cy.fixture('refreshTokensResponseChallengeActive').then(
            (refreshTokensResponseChallengeActive) => {
              cy.fixture('loginRegisterResponseChallengeActive').then(
                (loginRegisterResponseChallengeActive) => {
                  cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                    config,
                    defLocale,
                    loginRegisterResponseChallengeActive,
                    null,
                    refreshTokensResponseChallengeActive,
                    null,
                    { has_user_verified_email_address: true },
                  );
                },
              );
            },
          );
          cy.interceptThisCampaignGetApi(config, defLocale);
          cy.fixture(
            'apiGetRegisterChallengeIndividualWaitingMinAmount.json',
          ).then((response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          });
          cy.fixture('apiPostRegisterChallengeResponsePaymentNone.json').then(
            (responseBody) => {
              cy.interceptRegisterChallengePostApi(
                config,
                defLocale,
                responseBody,
              );
            },
          );
          cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
          cy.interceptMyTeamGetApi(config, defLocale);
          cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
            (response) => {
              cy.interceptIsUserOrganizationAdminGetApi(
                config,
                defLocale,
                response,
              );
            },
          );
          cy.fixture('apiGetDiscountCouponResponseFull.json').then(
            (response) => {
              cy.interceptDiscountCouponGetApi(
                config,
                defLocale,
                response.results[0].name,
                response,
              );
            },
          );
          cy.fixture('apiPostPayuCreateOrderResponse.json').then(
            (responseBody) => {
              cy.interceptPayuCreateOrderPostApi(
                config,
                defLocale,
                responseBody,
              );
            },
          );
        });
      });
    });

    it('after going to PayU payment, runs periodic check for payment status (set-is-paid-from-ui-true)', () => {
      cy.get('@config').then((config) => {
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // go to register challenge page
          // wait for register challenge GET API
          cy.fixture(
            'apiGetRegisterChallengeIndividualWaitingMinAmount.json',
          ).then((response) => {
            cy.waitForRegisterChallengeGetApi(response);
          });
          // UI loader is visible
          cy.dataCy('waiting-for-payment-loader')
            .should('be.visible')
            .and(
              'contain',
              win.i18n.global.t(
                'register.challenge.textWaitingForPaymentLoader',
                {
                  seconds:
                    config.checkRegisterChallengeStatusMaxRepetitions *
                    config.checkRegisterChallengeStatusIntervalSeconds,
                },
              ),
            );
          // messages are visible
          cy.dataCy('payment-messages').should('be.visible');
          // UI shows message "waiting for payment"
          cy.dataCy('registration-payu-waiting-for-payment')
            .should('be.visible')
            .and(
              'contain',
              win.i18n.global.t('register.challenge.textPayuWaitingForPayment'),
            );
          // move clock forward by 1 minute
          cy.get('@clock').then((clock) => {
            clock.tick(
              1000 * 20 * config.checkRegisterChallengeStatusMaxRepetitions +
                1000,
            );
          });
          // check that total number of requests to register challenge GET API is 4
          cy.get('@getRegisterChallenge.all').should(
            'have.length',
            1 + config.checkRegisterChallengeStatusMaxRepetitions,
          );
          // after the check, loader is not visible
          cy.dataCy('waiting-for-payment-loader').should('not.exist');
          // UI does NOT show message "waiting for payment"
          cy.dataCy('registration-payu-waiting-for-payment').should(
            'not.exist',
          );
          // UI does NOT show message "waiting for coordinator"
          cy.dataCy('registration-waiting-for-confirmation').should(
            'not.exist',
          );
        });
      });
    });
  });

  context('Countdown before competition phase', () => {
    beforeEach(() => {
      cy.clock(systemTimeBeforeCompetitionStart, ['Date']);
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
          cy.interceptThisCampaignGetApi(config, defLocale, campaign);
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.waitForThisCampaignApi(campaign);
        });
        cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
        cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      });
      cy.viewport('macbook-16');
    });

    it('shows countdown before competition and hides it once competition starts', () => {
      cy.fixture('apiGetThisCampaignMay.json').then(() => {
        cy.clock(new Date(systemTimeBeforeCompetitionStart), ['Date']);
        cy.visit('#' + routesConf['register_challenge']['path']);
        // verify countdown is visible before competition phase
        cy.dataCy('top-bar-countdown').should('be.visible');
        // tick clock forward to competition phase start
        cy.tick(5000);
        // verify countdown is hidden after competition phase starts
        cy.dataCy('top-bar-countdown').should('not.exist');
      });
    });
  });

  context('registration without enabled merch', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.interceptThisCampaignGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi();
        cy.fixture('apiGetRegisterChallengeFullTeam.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        cy.interceptMyTeamGetApi(config, defLocale);
        cy.fixture('apiGetMerchandiseResponseUnavailable.json').then(
          (response) => {
            cy.fixture('apiGetMerchandiseResponseUnavailableNext').then(
              (responseNext) => {
                cy.interceptMerchandiseGetApi(
                  config,
                  defLocale,
                  response,
                  responseNext,
                );
              },
            );
          },
        );
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
        // visit register challenge page
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
      });
    });

    it('shows empty merch options when not available', () => {
      cy.fixture('apiGetTeamsResponse.json').then((responseTeams) => {
        // we are on step 2
        cy.dataCy('step-2')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // go to step 3
        cy.dataCy('step-2-continue').click();
        // we are on step 3
        cy.dataCy('step-3')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // go to step 4
        cy.dataCy('step-3-continue').click();
        // we are on step 4
        cy.dataCy('step-4')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // go to step 5
        cy.dataCy('step-4-continue').click();
        // we are on step 5
        cy.dataCy('step-5')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // first teams request is to show teams in the table
        cy.waitForTeamsGetApi();
        // check that first team (full) is selected
        cy.dataCy('form-select-table-option')
          .first()
          .find('.q-radio__inner')
          .should('have.class', 'q-radio__inner--truthy');
        // check that first team option is disabled
        cy.dataCy('form-select-table-option')
          .first()
          .should('have.class', 'disabled')
          .and('contain', responseTeams.results[0].name);
        // click continue button
        cy.dataCy('step-5-continue').click();
        // second teams request is to refresh availability
        cy.waitForTeamsGetApi();
        // wait for my_team GET API call
        cy.waitForMyTeamGetApi();
        // check that we can pass to step 6
        cy.dataCy('step-6')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // check that merch options are not visible
        cy.get('@i18n').then((i18n) => {
          cy.dataCy('text-merch-unavailable')
            .should('be.visible')
            .and('contain', i18n.global.t('form.merch.textMerchUnavailable'));
        });
        cy.dataCy('no-merch').should('be.visible');
        cy.dataCy('list-merch-tabs').should('not.be.visible');
        cy.dataCy('form-field-merch-size').should('not.exist');
        cy.dataCy('form-merch-size-conversion-chart-link').should('not.exist');
        cy.dataCy('form-merch-phone-input').should('be.visible');
        cy.dataCy('phone-opt-in').should('be.visible');
        // go to next step is disabled (validation)
        cy.dataCy('step-6-continue').should('be.disabled');
        // check the "no merch" checkbox
        cy.dataCy('form-merch-no-merch-checkbox').click();
        // go to next step is enabled
        cy.dataCy('step-6-continue').should('be.enabled');
      });
    });
  });
});

function checkActiveIcon(activeStep) {
  const steps = [1, 2, 3, 4, 5, 6, 7];
  steps.forEach((step) => {
    let expectedSrc;
    if (step === activeStep) {
      switch (step) {
        case 1:
          expectedSrc = activeIconImgSrcStepper1;
          break;
        case 2:
          expectedSrc = activeIconImgSrcStepper2;
          break;
        case 3:
          expectedSrc = activeIconImgSrcStepper3;
          break;
        case 4:
          expectedSrc = activeIconImgSrcStepper4;
          break;
        case 5:
          expectedSrc = activeIconImgSrcStepper5;
          break;
        case 6:
          expectedSrc = activeIconImgSrcStepper6;
          break;
        case 7:
          expectedSrc = activeIconImgSrcStepper7;
          break;
      }
    } else if (step < activeStep) {
      switch (step) {
        case 1:
          expectedSrc = doneIconImgSrcStepper1;
          break;
        case 2:
          expectedSrc = doneIconImgSrcStepper2;
          break;
        case 3:
          expectedSrc = doneIconImgSrcStepper3;
          break;
        case 4:
          expectedSrc = doneIconImgSrcStepper4;
          break;
        case 5:
          expectedSrc = doneIconImgSrcStepper5;
          break;
        case 6:
          expectedSrc = doneIconImgSrcStepper6;
          break;
        case 7:
          expectedSrc = doneIconImgSrcStepper7;
          break;
      }
    } else {
      switch (step) {
        case 1:
          expectedSrc = iconImgSrcStepper1;
          break;
        case 2:
          expectedSrc = iconImgSrcStepper2;
          break;
        case 3:
          expectedSrc = iconImgSrcStepper3;
          break;
        case 4:
          expectedSrc = iconImgSrcStepper4;
          break;
        case 5:
          expectedSrc = iconImgSrcStepper5;
          break;
        case 6:
          expectedSrc = iconImgSrcStepper6;
          break;
        case 7:
          expectedSrc = iconImgSrcStepper7;
          break;
      }
    }

    cy.dataCy(`step-${step}`)
      .find('img')
      .should('have.attr', 'src', expectedSrc);
  });
}
