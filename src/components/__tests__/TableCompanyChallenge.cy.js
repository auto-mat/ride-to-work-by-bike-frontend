import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import TableCompanyChallenge from 'components/coordinator/TableCompanyChallenge.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import testData from '../../../test/cypress/fixtures/tableCompanyChallengeTestData.json';
import { useAdminCompetitionStore } from '../../stores/adminCompetition';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
const iconSize = 18;

describe('<TableCompanyChallenge>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelChallengeName',
        'labelStartDate',
        'labelEndDate',
        'labelCompetitionType',
        'labelCompetitionTypeFrequency',
        'labelCompetitionTypeLength',
        'labelCompetitorType',
        'labelCompetitorTypeSingleUser',
        'labelCompetitorTypeTeam',
        'labelTransportTypes',
        'textNoData',
        'textNoResults',
        'textLoading',
        'textRowsPerPage',
      ],
      'table',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(TableCompanyChallenge, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('loads data from store and displays the table', () => {
      cy.wrap(useAdminCompetitionStore()).then((adminCompetitionStore) => {
        adminCompetitionStore.setCompetitions(testData.storeData);
      });
      cy.dataCy('table-company-challenge').should('be.visible');
      cy.dataCy('table-company-challenge-table')
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadius);
      // sorted competition data
      const competitions = testData.storeData.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      cy.dataCy('table-company-challenge-row')
        .should('be.visible')
        .and('have.color', grey10);
      if (competitions.length === 0) {
        // empty table state
        cy.dataCy('table-company-challenge-table').within(() => {
          cy.dataCy('table-company-challenge-row').should('not.exist');
        });
        cy.get('.q-table__bottom--nodata')
          .should('be.visible')
          .and('contain', i18n.global.t('table.textNoData'));
      } else {
        cy.dataCy('table-company-challenge-row').should(
          'have.length',
          competitions.length,
        );
        competitions.forEach((competition, competitionIndex) => {
          cy.dataCy('table-company-challenge-row')
            .eq(competitionIndex)
            .within(() => {
              // name
              cy.dataCy('table-company-challenge-name').should(
                'contain',
                competition.name,
              );
              // start date
              if (competition.date_from) {
                cy.dataCy('table-company-challenge-start-date').should(
                  'contain',
                  i18n.global.d(new Date(competition.date_from)),
                );
              }
              // end date
              if (competition.date_to) {
                cy.dataCy('table-company-challenge-end-date').should(
                  'contain',
                  i18n.global.d(new Date(competition.date_to)),
                );
              }
              // competition type
              cy.dataCy('table-company-challenge-competition-type').should(
                ($td) => {
                  const expectedText =
                    competition.competition_type === 'frequency'
                      ? i18n.global.t('table.labelCompetitionTypeFrequency')
                      : i18n.global.t('table.labelCompetitionTypeLength');
                  expect($td.text().trim()).to.equal(expectedText);
                },
              );
              // competitor type
              cy.dataCy('table-company-challenge-competitor-type').should(
                ($td) => {
                  const expectedText =
                    competition.competitor_type === 'team'
                      ? i18n.global.t('table.labelCompetitorTypeTeam')
                      : i18n.global.t('table.labelCompetitorTypeSingleUser');
                  expect($td.text().trim()).to.equal(expectedText);
                },
              );
              // transport types
              cy.dataCy('table-company-challenge-transport-types').within(
                () => {
                  cy.get('.q-icon').should(
                    'have.length',
                    competition.commute_modes.length,
                  );
                  // loop through icons
                  competition.commute_modes.forEach(
                    (commuteMode, iconIndex) => {
                      cy.get('.q-icon')
                        .eq(iconIndex)
                        .should('be.visible')
                        .and('have.color', grey10);
                      cy.get('.q-icon')
                        .eq(iconIndex)
                        .invoke('width')
                        .should('eq', iconSize);
                      cy.get('.q-icon')
                        .eq(iconIndex)
                        .invoke('height')
                        .should('eq', iconSize);
                    },
                  );
                },
              );
            });
        });
      }
    });

    it('displays empty state when no data', () => {
      cy.wrap(useAdminCompetitionStore()).then((adminCompetitionStore) => {
        adminCompetitionStore.setCompetitions([]);
      });
      cy.get('.q-table__bottom--nodata')
        .should('be.visible')
        .and('contain', i18n.global.t('table.textNoData'));
    });
  });
});
