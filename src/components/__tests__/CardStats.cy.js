import { colors } from 'quasar';

import CardStats from '../homepage/CardStats.vue';
import { i18n } from '../../boot/i18n';
import { cardsStats } from '../../mocks/homepage';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { StatisticsId } from 'components/types/Statistics';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');
const blueGrey3 = getPaletteColor('blue-grey-3');
const primary = getPaletteColor('primary');

const { borderRadiusCard } = rideToWorkByBikeConfig;

const card = cardsStats[0];

const iconSize = '18px';

// selectors
const selectorCardStatsItem = 'card-stats-item';
const selectorCardStatsItemIcon = 'card-stats-item-icon';
const selectorCardStatsItemValue = 'card-stats-item-value';
const selectorCardStatsItemLabel = 'card-stats-item-label';
const selectorCardStatsItemLabelUnit = 'card-stats-item-label-unit';

describe('<CardStats>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('cardStats.json').then((stats) => {
        cy.mount(CardStats, {
          props: {
            card,
            stats,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-stats-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', black)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders icon', () => {
      cy.dataCy('card-stats-icon')
        .should('contain', card.icon)
        .and('have.color', blueGrey3)
        .and('have.css', 'width', '48px')
        .and('have.css', 'height', '48px');
    });

    it('renders stats', () => {
      cy.fixture('cardStats.json').then((stats) => {
        cy.dataCy(selectorCardStatsItem).should('have.length', stats.length);
        cy.dataCy(selectorCardStatsItem).each(($item, index) => {
          // item
          cy.wrap($item)
            .should('have.css', 'font-size', '14px')
            .and('have.css', 'font-weight', '400')
            .and('have.color', grey10);
          // within item
          cy.wrap($item).within(() => {
            // icon
            cy.dataCy(selectorCardStatsItemIcon)
              .should('be.visible')
              .and('have.color', primary)
              .and('have.css', 'width', iconSize)
              .and('have.css', 'height', iconSize);
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
                .and('have.css', 'font-weight', '700');
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
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CardStats, {
        props: {
          card,
        },
      });
      cy.viewport('iphone-6');
    });
  });
});
