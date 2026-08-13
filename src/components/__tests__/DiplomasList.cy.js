import { createPinia, setActivePinia } from 'pinia';
import DiplomasList from 'components/diplomas/DiplomasList.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

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
          responseRegisterChallenge.results[0].personal_details.diplomas = [];
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
      cy.dataCy('diplomas-list-empty-state')
        .should('be.visible')
        .and('contain', i18n.global.t('diplomas.textEmptyState'));
      cy.dataCy('diplomas-list-cards').should('not.exist');
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
          const diplomas =
            responseRegisterChallenge.results[0].personal_details.diplomas;
          cy.dataCy('diplomas-list-empty-state').should('not.exist');
          cy.dataCy('diplomas-list-card').should(
            'have.length',
            diplomas.length,
          );
          diplomas.forEach((diploma, index) => {
            cy.dataCy('diplomas-list-card')
              .eq(index)
              .within(() => {
                cy.dataCy('diplomas-list-card-name').should(
                  'contain',
                  diploma.name,
                );
                cy.dataCy('diplomas-list-card-year').should(
                  'contain',
                  diploma.year,
                );
                cy.dataCy('diplomas-list-card-button-download')
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
          const diploma =
            responseRegisterChallenge.results[0].personal_details.diplomas[0];
          // stub window.open
          cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
          });
          cy.dataCy('diplomas-list-card-button-download').first().click();
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
          responseRegisterChallenge.results[0].personal_details.diplomas[0].url =
            '';
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
      cy.dataCy('diplomas-list-card-button-download')
        .first()
        .should('be.disabled');
    });
  });
});
