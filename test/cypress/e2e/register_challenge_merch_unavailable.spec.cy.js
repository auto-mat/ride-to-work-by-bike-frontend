import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Register Challenge - Merch unavailable', () => {
  beforeEach(() => {
    cy.task('getAppConfig', process).then((config) => {
      cy.wrap(config).as('config');
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.interceptThisCampaignGetApi(config, defLocale, response);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi(response);
      });
      cy.interceptRegisterChallengePostApi(config, defLocale, {});
      cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      // override merchandise with unavailable response
      cy.fixture('apiGetMerchandiseResponseUnavailable.json').then(
        (response) => {
          cy.fixture('apiGetMerchandiseResponseUnavailableNext.json').then(
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
      cy.interceptMyTeamGetApi(config, defLocale);
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });
  });

  context('merch step when merch is unavailable', () => {
    beforeEach(() => {
      cy.get('@config').then((config) => {
        /**
         * Payment: Individual - DONE
         * Is payment with reward on API: true
         * Is payment with reward stays the same because payment done
         */
        cy.fixture('apiGetRegisterChallengeFullTeam.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
        cy.dataCy('step-2')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.dataCy('step-2-continue')
          .should('be.visible')
          .and('not.be.disabled')
          .click();
        cy.dataCy('step-3')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.dataCy('step-3-continue').should('be.visible').click();
        cy.dataCy('step-4')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.dataCy('step-4-continue').should('be.visible').click();
        cy.dataCy('step-5')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.waitForTeamsGetApi();
        cy.dataCy('step-5-continue').should('be.visible').click();
        cy.waitForTeamsGetApi();
        cy.waitForMyTeamGetApi();
        cy.dataCy('step-6')
          .find('.q-stepper__step-content')
          .should('be.visible');
      });
    });

    it('shows merch unavailable banner with voucher code and shop link', () => {
      cy.get('@config').then((config) => {
        // verify merch unavailable banner
        cy.dataCy('text-merch-unavailable').should('be.visible');
        // no other banners shown
        cy.dataCy('text-merch-disabled').should('not.exist');
        cy.dataCy('text-no-merch-selected').should('not.exist');
        // banner contains shop voucher code from config
        cy.dataCy('text-merch-unavailable').should(
          'contain',
          config.shopVoucherCode,
        );
        // banner contains a link to shop URL from config
        cy.dataCy('text-merch-unavailable')
          .find('a')
          .should('have.attr', 'href', config.urlAutoMatShop)
          .and('have.attr', 'target', '_blank');
      });
    });

    it('continue button is enabled and proceeds to step 7', () => {
      cy.dataCy('step-6-continue')
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.dataCy('step-7').find('.q-stepper__step-content').should('be.visible');
    });
  });

  context('merch unavailable banner priority over no-merch-selected', () => {
    it('shows merch unavailable banner when payment is pending and merch is empty', () => {
      cy.get('@config').then((config) => {
        /**
         * Payment: Company - WAITING
         * Is payment with reward on API: true
         * Is payment with reward rewritten based on empty merch options
         */
        cy.viewport('macbook-16');
        cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            cy.visit('#' + routesConf['register_challenge']['path']);
            cy.waitForRegisterChallengeGetApi(response);
          },
        );
        cy.dataCy('step-1')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.dataCy('step-1-continue')
          .should('be.visible')
          .and('not.be.disabled')
          .click();
        cy.dataCy('step-2')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.dataCy('step-2-continue')
          .should('be.visible')
          .and('not.be.disabled')
          .click();
        cy.dataCy('step-3')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.dataCy('step-3-continue').should('be.visible').click();
        cy.dataCy('step-4')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.dataCy('step-4-continue').should('be.visible').click();
        cy.dataCy('step-5')
          .find('.q-stepper__step-content')
          .should('be.visible');
        cy.waitForTeamsGetApi();
        cy.dataCy('step-5-continue').should('be.visible').click();
        cy.waitForTeamsGetApi();
        cy.waitForMyTeamGetApi();
        cy.dataCy('step-6')
          .find('.q-stepper__step-content')
          .should('be.visible');
        // verify merch unavailable banner (over no-merch-selected banner)
        cy.dataCy('text-merch-unavailable').should('be.visible');
        cy.dataCy('text-no-merch-selected').should('not.exist');
      });
    });
  });
});
