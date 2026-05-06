import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import {
  PaymentAmount,
  PaymentSubject,
} from '../../../src/components/enums/Payment';
import { getRadioOption } from '../../cypress/utils';

describe('Register Challenge - Payment step', () => {
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
  });

  context('voucher no reward registration', () => {
    it('resets payment state on voucher remove', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeVoucherFullWithoutReward.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
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
        cy.fixture('apiGetRegisterChallengeVoucherFullWithoutReward.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
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
