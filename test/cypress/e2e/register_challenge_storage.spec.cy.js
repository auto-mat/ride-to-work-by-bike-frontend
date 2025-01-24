import {
  interceptOrganizationsApi,
  interceptRegisterCoordinatorApi,
} from '../support/commonTests';
import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import { getRegisterChallengeEmptyPersistentState } from '../../../src/utils/get_register_challenge_empty_state';
import { OrganizationType } from '../../../src/components/types/Organization';

describe('Register challenge storage', () => {
  beforeEach(() => {
    // clear local storage
    cy.clearLocalStorage();
    // load config
    cy.task('getAppConfig', process).then((config) => {
      // alias config
      cy.wrap(config).as('config');

      // intercept API calls
      cy.interceptThisCampaignGetApi(config, defLocale);
      cy.interceptRegisterChallengeGetApi(config, defLocale);

      cy.fixture('formOrganizationOptions').then((formOrganizationOptions) => {
        cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
          cy.fixture('apiPostRegisterChallengeResponsePaymentNone.json').then(
            (registerChallengeResponse) => {
              cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
                (responseIsUserOrganizationAdminFalse) => {
                  interceptOrganizationsApi(
                    config,
                    defLocale,
                    OrganizationType.company,
                  );
                  cy.interceptCitiesGetApi(config, defLocale);
                  // intercept query for subsidiaries of first organization
                  cy.interceptSubsidiariesGetApi(
                    config,
                    defLocale,
                    formOrganizationOptions[0].id,
                  );
                  // intercept query for subsidiaries of second organization
                  cy.interceptSubsidiariesGetApi(
                    config,
                    defLocale,
                    formOrganizationOptions[1].id,
                  );
                  cy.interceptSubsidiaryPostApi(
                    config,
                    defLocale,
                    formOrganizationOptions[0].id,
                  );
                  // intercept teams for first subsidiary
                  cy.interceptTeamsGetApi(
                    config,
                    defLocale,
                    formOrganizationOptions[0].subsidiaries[0].id,
                  );
                  // intercept teams for second subsidiary
                  cy.interceptTeamsGetApi(
                    config,
                    defLocale,
                    formOrganizationOptions[0].subsidiaries[1].id,
                  );
                  cy.interceptTeamPostApi(
                    config,
                    defLocale,
                    formOrganizationOptions[0].subsidiaries[0].id,
                  );
                  interceptOrganizationsApi(
                    config,
                    defLocale,
                    OrganizationType.company,
                  );
                  interceptOrganizationsApi(
                    config,
                    defLocale,
                    OrganizationType.school,
                  );
                  cy.interceptMerchandiseGetApi(config, defLocale);
                  cy.interceptRegisterChallengePostApi(
                    config,
                    defLocale,
                    registerChallengeResponse,
                  );
                  cy.interceptMerchandiseNoneGetApi(config, defLocale);
                  cy.interceptIpAddressGetApi(config);
                  cy.interceptPayuCreateOrderPostApi(config, defLocale);
                  interceptRegisterCoordinatorApi(config, defLocale);
                  cy.interceptIsUserOrganizationAdminGetApi(
                    config,
                    defLocale,
                    responseIsUserOrganizationAdminFalse,
                  );

                  // for first organization, intercept API call with response true
                  cy.fixture(
                    'apiGetHasOrganizationAdminResponseTrue.json',
                  ).then((response) => {
                    cy.interceptHasOrganizationAdminGetApi(
                      config,
                      defLocale,
                      formFieldCompanyResponse.results[0].id,
                      response,
                    );
                  });
                  // for second organization, intercept API call with response false
                  cy.fixture(
                    'apiGetHasOrganizationAdminResponseFalse.json',
                  ).then((response) => {
                    cy.interceptHasOrganizationAdminGetApi(
                      config,
                      defLocale,
                      formFieldCompanyResponse.results[1].id,
                      response,
                    );
                  });
                },
              );
            },
          );
        });
      });
    });
    cy.viewport('macbook-16');
    // config is defined without hash in the URL
    cy.visit('#' + routesConf['register_challenge']['path']);
    cy.window().should('have.property', 'i18n');
    cy.window().then((win) => {
      // alias i18n
      cy.wrap(win.i18n).as('i18n');
    });
    // wait for loading of campaign data
    cy.waitForThisCampaignApi();
  });

  it('handles local storage correctly during registration flow', () => {
    // verify initial state of persistent properties of registerChallenge store
    cy.fixture('apiGetIsUserOrganizationAdminResponseFalse.json').then(
      (response) => {
        cy.waitForIsUserOrganizationAdminApi(response);
        cy.window().then((win) => {
          const store = JSON.parse(
            win.localStorage.getItem('registerChallenge'),
          );
          const emptyPersistentState =
            getRegisterChallengeEmptyPersistentState();
          // update value that is fetched on mounted
          emptyPersistentState.isUserOrganizationAdmin =
            response.is_user_organization_admin;
          expect(store).to.deep.include(emptyPersistentState);
        });
      },
    );

    // go through registration
    cy.passToStep7();

    // verify state of persistent properties of registerChallenge store
    cy.window().then((win) => {
      const store = JSON.parse(win.localStorage.getItem('registerChallenge'));

      cy.fixture('registerChallengeLocalStorageCompletedVoucherFull.json').then(
        (persistentStateAfterRegistration) => {
          expect(store).to.deep.include(persistentStateAfterRegistration);
        },
      );
    });

    // complete registration
    cy.dataCy('step-7-continue').should('be.visible').click();

    // verify we are on homepage
    cy.dataCy('page-heading-title').should('be.visible');

    // log out
    cy.dataCy('user-select-desktop').within(() => {
      cy.dataCy('user-select-input').should('be.visible').click();
    });
    cy.get('@i18n').then((i18n) => {
      cy.dataCy('menu-item')
        .contains(i18n.global.t('userSelect.logout'))
        .click();
    });

    // verify that persistent properties of registerChallenge store are empty
    cy.window().then((win) => {
      const store = JSON.parse(win.localStorage.getItem('registerChallenge'));
      const emptyPersistentState = getRegisterChallengeEmptyPersistentState();
      expect(store).to.deep.include(emptyPersistentState);
    });
  });
});
