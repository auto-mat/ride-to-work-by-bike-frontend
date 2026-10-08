import { colors } from 'quasar';
import StatsBar from '@/components/global/StatsBar.vue';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { i18n } from '../../boot/i18n';
import { StatisticsId } from '@/components/types/Statistics';

// colors
const { getPaletteColor } = colors;
const grey2 = getPaletteColor('grey-2');
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const selectorStatsBar = 'stats-bar';
const selectorStatsBarList = 'stats-bar-list';
const selectorStatsBarItem = 'stats-bar-item';
const dataSelectorStatsBarItemIcon = '[data-cy="stats-bar-item-icon"]';
const dataSelectorStatsBarItemLabelUnit =
  '[data-cy="stats-bar-item-label-unit"]';
const dataSelectorStatsBarItemValue = '[data-cy="stats-bar-item-value"]';
const dataSelectorStatsBarItemLabel = '[data-cy="stats-bar-item-label"]';

// variables
const iconSize = '18px';

describe('<StatsBar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelSaved', 'labelSustainableRoutes'],
      'statsBar',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('statsBar').then((stats) => {
        cy.mount(StatsBar, {
          props: {
            stats,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('statsBar').then((stats) => {
        cy.mount(StatsBar, {
          props: {
            stats,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('statsBar').then((stats) => {
      // component
      cy.dataCy(selectorStatsBar).should('be.visible');
      // list
      cy.dataCy(selectorStatsBarList)
        .should('be.visible')
        .and('have.backgroundColor', grey2)
        .and(
          'have.css',
          'border-radius',
          rideToWorkByBikeConfig.borderRadiusCard,
        )
        .and('have.css', 'padding', '8px');
      // items
      cy.dataCy(selectorStatsBarItem).should('have.length', stats.length);
      cy.dataCy(selectorStatsBarItem).each(($item, index) => {
        // item
        cy.wrap($item)
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10);
        // icon
        cy.wrap($item)
          .find(dataSelectorStatsBarItemIcon)
          .should('be.visible')
          .and('have.color', primary)
          .and('have.css', 'width', iconSize)
          .and('have.css', 'height', iconSize);
        // label
        if (stats[index].label) {
          cy.wrap($item)
            .find(dataSelectorStatsBarItemLabel)
            .should('contain', stats[index].label)
            .and('have.color', grey10);
        }
        // value
        if (stats[index].value) {
          cy.wrap($item)
            .find(dataSelectorStatsBarItemValue)
            .should('contain', stats[index].value)
            .and('have.color', grey10)
            .and('have.css', 'font-weight', '700');
        }
        if (stats[index].id === StatisticsId.co2) {
          cy.wrap($item)
            .find(dataSelectorStatsBarItemLabelUnit)
            .then(($el) => {
              const content = $el.text();
              cy.stripHtmlTags(
                i18n.global.t('global.carbonDioxideWeightUnit'),
              ).then((text) => {
                expect(content.trim()).to.equal(text.trim());
              });
            });
        }
        if (stats[index].id === StatisticsId.distance) {
          cy.wrap($item)
            .find(dataSelectorStatsBarItemLabelUnit)
            .should('contain', i18n.global.t('global.routeLengthUnit'));
        }
      });
    });
  });
}
