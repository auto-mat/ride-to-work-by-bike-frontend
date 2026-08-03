import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import {
  PaymentAmount,
  PaymentSubject,
} from '../../../src/components/enums/Payment';
import { getRadioOption } from '../../cypress/utils';
import { systemTimeChallengeActive } from '../support/commonTests';

describe('Register Challenge - Payment step', () => {
  context('May challenge', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.fixture('apiGetThisCampaign.json').then((response) => {
          cy.interceptThisCampaignGetApi(config, defLocale, response);
          // visit challenge inactive page to load campaign data
          cy.visit('#' + routesConf['challenge_inactive']['path']);
          cy.waitForThisCampaignApi(response);
        });
        // intercept POST API request with empty response (payment not done)
        cy.interceptRegisterChallengePostApi(config, defLocale, {});
        cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
        cy.interceptMyTeamGetApi(config, defLocale);
        cy.interceptIsUserOrganizationAdminGetApi(config, defLocale);
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    context('empty registration', () => {
      it('shows correct price + action button in payment step', () => {
        cy.get('@config').then((config) => {
          cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          });
          // visit register challenge page
          cy.visit('#' + routesConf['register_challenge']['path']);
          cy.viewport('macbook-16');
          cy.passToStep2();

          // verify button text with different payment subjects
          cy.dataCy(getRadioOption(PaymentSubject.individual))
            .should('be.visible')
            .click();
          // enabled payment button
          cy.dataCy('step-2-submit-payment')
            .should('be.visible')
            .and('not.be.disabled');
          cy.dataCy('step-2-continue').should('not.exist');
          // subject voucher
          cy.dataCy(getRadioOption(PaymentSubject.voucher))
            .should('be.visible')
            .click();
          // disabled continue button (voucher not enabled)
          cy.dataCy('step-2-submit-payment').should('not.exist');
          cy.dataCy('step-2-continue').should('be.visible').and('be.disabled');
          // subject company
          cy.dataCy(getRadioOption(PaymentSubject.company))
            .should('be.visible')
            .click();
          // enabled continue button
          cy.dataCy('step-2-submit-payment').should('not.exist');
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');
          // subject school
          cy.dataCy(getRadioOption(PaymentSubject.school))
            .should('be.visible')
            .click();
          // enabled continue button
          cy.dataCy('step-2-submit-payment').should('not.exist');
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');

          // verify button on different individual price configurations
          cy.dataCy(getRadioOption(PaymentSubject.individual))
            .should('be.visible')
            .click();
          const paymentOptions = config.entryFeePaymentOptions.split(',');
          // verify payment button when switching price and without merch
          [...paymentOptions, PaymentAmount.custom].forEach((option) => {
            cy.dataCy(getRadioOption(option)).should('be.visible').click();
            cy.dataCy('step-2-submit-payment')
              .should('be.visible')
              .and('not.be.disabled');
            cy.dataCy('step-2-continue').should('not.exist');
            // without merch
            cy.switchToPaymentWithoutReward();
            cy.dataCy('step-2-submit-payment')
              .should('be.visible')
              .and('not.be.disabled');
            cy.dataCy('step-2-continue').should('not.exist');
            // back to with merch
            cy.switchToPaymentWithReward();
            cy.dataCy('step-2-submit-payment')
              .should('be.visible')
              .and('not.be.disabled');
            cy.dataCy('step-2-continue').should('not.exist');
          });
        });
      });
    });

    context('merch unavailable', () => {
      beforeEach(() => {
        cy.get('@config').then((config) => {
          // override merchandise intercept with empty response
          cy.fixture('apiGetMerchandiseResponseEmpty.json').then((response) => {
            cy.interceptMerchandiseGetApi(config, defLocale, response);
          });
        });
      });

      it('disables with-reward checkbox when merch is empty', () => {
        cy.get('@config').then((config) => {
          cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          });
          cy.visit('#' + routesConf['register_challenge']['path']);
          cy.viewport('macbook-16');
          cy.passToStep2();
          // checkbox is disabled when merchandise items are empty
          cy.dataCy('checkbox-payment-with-reward')
            .should('be.visible')
            .and('have.class', 'disabled')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
        });
      });

      it('rejects with-reward voucher when merch is empty', () => {
        cy.get('@config').then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            });
            cy.visit('#' + routesConf['register_challenge']['path']);
            cy.viewport('macbook-16');
            cy.passToStep2();
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            cy.fixture('apiGetDiscountCouponResponseFull.json').then(
              (apiResponse) => {
                cy.dataCy('form-field-voucher-input').type(
                  apiResponse.results[0].name,
                );
                cy.dataCy('form-field-voucher-submit').click();
                // voucher is rejected before API call when merch is unavailable
                cy.contains(
                  i18n.global.t('notify.voucherWithRewardUnavailable'),
                ).should('be.visible');
                // voucher banner was not created
                cy.dataCy('voucher-banner').should('not.exist');
              },
            );
          });
        });
      });

      it('accepts without-reward voucher when merch is empty', () => {
        cy.get('@config').then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            });
            cy.visit('#' + routesConf['register_challenge']['path']);
            cy.viewport('macbook-16');
            cy.passToStep2();
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            cy.applyVoucherFullWithoutReward(config, i18n);
            // continue button is enabled after applying without-reward voucher
            cy.dataCy('step-2-continue')
              .should('be.visible')
              .and('not.be.disabled');
          });
        });
      });

      it('shows tooltip on disabled checkbox and notify message when merchandise not available', () => {
        cy.get('@config').then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            });
            cy.visit('#' + routesConf['register_challenge']['path']);
            cy.viewport('macbook-16');
            cy.passToStep2();
            // verify checkbox disabled
            cy.dataCy('checkbox-payment-with-reward')
              .should('be.visible')
              .and('have.class', 'disabled');
            // Verify notify message
            cy.contains(
              i18n.global.t('register.challenge.tooltipMerchNotAvailable'),
            ).should('be.visible');
            // trigger tooltip
            cy.dataCy('checkbox-payment-with-reward').trigger('mouseenter');
            // verify tooltip message
            cy.dataCy('tooltip-merch-not-available')
              .should('exist')
              .and(
                'contain',
                i18n.global.t('register.challenge.tooltipMerchNotAvailable'),
              );
          });
        });
      });

      it('does not show tooltip when checkbox disabled due to active voucher', () => {
        cy.get('@config').then((config) => {
          cy.get('@i18n').then((i18n) => {
            cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
              cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            });
            cy.visit('#' + routesConf['register_challenge']['path']);
            cy.viewport('macbook-16');
            cy.passToStep2();
            // switch to voucher payment
            cy.dataCy(getRadioOption(PaymentSubject.voucher))
              .should('be.visible')
              .click();
            // apply voucher
            cy.applyVoucherFullWithoutReward(config, i18n);
            // verify checkbox disabled
            cy.dataCy('checkbox-payment-with-reward')
              .should('be.visible')
              .and('have.class', 'disabled');
            // Verify notify message
            cy.contains(
              i18n.global.t('register.challenge.tooltipMerchNotAvailable'),
            ).should('be.visible');
            // trigger hover - no tooltip
            cy.dataCy('checkbox-payment-with-reward').trigger('mouseenter');
            cy.dataCy('tooltip-merch-not-available').should('not.exist');
          });
        });
      });
    });

    context('voucher no reward registration', () => {
      it('resets payment state on voucher remove', () => {
        cy.get('@config').then((config) => {
          cy.fixture(
            'apiGetRegisterChallengeVoucherFullWithoutReward.json',
          ).then((response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          });
          cy.fixture('apiGetDiscountCouponResponseFullWithoutReward.json').then(
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
          // visit register challenge page
          cy.visit('#' + routesConf['register_challenge']['path']);
          cy.viewport('macbook-16');
          cy.fixture('apiGetDiscountCouponResponseFullWithoutReward.json').then(
            (response) => {
              cy.dataCy('voucher-banner-code')
                .should('exist')
                .and('be.visible')
                .and('contain', response.results[0].name);
            },
          );
          // verify reward state
          cy.dataCy('checkbox-payment-with-reward')
            .should('be.visible')
            .and('have.class', 'disabled')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
          // verify continue button enabled
          cy.dataCy('step-2-continue')
            .should('be.visible')
            .and('not.be.disabled');
          // remove voucher
          cy.dataCy('voucher-button-remove').should('be.visible').click();
          // verify reward state
          cy.dataCy('checkbox-payment-with-reward')
            .should('be.visible')
            .and('not.have.class', 'disabled')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
          // verify continue button disabled
          cy.dataCy('step-2-continue').should('be.visible').and('be.disabled');
        });
      });

      it('on refresh, updates reward state based on saved voucher', () => {
        cy.get('@config').then((config) => {
          cy.fixture(
            'apiGetRegisterChallengeVoucherFullWithoutReward.json',
          ).then((response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          });
          cy.fixture('apiGetDiscountCouponResponseFullWithoutReward.json').then(
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
          // visit register challenge page
          cy.visit('#' + routesConf['register_challenge']['path']);
          cy.viewport('macbook-16');
          cy.fixture('apiGetDiscountCouponResponseFullWithoutReward.json').then(
            (response) => {
              cy.dataCy('voucher-banner-code')
                .should('exist')
                .and('be.visible')
                .and('contain', response.results[0].name);
            },
          );
          // verify reward state
          cy.dataCy('checkbox-payment-with-reward')
            .should('be.visible')
            .and('have.class', 'disabled')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
          // remove voucher
          cy.dataCy('voucher-button-remove').should('be.visible').click();
          // verify reward state
          cy.dataCy('checkbox-payment-with-reward')
            .should('be.visible')
            .and('not.have.class', 'disabled')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
          // enable reward
          cy.dataCy('checkbox-payment-with-reward').click();
          // verify reward updated state
          cy.dataCy('checkbox-payment-with-reward')
            .should('be.visible')
            .and('not.have.class', 'disabled')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--truthy');
          // refresh page
          cy.reload();
          cy.fixture('apiGetDiscountCouponResponseFullWithoutReward.json').then(
            (response) => {
              cy.dataCy('voucher-banner-code')
                .should('exist')
                .and('be.visible')
                .and('contain', response.results[0].name);
            },
          );
          // verify reward state
          cy.dataCy('checkbox-payment-with-reward')
            .should('be.visible')
            .and('have.class', 'disabled')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
        });
      });
    });
  });

  context('September challenge without rewards', () => {
    const defaultPaymentAmountMin = 150;
    const tolerance = 5;

    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
          // visit the login page to initialize i18n
          cy.visit('#' + routesConf['login']['path']);
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            // alias i18n
            cy.wrap(win.i18n).as('i18n');
          });
          // intercept POST API request with empty response (payment not done)
          cy.interceptRegisterChallengePostApi(config, defLocale, {});
          cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
          cy.interceptMyTeamGetApi(config, defLocale);
          cy.interceptIsUserOrganizationAdminGetApi(config, defLocale);
        });
      });
    });

    it('shows correct price + custom price min value', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeEmpty.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        // intercept overrides
        cy.fixture('apiGetThisCampaignSeptember.json').then((response) => {
          cy.performAuthenticatedLogin(config, defLocale, response);
        });
        // visit register challenge page
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
        cy.passToStep2();
        // verify default payment amount
        cy.dataCy('form-field-payment-amount')
          .should('be.visible')
          .within(() => {
            cy.dataCy(getRadioOption(defaultPaymentAmountMin.toString()))
              .should('be.visible')
              .and('contain', defaultPaymentAmountMin.toString());
          });
        // select individual payment option
        cy.dataCy(getRadioOption(PaymentSubject.individual))
          .should('be.visible')
          .click();
        // select custom amount opiton
        cy.dataCy(getRadioOption(PaymentAmount.custom))
          .should('be.visible')
          .click();
        // verify custom amount slider
        cy.dataCy('form-field-payment-amount-custom')
          .should('be.visible')
          .within(() => {
            // default value of slider input is min payment value
            cy.dataCy('form-field-slider-number-input')
              .should('be.visible')
              .and('have.value', defaultPaymentAmountMin.toString());
            // move slider to left to verify min value
            cy.dataCy('form-field-slider-number-slider')
              .should('be.visible')
              .click('left');
            // verify min value
            cy.dataCy('form-field-slider-number-input').then(($input) => {
              const value = parseInt($input.val());
              // allow for small variation in slider value due to rounding
              expect(value).to.be.within(
                defaultPaymentAmountMin,
                defaultPaymentAmountMin + tolerance,
              );
            });
          });
        // verify payment button is enabled
        cy.dataCy('step-2-submit-payment')
          .should('be.visible')
          .and('not.be.disabled');
      });
    });
  });
});
