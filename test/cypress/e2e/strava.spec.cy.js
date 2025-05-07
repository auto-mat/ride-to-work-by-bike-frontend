// libraries
import { routesConf } from '../../../src/router/routes_conf';
import { StravaScope } from 'src/components/enums/Strava';
import { defLocale } from '../../../src/i18n/def_locale';

const validCode = 'example_valid_code';
const invalidCode = 'example_invalid_code';
describe('Strava Integration', () => {
  beforeEach(() => {
    cy.task('getAppConfig', process).then((config) => {
      cy.interceptCommuteModeGetApi(config, defLocale);
      cy.interceptTripsGetApi(config, defLocale);
      cy.fixture('apiGetOpenAppWithRestTokenNaKolePrahou').then(
        (responseNaKolePrahou) => {
          cy.interceptOpenAppWithRestTokenGetApi(
            config,
            defLocale,
            config.apiTripsThirdPartyAppIdNaKolePrahou,
            responseNaKolePrahou,
          );
        },
      );
      cy.fixture('apiGetOpenAppWithRestTokenCyclers').then(
        (responseCyclers) => {
          cy.interceptOpenAppWithRestTokenGetApi(
            config,
            defLocale,
            config.apiTripsThirdPartyAppIdCyclers,
            responseCyclers,
          );
        },
      );
      // alias config
      cy.wrap(config).as('config');
    });
    cy.visit(`#${routesConf['routes_list']['children']['fullPath']}`);
    cy.window().should('have.property', 'i18n');
    cy.window().then((win) => {
      // alias i18n
      cy.wrap(win.i18n).as('i18n');
    });
  });

  describe('Make a connection to Strava account', () => {
    it('should connect to Strava account (scope read)', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for account
          cy.interceptGetStravaAccount(
            config,
            i18n,
            'apiGetStravaAccountEmpty.json',
          );
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // wait for GET request
          cy.wait('@getStravaAccount');
          // intercept GET request for connect with scope
          // !auth_url in fixture response contains ?strava=test
          cy.interceptGetStravaConnectAccount(
            config,
            i18n,
            'apiGetStravaConnectExists.json',
            StravaScope.read,
          );
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          // shows connect button
          cy.dataCy('strava-app-connect-button').should('be.visible').click();
          // wait for GET request
          cy.wait('@getStravaConnectAccount');
          // validate redirect - url contains ?strava=test
          cy.url().should('include', '?strava=test');
        });
      });
    });

    it('should connect to Strava account (scope read_all)', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for account
          cy.interceptGetStravaAccount(
            config,
            i18n,
            'apiGetStravaAccountEmpty.json',
          );
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // wait for GET request
          cy.wait('@getStravaAccount');
          // intercept GET request for connect with scope
          // !auth_url in fixture response contains ?strava=test
          cy.interceptGetStravaConnectAccount(
            config,
            i18n,
            'apiGetStravaConnectExists.json',
            StravaScope.readAll,
          );
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          // shows toggle button for scope
          cy.dataCy('strava-app-sync-all-toggle').should('be.visible').check();
          // shows connect button
          cy.dataCy('strava-app-connect-button').should('be.visible').click();
          // wait for GET request
          cy.wait('@getStravaConnectAccount');
          // validate redirect - url contains ?strava=test
          cy.url().should('include', '?strava=test');
        });
      });
    });
  });

  describe('Successfully create new Strava account', () => {
    it('should successfully create new Strava account', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for auth with valid code
          cy.interceptGetStravaAuthWithParam(
            config,
            i18n,
            'apiGetStravaAuthCreated.json',
            validCode,
          );
          // visit routes_app page with valid code
          cy.visit(
            `#${routesConf['routes_app']['children']['fullPath']}?code=${validCode}`,
          );
          // verify loading state
          cy.dataCy('spinner-auth-strava')
            .should('be.visible')
            .and('contain', i18n.global.t('routes.titleRoutesConnectApps'));
          // wait for GET request
          cy.wait('@getStravaAuthWithParam');
          // verify success notification
          cy.contains(i18n.global.t('authStravaAccount.apiMessageSuccess'));
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          cy.fixture('apiGetStravaAuthCreated.json').then((response) => {
            // verify UI info
            cy.dataCy('strava-app-connected-user')
              .should('be.visible')
              .and('contain', response.account[0].strava_username)
              .and(
                'contain',
                `${response.account[0].first_name} ${response.account[0].last_name}`,
              );
          });
        });
      });
    });
  });

  describe('Successfully update existing Strava account', () => {
    it('should successfully update existing Strava account', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for auth with valid code
          cy.interceptGetStravaAuthWithParam(
            config,
            i18n,
            'apiGetStravaAuthUpdated.json',
            validCode,
          );
          // visit connect-apps page with valid code
          cy.visit(
            `#${routesConf['routes_app']['children']['fullPath']}?code=${validCode}`,
          );
          // verify loading state
          cy.dataCy('spinner-auth-strava')
            .should('be.visible')
            .and('contain', i18n.global.t('routes.titleRoutesConnectApps'));
          // await GET request
          cy.wait('@getStravaAuthWithParam');
          // verify success notification
          cy.contains(i18n.global.t('authStravaAccount.apiMessageSuccess'));
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // check that URL no longer contains code
          cy.url().should('not.include', `?code=${validCode}`);
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          cy.fixture('apiGetStravaAuthUpdated.json').then((response) => {
            // verify UI info
            cy.dataCy('strava-app-connected-user')
              .should('be.visible')
              .and('contain', response.account[0].strava_username)
              .and(
                'contain',
                `${response.account[0].first_name} ${response.account[0].last_name}`,
              );
          });
        });
      });
    });
  });

  describe('Error during auth to Strava account - invalid code', () => {
    it('should handle invalid auth code', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for auth with invalid code
          cy.interceptGetStravaAuthWithParam(
            config,
            i18n,
            'apiGetStravaAuthError.json',
            invalidCode,
          );
          // visit connect-apps page with invalid code
          cy.visit(
            `#${routesConf['routes_app']['children']['fullPath']}?code=${invalidCode}`,
          );
          // verify loading state
          cy.dataCy('spinner-auth-strava')
            .should('be.visible')
            .and('contain', i18n.global.t('routes.titleRoutesConnectApps'));
          // await GET request
          cy.wait('@getStravaAuthWithParam');
          // verify error notification
          cy.contains(
            i18n.global.t('authStravaAccount.apiMessageErrorWithMessage'),
          );
          // check that URL no longer contains code
          cy.url().should('not.include', `?code=${invalidCode}`);
        });
      });
    });
  });

  describe('Manage connect to and disconnect from Strava account', () => {
    beforeEach(() => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for account
          cy.interceptGetStravaAccount(
            config,
            i18n,
            'apiGetStravaAccountExists.json',
          );
        });
      });
    });

    it('should successfully disconnect Strava account', () => {
      // mock successful disconnect response
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // mock successful disconnect response
          cy.interceptGetStravaDisconnect(
            config,
            i18n,
            'apiGetStravaDeleteAccountSuccess.json',
          );
          cy.wait('@getStravaAccount');
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          // click disconnect button
          cy.dataCy('strava-app-disconnect-button')
            .should('be.visible')
            .click();
          // wait for disconnect request
          cy.wait('@getStravaDisconnect');
          // verify account is disconnected
          cy.dataCy('strava-app-connect-button').should('be.visible');
        });
      });
    });

    it('should handle disconnect error', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // mock error disconnect response
          cy.interceptGetStravaDisconnect(
            config,
            i18n,
            'apiGetStravaDeleteAccountError.json',
          );
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          // click disconnect button
          cy.dataCy('strava-app-disconnect-button')
            .should('be.visible')
            .click();
          // wait for disconnect request
          cy.wait('@getStravaDisconnect');
          // verify error notification
          cy.contains(
            i18n.global.t('disconnectStravaAccount.apiMessageError'),
          ).should('be.visible');
        });
      });
    });
  });

  describe('Manually sync activities from Strava account', () => {
    beforeEach(() => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for account
          cy.interceptGetStravaAccount(
            config,
            i18n,
            'apiGetStravaAccountExists.json',
          );
        });
      });
    });

    it('should successfully sync activities from Strava account', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for sync account
          cy.interceptGetStravaSyncAccount(
            config,
            i18n,
            'apiGetStravaAccountHasSyncedItems.json',
          );
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // wait for GET request
          cy.wait('@getStravaAccount');
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          // click sync button
          cy.dataCy('strava-app-sync-button').should('be.visible').click();
          // wait for sync request
          cy.wait('@getStravaSyncAccount');
          cy.get('@getStravaSyncAccount.all').should('have.length', 1);
          // verify success notification
          cy.contains(i18n.global.t('getStravaAccountSync.apiMessageSuccess'));
          // verify UI sync message
          cy.fixture('apiGetStravaAccountHasSyncedItems.json').then(
            (response) => {
              cy.dataCy('strava-app-status-sync-success')
                .should('be.visible')
                .and('contain', i18n.global.t('routes.statusSyncSuccess'));
              cy.dataCy('strava-app-status-synced-trips')
                .should('be.visible')
                .and(
                  'contain',
                  i18n.global.t('routes.statusSyncedTrips', {
                    syncedTrips:
                      response.results[0].sync_outcome.result.synced_trips,
                    newTrips: response.results[0].sync_outcome.result.new_trips,
                  }),
                );
              cy.dataCy('strava-app-user-activities-title')
                .should('be.visible')
                .and('contain', i18n.global.t('routes.titleUserActivities'));
              response.results[0].sync_outcome.result.activities.forEach(
                (activity) => {
                  cy.dataCy('strava-app-user-activities-list')
                    .should('be.visible')
                    .and('contain', activity);
                },
              );
            },
          );
        });
      });
    });

    it('displays warning when number of sync attempts is high', () => {
      cy.get('@config').then((config) => {
        cy.get('@i18n').then((i18n) => {
          // intercept GET request for sync account
          cy.interceptGetStravaSyncAccount(
            config,
            i18n,
            'apiGetStravaAccountHasSyncCountWarning.json',
          );
          // visit app page
          cy.visit(`#${routesConf['routes_app']['children']['fullPath']}`);
          // wait for GET request
          cy.wait('@getStravaAccount');
          // check component is visible
          cy.dataCy('strava-app').should('be.visible');
          // open expansion item
          cy.dataCy('strava-app-expansion-item-header')
            .should('be.visible')
            .click();
          // click sync button
          cy.dataCy('strava-app-sync-button').should('be.visible').click();
          // wait for sync request
          cy.wait('@getStravaSyncAccount');
          cy.get('@getStravaSyncAccount.all').should('have.length', 1);
          // verify success notification
          cy.contains(i18n.global.t('getStravaAccountSync.apiMessageSuccess'));
          // verify UI warning
          cy.dataCy('strava-app-instruction-sync-warn-user')
            .should('be.visible')
            .then(($el) => {
              const content = $el.text();
              cy.stripHtmlTags(
                i18n.global.t('routes.instructionSyncWarnUser'),
              ).then((text) => {
                expect(content).to.contain(text);
              });
            });
        });
      });
    });
  });
});
