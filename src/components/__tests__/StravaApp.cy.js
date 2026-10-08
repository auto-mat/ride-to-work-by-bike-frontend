import { createPinia, setActivePinia } from 'pinia';
import StravaApp from '@/components/routes/StravaApp.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '@/boot/global_vars';
import stravaAppStateTestData from '../../../test/cypress/fixtures/stravaAppStateTestData.json';

describe('<StravaApp>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelLastSync',
        'labelSyncAll',
        'buttonLinkToApp',
        'buttonDisconnect',
        'buttonSync',
        'labelSyncError',
        'statusSyncErrorWithMessage',
        'statusConnectedUser',
        'statusSyncSuccess',
        'statusSyncedTrips',
        'instructionStravaHowItWorks',
        'instructionSyncTripsFromStrava',
        'instructionSyncReadAllSettings',
        'instructionSyncWarnUser',
        'instructionStravaNotConnected',
        'titleStravaHowItWorks',
        'titleStravaNotConnected',
        'titleUserActivities',
      ],
      'routes',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getStravaAccount',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getStravaAccountSync',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getStravaAuthUrl',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'authStravaAccount',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'disconnectStravaAccount',
      i18n,
    );
  });

  context('mobile', () => {
    stravaAppStateTestData.forEach((testData) => {
      it(testData.description, () => {
        setActivePinia(createPinia());
        cy.viewport('iphone-6');
        cy.mount(StravaApp, {
          props: {},
        });
        // set store state
        cy.interceptGetStravaAccount(
          rideToWorkByBikeConfig,
          i18n,
          testData.fixture,
        );
        // check component is visible
        cy.dataCy('strava-app').should('be.visible');
        // open expansion item
        cy.dataCy('strava-app-expansion-item-header')
          .should('be.visible')
          .click();
        // check visible elements
        testData.visibleElements.forEach((element) => {
          cy.dataCy(element.selector)
            .should('be.visible')
            .then(($el) => {
              const content = $el.text();
              cy.stripHtmlTags(
                i18n.global.t(element.contain, element.containTranslationData),
              ).then((text) => {
                expect(content).to.contain(text);
              });
            });
        });
      });
    });
  });
});
