import {
  interceptOrganizationsApi,
  testLanguageSwitcher,
  testBackgroundImage,
  interceptRegisterCoordinatorApi,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { OrganizationType } from '../../../src/components/types/Organization';
import { getRadioOption } from 'test/cypress/utils';
import { PaymentSubject } from 'src/components/enums/Payment';
import { defLocale } from '../../../src/i18n/def_locale';
import { getCurrentPriceLevelsUtil } from '../../../src/utils/price_levels';
import { PriceLevelCategory } from '../../../src/components/enums/Challenge';

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

const paymentAmountDonation = 500;

describe('Register Challenge page', () => {
  let defaultPaymentAmountMin = 0;

  before(() => {
    // dynamically load default payment amount from fixture
    cy.fixture('apiGetThisCampaign.json').then((response) => {
      const priceLevels = response.results[0].price_level;
      const currentPriceLevels = getCurrentPriceLevelsUtil(priceLevels);
      defaultPaymentAmountMin =
        currentPriceLevels[PriceLevelCategory.basic].price;
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.interceptThisCampaignGetApi(config, defLocale);
        cy.interceptRegisterChallengeGetApi(config, defLocale);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
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
              cy.interceptSubsidiaryPostApi(
                config,
                win.i18n,
                formOrganizationOptions[0].id,
              );
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
              // intercept without specific response (it is not used)
              cy.interceptRegisterChallengePostApi(config, win.i18n);
              cy.interceptMerchandiseNoneGetApi(config, win.i18n);
              cy.interceptIpAddressGetApi(config);
              cy.interceptPayuCreateOrderPostApi(config, win.i18n);
              interceptRegisterCoordinatorApi(config, win.i18n);

              cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                (responseIsUserOrganizationAdminFalse) => {
                  cy.interceptIsUserOrganizationAdminGetApi(
                    config,
                    win.i18n,
                    responseIsUserOrganizationAdminFalse,
                  );
                },
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
      // click
      cy.dataCy('step-1-continue').should('be.visible').click();
      // on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
      checkActiveIcon(2);
    });

    it('sends correct create order request for different payment configurations', () => {
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
              passToStep2();
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
          passToStep2();
          cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
            (responseIsUserOrganizationAdminFalse) => {
              // user status should reload
              cy.waitForIsUserOrganizationAdminApi(
                responseIsUserOrganizationAdminFalse,
              );
            },
          );
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

    it('pre-selects company in step 3 based on payment subject', () => {
      cy.get('@i18n').then((i18n) => {
        passToStep2();
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
        passToStep2();
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
      passToStep4();
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

    it('allows user to create a new subsidiary address', () => {
      passToStep4();
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
          cy.dataCy('form-company-address-input')
            .find('input')
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
      passToStep5();
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
        passToStep6();
        checkActiveIcon(6);
        // by default, next step button is disabled
        cy.dataCy('step-6-continue').should('be.visible').and('be.disabled');
        // check no merch checkbox
        cy.dataCy('form-merch-no-merch-checkbox').should('be.visible').click();
        cy.waitForMerchandiseNoneApi();
        // go to next step
        cy.dataCy('step-6-continue')
          .should('be.visible')
          .and('not.be.disabled')
          .click();
        cy.dataCy('step-6')
          .find('.q-stepper__step-content')
          .should('not.exist');
        cy.dataCy('step-7')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // go back to step 6
        cy.dataCy('step-7-back').should('be.visible').click();
        cy.dataCy('step-6')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // uncheck no merch checkbox
        cy.dataCy('form-merch-no-merch-checkbox').should('be.visible').click();
        // next step button is disabled
        cy.dataCy('step-6-continue').should('be.visible').and('be.disabled');
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
      });
    });

    it('allows user to create a new team', () => {
      passToStep5();
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
      passToStep7();

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
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          passToStep2();
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
          passToStep2();
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
        // go to payment step
        passToStep2();
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
      });
    });

    it('when school pays - disables other participation options', () => {
      cy.get('@i18n').then((i18n) => {
        // go to payment step
        passToStep2();
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
            .and('contain', i18n.global.t('form.participation.labelColleagues'))
            .and('contain', i18n.global.t('form.participation.labelFamily'));
        });
      });
    });

    it('when individual payment - all participation options are enabled', () => {
      // go to payment step
      passToStep2();
      // select individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      cy.dataCy(getRadioOption(paymentAmountDonation)).click();
      // submit payment
      cy.dataCy('step-2-submit-payment').should('be.visible').click();
      cy.waitForPayuCreateOrderPostApi();
      // window is redirected to given url
      cy.url().should('not.include', routesConf['register_challenge']['path']);
    });

    it('when voucher payment - all participation options are enabled', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // go to payment step
          passToStep2();
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

    it('shows correct summary data on summary step', () => {
      cy.get('@i18n').then((i18n) => {
        passToStep7();
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
        passToStep2();
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
      passToStep5();
      // select a team
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
      // select a different address
      cy.dataCy('form-company-address')
        .should('be.visible')
        .find('.q-field__append')
        .last()
        .click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').eq(1).click();
        });
      cy.dataCy('step-4-continue').should('be.visible').click();
      // team is reset (check debug component)
      cy.dataCy('debug-register-challenge-ids')
        .should('be.visible')
        .within(() => {
          cy.dataCy('debug-team-id-value').should('be.empty');
        });
      // select a team
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
      // select a different organization
      cy.dataCy('form-select-table-company')
        .should('be.visible')
        .find('.q-radio:not(.disabled)')
        .eq(1)
        .click();
      // subsidiary and team are reset (check debug component)
      cy.dataCy('debug-register-challenge-ids')
        .should('be.visible')
        .within(() => {
          cy.dataCy('debug-subsidiary-id-value').should('be.empty');
          cy.dataCy('debug-team-id-value').should('be.empty');
        });
      // select the first organization
      cy.dataCy('form-select-table-company')
        .should('be.visible')
        .find('.q-radio:not(.disabled)')
        .first()
        .click();
      // set subsidiary
      cy.dataCy('form-company-address')
        .should('be.visible')
        .find('.q-field__append')
        .last()
        .click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // go to step 5
      cy.dataCy('step-4-continue').should('be.visible').click();
      // select a team
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
    });

    it('when voucher FULL + donation, submits step before creating PayU order', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          passToStep2();
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
        });
      });
    });

    it('submits form state on 1st 2nd, 5th and 6th step', () => {
      passToStep2();
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
      // test API post request (payment)
      cy.fixture('apiPostRegisterChallengePaymentRequest.json').then(
        (request) => {
          cy.waitForRegisterChallengePostApi(request);
        },
      );
      // participation is preselected - continue
      cy.dataCy('step-3-continue').should('be.visible').click();
      // organization is preselected - select address
      cy.dataCy('form-company-address').should('be.visible').click();
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
      cy.fixture('apiPostRegisterChallengeTeamRequest.json').then((request) => {
        cy.waitForRegisterChallengePostApi(request);
      });
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

    it('displays correct nav buttons on payment step based on payment configuration', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // pass to step 2 (payment)
          passToStep2();

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
        },
      );
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
        cy.interceptRegisterChallengePostApi(config, defLocale);
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
        cy.interceptRegisterChallengePostApi(config, defLocale);
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
            'step-2-no-admission-message-payu',
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
        cy.interceptRegisterChallengePostApi(config, defLocale);
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
            cy.waitForRegisterChallengeGetApi(response);
            // we get moved to step 2
            cy.dataCy('step-2')
              .find('.q-stepper__step-content')
              .should('be.visible');
            // message "waiting for payment" is displayed
            cy.dataCy('step-2-waiting-for-payment-message').should(
              'be.visible',
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
        cy.interceptRegisterChallengePostApi(config, defLocale);
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
            'step-2-no-admission-message',
          );
        },
      );
    });
  });

  context('registration in progress, company payment "waiting"', () => {
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
        cy.interceptRegisterChallengePostApi(config, defLocale);
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
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
            // go to next step
            cy.dataCy('step-2-continue')
              .should('be.visible')
              .and('not.be.disabled')
              .click();
            cy.testRegisterChallengeLoadedStepsThreeToFive(
              win.i18n,
              registerChallengeResponse,
            );
            cy.testRegisterChallengeLoadedStepSix(
              win.i18n,
              registerChallengeResponse,
            );
            cy.dataCy('step-7-registration-waiting-message')
              .should('be.visible')
              .and(
                'contain',
                win.i18n.global.t(
                  'register.challenge.textRegistrationWaitingForConfirmation',
                ),
              );
            cy.dataCy('step-7-continue')
              .should('be.visible')
              .and('be.disabled');
          },
        );
      });
    });
  });

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
          cy.interceptRegisterChallengePostApi(config, defLocale);
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
              // message "waiting for confirmation" is displayed
              cy.dataCy('step-7-registration-waiting-message')
                .should('be.visible')
                .and(
                  'contain',
                  win.i18n.global.t(
                    'register.challenge.textRegistrationWaitingForConfirmation',
                  ),
                );
              cy.dataCy('step-7-continue')
                .should('be.visible')
                .and('be.disabled');
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
        cy.interceptRegisterChallengePostApi(config, defLocale);
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
});

function passToStep2() {
  cy.fixture('apiPostRegisterChallengePersonalDetailsRequest').then(
    (personalDetailsRequest) => {
      cy.dataCy('form-firstName-input').type(personalDetailsRequest.first_name);
      cy.dataCy('form-lastName-input').type(personalDetailsRequest.last_name);
      cy.dataCy('form-nickname-input').type(personalDetailsRequest.nickname);
      cy.dataCy('newsletter-option').each((newsletterOption) => {
        cy.wrap(newsletterOption).click();
      });
      cy.dataCy('form-personal-details-gender')
        .find('.q-radio__label')
        .first()
        .click();
      cy.dataCy('step-1-continue').should('be.visible').click();
      cy.dataCy('step-1-continue').find('.q-spinner').should('be.visible');
      // on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
    },
  );
}

function passToStep3() {
  cy.get('@config').then((config) => {
    cy.get('@i18n').then((i18n) => {
      passToStep2();
      // payment - choose a free pass voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      cy.applyFullVoucher(config, i18n);
      // next step button should be visible and enabled
      cy.dataCy('step-2-continue').should('be.visible').click();
      cy.dataCy('step-2-continue').find('.q-spinner').should('be.visible');
      // on step 3
      cy.dataCy('step-3').find('.q-stepper__step-content').should('be.visible');
    });
  });
}

function passToStep4() {
  passToStep3();
  cy.dataCy('form-field-option').first().click();
  cy.dataCy('step-3-continue').should('be.visible').click();
  // step 3 skip check for loading spinner (not sending data to API)
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
  // step 4 skip check for loading spinner (not sending data to API)
  // on step 5
  cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
}

function passToStep6() {
  passToStep5();
  // select a team
  cy.dataCy('form-select-table-team')
    .should('be.visible')
    .find('.q-radio:not(.disabled)')
    .first()
    .click();
  cy.dataCy('step-5-continue').should('be.visible').click();
  cy.dataCy('step-5-continue').find('.q-spinner').should('be.visible');
  // on step 6
  cy.dataCy('step-6').find('.q-stepper__step-content').should('be.visible');
}

function passToStep7() {
  passToStep6();
  cy.fixture('apiPostRegisterChallengeMerchandiseRequest').then((request) => {
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
    cy.dataCy('form-merch-phone-opt-in-input').should('be.visible').click();
    // go to next step
    cy.dataCy('step-6-continue').should('be.visible').click();
    cy.dataCy('step-6-continue').find('.q-spinner').should('be.visible');
    // on step 7
    cy.dataCy('step-7').find('.q-stepper__step-content').should('be.visible');
  });
}

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
