import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';

describe('Register Challenge - Merch Options No Price', () => {
  beforeEach(() => {
    cy.task('getAppConfig', process).then((config) => {
      cy.wrap(config).as('config');
      cy.fixture('apiGetThisCampaignJanuary.json').then((response) => {
        cy.interceptThisCampaignGetApi(config, defLocale, response);
        // visit challenge inactive page to load campaign data
        cy.visit('#' + routesConf['challenge_inactive']['path']);
        cy.waitForThisCampaignApi(response);
      });
      cy.interceptRegisterChallengePostApi(config, defLocale);
      cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
      cy.interceptMyTeamGetApi(config, defLocale);
      cy.fixture('apiGetMerchandiseResponseEmpty.json').then((response) => {
        cy.interceptMerchandiseGetApi(config, defLocale, response);
      });
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        // alias i18n
        cy.wrap(win.i18n).as('i18n');
      });
    });
  });

  context('registration without enabled merch', () => {
    it('shows banner "challenge does not feature merch"', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeFullTeam.json').then((response) => {
          cy.interceptRegisterChallengeGetApi(config, defLocale, response);
        });
        // visit register challenge page
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
      });
      // we are on step 2
      cy.dataCy('step-2').find('.q-stepper__step-content').should('be.visible');
      // go to step 3
      cy.dataCy('step-2-continue').click();
      // we are on step 3
      cy.dataCy('step-3').find('.q-stepper__step-content').should('be.visible');
      // go to step 4
      cy.dataCy('step-3-continue').click();
      // we are on step 4
      cy.dataCy('step-4').find('.q-stepper__step-content').should('be.visible');
      // go to step 5
      cy.dataCy('step-4-continue').click();
      // we are on step 5
      cy.dataCy('step-5').find('.q-stepper__step-content').should('be.visible');
      // first teams request is to show teams in the table
      cy.waitForTeamsGetApi();
      // check that first team (full) is selected
      cy.dataCy('form-select-table-option')
        .first()
        .find('.q-radio__inner')
        .should('have.class', 'q-radio__inner--truthy');
      // click continue button
      cy.dataCy('step-5-continue').click();
      // second teams request is to refresh availability
      cy.waitForTeamsGetApi();
      // wait for my_team GET API call
      cy.waitForMyTeamGetApi();
      // check that we can pass to step 6
      cy.dataCy('step-6').find('.q-stepper__step-content').should('be.visible');
      // check that merch options are not visible
      cy.dataCy('list-merch-tabs').should('not.be.visible');
      cy.dataCy('form-field-merch-size').should('not.exist');
      cy.dataCy('form-merch-size-conversion-chart-link').should('not.exist');
      // verify banner "no merch"
      cy.dataCy('text-merch-disabled').should('be.visible');
      cy.dataCy('text-no-merch-selected').should('not.exist');
      cy.dataCy('text-merch-unavailable').should('not.exist');
      // go to next step is enabled
      cy.dataCy('step-6-continue').should('be.enabled');
    });

    it('shows message on payment step on "no_admission" state', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeNoAdmission.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // visit register challenge page
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
        cy.get('@i18n').then((i18n) => {
          // we are on step 2
          cy.dataCy('step-2')
            .find('.q-stepper__step-content')
            .should('be.visible');
          cy.dataCy('banner-free-registration')
            .should('exist')
            .and('be.visible')
            .then(($el) => {
              const content = $el.text();
              cy.stripHtmlTags(
                i18n.global.t('register.challenge.textFreeRegistration', {
                  url: config.urlDonateJanuaryChallenge,
                  linkText: new URL(config.urlDonateJanuaryChallenge).hostname,
                }),
              ).then((text) => {
                expect(content).to.equal(text);
              });
            });
        });
      });
    });

    it('shows message on payment step on "done" state (automatic admission)', () => {
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeAutoAdmission.json').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
        // visit register challenge page
        cy.visit('#' + routesConf['register_challenge']['path']);
        cy.viewport('macbook-16');
        cy.get('@i18n').then((i18n) => {
          // we are on step 2
          cy.dataCy('step-2')
            .find('.q-stepper__step-content')
            .should('be.visible');
          cy.dataCy('banner-free-registration')
            .should('exist')
            .and('be.visible')
            .then(($el) => {
              const content = $el.text();
              cy.stripHtmlTags(
                i18n.global.t('register.challenge.textFreeRegistration', {
                  url: config.urlDonateJanuaryChallenge,
                  linkText: new URL(config.urlDonateJanuaryChallenge).hostname,
                }),
              ).then((text) => {
                expect(content).to.equal(text);
              });
            });
        });
      });
    });
  });
});
