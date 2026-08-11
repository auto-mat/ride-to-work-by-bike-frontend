import { createPinia, setActivePinia } from 'pinia';
import DiplomasList from 'components/diplomas/DiplomasList.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// selectors
const selectorEmptyState = 'diplomas-list-empty-state';
const selectorCards = 'diplomas-list-cards';
const selectorCard = 'diplomas-list-card';
const selectorCardName = 'diplomas-list-card-name';
const selectorCardYear = 'diplomas-list-card-year';
const selectorCardButtonDownload = 'diplomas-list-card-button-download';

describe('<DiplomasList>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['textEmptyState', 'buttonDownload'],
      'diplomas',
      i18n,
    );
  });

  context('no diplomas available', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          responseRegisterChallenge.results[0].diplomas = [];
          cy.interceptRegisterChallengeGetApi(
            rideToWorkByBikeConfig,
            i18n,
            responseRegisterChallenge,
          );
        },
      );
      cy.mount(DiplomasList, { props: {} });
      cy.viewport('macbook-16');
    });

    it('renders empty state and no cards', () => {
      cy.dataCy(selectorEmptyState)
        .should('be.visible')
        .and('contain', i18n.global.t('diplomas.textEmptyState'));
      cy.dataCy(selectorCards).should('not.exist');
    });
  });

  context('diplomas available', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          cy.interceptRegisterChallengeGetApi(
            rideToWorkByBikeConfig,
            i18n,
            responseRegisterChallenge,
          );
        },
      );
      cy.mount(DiplomasList, { props: {} });
      cy.viewport('macbook-16');
    });

    it('renders a card for each diploma with name, year and download button', () => {
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          const diplomas = responseRegisterChallenge.results[0].diplomas;
          cy.dataCy(selectorEmptyState).should('not.exist');
          cy.dataCy(selectorCard).should('have.length', diplomas.length);
          diplomas.forEach((diploma, index) => {
            cy.dataCy(selectorCard)
              .eq(index)
              .within(() => {
                cy.dataCy(selectorCardName).should('contain', diploma.name);
                cy.dataCy(selectorCardYear).should('contain', diploma.year);
                cy.dataCy(selectorCardButtonDownload)
                  .should('be.visible')
                  .and('not.be.disabled')
                  .and('contain', i18n.global.t('diplomas.buttonDownload'));
              });
          });
        },
      );
    });

    it('opens diploma URL in new tab when download button is clicked', () => {
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          const diploma = responseRegisterChallenge.results[0].diplomas[0];
          // stub window.open
          cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
          });
          cy.dataCy(selectorCardButtonDownload).first().click();
          cy.get('@windowOpen').should(
            'have.been.calledWith',
            diploma.url,
            '_blank',
          );
        },
      );
    });
  });

  context('diploma without a url', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          responseRegisterChallenge.results[0].diplomas[0].url = '';
          cy.interceptRegisterChallengeGetApi(
            rideToWorkByBikeConfig,
            i18n,
            responseRegisterChallenge,
          );
        },
      );
      cy.mount(DiplomasList, { props: {} });
      cy.viewport('macbook-16');
    });

    it('disables the download button', () => {
      cy.dataCy(selectorCardButtonDownload).first().should('be.disabled');
    });
  });
});
