import FormCompanyChallenge from 'components/form/FormCompanyChallenge.vue';
import { i18n } from '../../boot/i18n';
import { TransportType } from '../types/Route';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

describe('<FormCompanyChallenge>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelChallengeTitle',
        'labelChallengeDescription',
        'labelChallengeInfoUrl',
        'labelChallengeStart',
        'labelChallengeStop',
        'labelChallengeTitle',
        'labelChallengeType',
        'labelChallengeTypePerformance',
        'labelChallengeTypeRegularity',
        'labelParticipants',
        'labelParticipantsIndividuals',
        'labelParticipantsTeams',
        'labelParticipantsSubsidiaries',
        'labelTransportAcceptable',
      ],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.interceptCommuteModeGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormCompanyChallenge, {
        props: {},
      });
      cy.waitForCommuteModeApi();
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders dates in 2 col grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('date-column-start'), 50);
        cy.testElementPercentageWidth(cy.dataCy('date-column-stop'), 50);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.interceptCommuteModeGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormCompanyChallenge, {
        props: {},
      });
      cy.waitForCommuteModeApi();
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders dates stacked', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('date-column-start'), 100);
        cy.testElementPercentageWidth(cy.dataCy('date-column-stop'), 100);
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('form-company-challenge').should('be.visible');
    // challenge type
    cy.dataCy('form-challenge-type')
      .should('be.visible')
      .find('legend')
      .should('contain', i18n.global.t('form.labelChallengeType'));
    // option regularity
    cy.dataCy('form-challenge-type-regularity')
      .should('be.visible')
      .find('.q-radio__label')
      .should('contain', i18n.global.t('form.labelChallengeTypeRegularity'));
    // option performance
    cy.dataCy('form-challenge-type-performance')
      .should('be.visible')
      .find('.q-radio__label')
      .should('contain', i18n.global.t('form.labelChallengeTypePerformance'));
    // participants
    cy.dataCy('form-challenge-participants')
      .should('be.visible')
      .find('legend')
      .should('contain', i18n.global.t('form.labelParticipants'));
    // participants individuals
    cy.dataCy('form-participants-individuals')
      .should('be.visible')
      .find('.q-radio__label')
      .should('contain', i18n.global.t('form.labelParticipantsIndividuals'));
    // participants teams
    cy.dataCy('form-participants-teams')
      .should('be.visible')
      .find('.q-radio__label')
      .should('contain', i18n.global.t('form.labelParticipantsTeams'));
    // participants subsidiaries
    cy.dataCy('form-participants-subsidiaries')
      .should('be.visible')
      .find('.q-radio__label')
      .should('contain', i18n.global.t('form.labelParticipantsSubsidiaries'));
    // transport
    cy.dataCy('form-challenge-transport')
      .should('be.visible')
      .find('legend')
      .should('contain', i18n.global.t('form.labelTransportAcceptable'));
    // transport bike
    cy.dataCy(`form-acceptable-transport-${TransportType.bike}`)
      .should('be.visible')
      .find('.q-checkbox__label')
      .should('contain', i18n.global.t('routes.transport.bike'));
    // transport walk
    cy.dataCy(`form-acceptable-transport-${TransportType.walk}`)
      .should('be.visible')
      .find('.q-checkbox__label')
      .should('contain', i18n.global.t('routes.transport.walk'));
    // transport bus
    cy.dataCy(`form-acceptable-transport-${TransportType.bus}`)
      .should('be.visible')
      .find('.q-checkbox__label')
      .should('contain', i18n.global.t('routes.transport.bus'));
    // transport car
    cy.dataCy(`form-acceptable-transport-${TransportType.car}`)
      .should('be.visible')
      .find('.q-checkbox__label')
      .should('contain', i18n.global.t('routes.transport.car'));
    // transport none
    cy.dataCy(`form-acceptable-transport-${TransportType.none}`)
      .should('be.visible')
      .find('.q-checkbox__label')
      .should('contain', i18n.global.t('routes.transport.none'));
    // challenge title
    cy.dataCy('form-challenge-title')
      .should('be.visible')
      .find('label')
      .should('contain', i18n.global.t('form.labelChallengeTitle'));
    // challenge description
    cy.dataCy('form-challenge-description')
      .should('be.visible')
      .find('label')
      .should('contain', i18n.global.t('form.labelChallengeDescription'));
    // challenge info url
    cy.dataCy('form-challenge-info-url')
      .should('be.visible')
      .find('label')
      .should('contain', i18n.global.t('form.labelChallengeInfoUrl'));
    // challenge start
    cy.dataCy('form-challenge-start')
      .should('be.visible')
      .find('label')
      .should('contain', i18n.global.t('form.labelChallengeStart'));
    // challenge stop
    cy.dataCy('form-challenge-stop')
      .should('be.visible')
      .find('label')
      .should('contain', i18n.global.t('form.labelChallengeStop'));
  });
}
