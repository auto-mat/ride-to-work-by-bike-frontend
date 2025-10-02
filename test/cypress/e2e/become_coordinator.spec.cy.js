import { routesConf } from '../../../src/router/routes_conf';
import {
  testDesktopSidebar,
  testMobileHeader,
  systemTimeChallengeActive,
} from '../support/commonTests';

describe('Become coordinator page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['become_coordinator']['path']);
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
    testDesktopSidebar();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['become_coordinator']['path']);
      cy.viewport('iphone-6');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
    testMobileHeader();
  });

  context('with authenticated user and API intercepts', () => {
    beforeEach(() => {
      // set system time to be in the correct active token window
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.wrap(config).as('config');
          // visit the login page to initialize i18n
          cy.visit('#' + routesConf['login']['path']);
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.wrap(win.i18n).as('i18n');
            // setup coordinator test environment
            cy.setupCoordinatorTest(
              config,
              win.i18n,
              'apiGetRegisterChallengeProfile.json',
            );
          });
        });
      });
    });

    it('submits form successfully and updates coordinator status', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.fixture('formBecomeCoordinator').then((testData) => {
          // check initial values in form
          cy.dataCy('form-coordinator-position')
            .find('input')
            .should('have.value', '');
          cy.dataCy('form-coordinator-phone')
            .find('input')
            .should('have.value', '');
          cy.dataCy('form-coordinator-responsibility')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
          // terms are checked based on registerChallenge data
          cy.dataCy('form-coordinator-terms')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--truthy');
          // check initial telephone value in store
          cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
            cy.dataCy('debug-register-challenge-store').within(() => {
              cy.dataCy('debug-telephone').should(
                'contain',
                response.results[0].personal_details.telephone,
              );
            });
          });
          cy.dataCy('form-coordinator-position')
            .find('input')
            .type(testData.input.jobTitle);
          cy.dataCy('form-coordinator-phone')
            .find('input')
            .type(testData.input.phone);
          cy.dataCy('form-coordinator-responsibility')
            .find('.q-checkbox__inner')
            .click();
          cy.dataCy('form-coordinator-submit').click();
          // check if correct payload is sent
          cy.waitForRegisterCoordinatorApi(testData.request);
          // code re-check isUserOrganizationAdmin status
          cy.wait('@getIsUserOrganizationAdmin');
          cy.contains(
            win.i18n.global.t('registerCoordinator.apiMessageSuccess'),
          ).should('be.visible');
          // check if telephone is set in store
          cy.dataCy('debug-register-challenge-store').within(() => {
            cy.dataCy('debug-telephone').should(
              'contain',
              testData.input.phone,
            );
          });
          // check that the form is reset
          cy.dataCy('form-coordinator-position')
            .find('input')
            .should('have.value', '');
          cy.dataCy('form-coordinator-phone')
            .find('input')
            .should('have.value', '');
          cy.dataCy('form-coordinator-responsibility')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--falsy');
          // terms are checked based on registerChallenge data
          cy.dataCy('form-coordinator-terms')
            .find('.q-checkbox__inner')
            .should('have.class', 'q-checkbox__inner--truthy');
        });
      });
    });
  });

  context('with missing personal details', () => {
    beforeEach(() => {
      // set system time to be in the correct active token window
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.wrap(config).as('config');
          // visit the login page to initialize i18n
          cy.visit('#' + routesConf['login']['path']);
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.wrap(win.i18n).as('i18n');
            // setup coordinator test environment with missing name fixture
            cy.setupCoordinatorTest(
              config,
              win.i18n,
              'apiGetRegisterChallengeProfileMissingName.json',
            );
          });
        });
      });
    });

    it('shows error when store lacks required personal details', () => {
      cy.window().then((win) => {
        cy.fixture('formBecomeCoordinator').then((testData) => {
          cy.dataCy('form-coordinator-position')
            .find('input')
            .type(testData.input.jobTitle);
          cy.dataCy('form-coordinator-phone')
            .find('input')
            .type(testData.input.phone);
          cy.dataCy('form-coordinator-responsibility')
            .find('.q-checkbox__inner')
            .click();
          cy.dataCy('form-coordinator-submit').click();
          // error message should be displayed
          cy.contains(
            win.i18n.global.t(
              'registerCoordinator.messageMissingPersonalDetails',
            ),
          );
          // no request should be sent
          cy.get('@registerCoordinator.all').should('have.length', 0);
        });
      });
    });
  });

  context('with missing organizationId', () => {
    beforeEach(() => {
      // set system time to be in the correct active token window
      cy.clock(systemTimeChallengeActive, ['Date']).then(() => {
        cy.task('getAppConfig', process).then((config) => {
          cy.wrap(config).as('config');
          // visit the login page to initialize i18n
          cy.visit('#' + routesConf['login']['path']);
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            cy.wrap(win.i18n).as('i18n');
            // setup coordinator test environment with missing organizationId fixture
            cy.setupCoordinatorTest(
              config,
              win.i18n,
              'apiGetRegisterChallengeProfileMissingOrganizationId.json',
            );
          });
        });
      });
    });

    it('shows error when organizationId is missing', () => {
      cy.window().then((win) => {
        cy.fixture('formBecomeCoordinator').then((testData) => {
          cy.dataCy('form-coordinator-position')
            .find('input')
            .type(testData.input.jobTitle);
          cy.dataCy('form-coordinator-phone')
            .find('input')
            .type(testData.input.phone);
          cy.dataCy('form-coordinator-responsibility')
            .find('.q-checkbox__inner')
            .click();
          cy.dataCy('form-coordinator-submit').click();
          // error message should be displayed
          cy.contains(
            win.i18n.global.t(
              'registerCoordinator.messageMissingOrganizationId',
            ),
          );
          // no request should be sent
          cy.get('@registerCoordinator.all').should('have.length', 0);
        });
      });
    });
  });
});

function coreTests() {
  it('renders title and description with icon', () => {
    cy.get('@i18n').then((i18n) => {
      // title
      cy.dataCy('company-coordinator-title')
        .should('be.visible')
        .then(($el) => {
          cy.wrap(
            i18n.global.t('companyCoordinator.titleBecomeCoordinator'),
          ).then((translation) => {
            expect($el.text()).to.eq(translation);
          });
        });
      // text
      cy.dataCy('company-coordinator-text')
        .should('be.visible')
        .then(($el) => {
          cy.stripHtmlTags(
            i18n.global.t('companyCoordinator.textBecomeCoordinator'),
          ).then((translation) => {
            expect($el.text()).to.eq(translation);
          });
        });
      // image
      cy.dataCy('company-coordinator-icon').should('be.visible');
    });
  });
}
