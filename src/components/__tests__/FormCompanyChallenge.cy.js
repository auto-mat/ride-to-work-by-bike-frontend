import FormCompanyChallenge from 'components/form/FormCompanyChallenge.vue';
import { i18n } from '../../boot/i18n';

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
        'labelParticipantsBranches',
        'labelTransportAcceptable',
        'labelTransportBike',
        'labelTransportBus',
        'labelTransportCar',
        'labelTransportNone',
        'labelTransportWalk',
      ],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormCompanyChallenge, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormCompanyChallenge, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-company-challenge').should('be.visible');
  });
}
