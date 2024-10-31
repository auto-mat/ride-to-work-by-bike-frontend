import { colors } from 'quasar';

import CardStats from '../homepage/CardStats.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import {
  StatisticsId,
  StatisticsCategoryId,
} from 'components/types/Statistics';
import { useStats } from '../../composables/useStats';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

const { borderRadiusCard } = rideToWorkByBikeConfig;

const iconSizeLg = 24;
const iconSizeSm = 18;
const fontSizeSm = 14;
const fontWeightRegular = 400;
const fontWeightBold = 700;

// selectors
const selectorCardStatsItem = 'card-stats-item';
const selectorCardStatsItemIcon = 'card-stats-item-icon';
const selectorCardStatsItemValue = 'card-stats-item-value';
const selectorCardStatsItemLabel = 'card-stats-item-label';
const selectorCardStatsItemLabelUnit = 'card-stats-item-label-unit';

const { getResultStatistics } = useStats();

describe('<CardStats>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelPersonal', 'labelTeam', 'labelOrganization', 'labelCity'],
      'cardStats',
      i18n,
    );
  });

  context('card personal', () => {
    beforeEach(() => {
      cy.mount(CardStats, {
        props: {
          category: StatisticsCategoryId.personal,
        },
      });
      cy.fixture('memberResults.json').then((response) => {
        cy.wrap(response.results).as('results');
        cy.wrap(getResultStatistics(response.results)).as('stats');
      });
      cy.viewport('macbook-16');
    });

    commonTests();

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-stats-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', primary)
          .and('contain', i18n.global.t('cardStats.labelPersonal'));
      });
    });
  });

  context('card team', () => {
    beforeEach(() => {
      cy.mount(CardStats, {
        props: {
          category: StatisticsCategoryId.team,
        },
      });
      cy.fixture('teamResults.json').then((response) => {
        cy.wrap(response.results).as('results');
        cy.wrap(getResultStatistics(response.results)).as('stats');
      });
      cy.viewport('macbook-16');
    });

    commonTests();

    it('renders title', () => {
      cy.dataCy('card-stats-title').should(
        'contain',
        i18n.global.t('cardStats.labelTeam'),
      );
    });
  });

  context('card organization', () => {
    beforeEach(() => {
      cy.mount(CardStats, {
        props: {
          category: StatisticsCategoryId.organization,
        },
      });
      cy.fixture('organizationResults.json').then((response) => {
        cy.wrap(response.results).as('results');
        cy.wrap(getResultStatistics(response.results)).as('stats');
      });
    });

    commonTests();

    it('renders title', () => {
      cy.dataCy('card-stats-title').should(
        'contain',
        i18n.global.t('cardStats.labelOrganization'),
      );
    });
  });

  context('card city', () => {
    beforeEach(() => {
      cy.mount(CardStats, {
        props: {
          category: StatisticsCategoryId.city,
        },
      });
      cy.fixture('cityResults.json').then((response) => {
        cy.wrap(response.results).as('results');
        cy.wrap(getResultStatistics(response.results)).as('stats');
      });
    });

    commonTests();

    it('renders title', () => {
      cy.dataCy('card-stats-title').should(
        'contain',
        i18n.global.t('cardStats.labelCity'),
      );
    });
  });

  function commonTests() {
    it('renders icon', () => {
      cy.dataCy('card-stats-icon')
        .and('have.color', primary)
        .and('have.css', 'width', `${iconSizeLg}px`)
        .and('have.css', 'height', `${iconSizeLg}px`);
    });

    it('renders icon and title side-by-side', () => {
      cy.testElementsSideBySide('card-stats-icon', 'card-stats-title');
    });

    it('renders stats', () => {
      cy.get('@stats').then((stats) => {
        cy.dataCy(selectorCardStatsItem).should('have.length', stats.length);
        cy.dataCy(selectorCardStatsItem).each(($item, index) => {
          // item
          cy.wrap($item)
            .should('have.css', 'font-size', `${fontSizeSm}px`)
            .and('have.css', 'font-weight', `${fontWeightRegular}`)
            .and('have.color', grey10);
          // within item
          cy.wrap($item).within(() => {
            // icon
            cy.dataCy(selectorCardStatsItemIcon)
              .should('be.visible')
              .and('have.color', primary)
              .and('have.css', 'width', `${iconSizeSm}px`)
              .and('have.css', 'height', `${iconSizeSm}px`);
            // label
            if (stats[index].label) {
              cy.dataCy(selectorCardStatsItemLabel)
                .should('contain', stats[index].label)
                .and('have.color', grey10);
            }
            // value
            if (stats[index].value) {
              cy.dataCy(selectorCardStatsItemValue)
                .should('contain', stats[index].value)
                .and('have.color', grey10)
                .and('have.css', 'font-weight', `${fontWeightBold}`);
            }
            if (stats[index].id === StatisticsId.co2) {
              cy.dataCy(selectorCardStatsItemLabelUnit).then(($el) => {
                const content = $el.text();
                cy.stripHtmlTags(
                  i18n.global.t('global.carbonDioxideWeightUnit'),
                ).then((text) => {
                  expect(content.trim()).to.equal(text.trim());
                });
              });
            }
            if (stats[index].id === StatisticsId.distance) {
              cy.dataCy(selectorCardStatsItemLabelUnit).should(
                'contain',
                i18n.global.t('global.routeLengthUnit'),
              );
            }
            if (stats[index].id === StatisticsId.frequency) {
              cy.dataCy(selectorCardStatsItemLabelUnit).should(
                'contain',
                i18n.global.t('global.percentageUnit'),
              );
            }
          });
        });
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('card-stats').should(
          'have.css',
          'border-radius',
          borderRadiusCard,
        );
      });
    });
  }
});
