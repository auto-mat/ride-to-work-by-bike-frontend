import { colors } from 'quasar';

import CardStats from '../homepage/CardStats.vue';
import { i18n } from '../../boot/i18n';
import { cardsStats } from '../../mocks/homepage';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

const { borderRadiusCard } = rideToWorkByBikeConfig;

const card = cardsStats[0];

describe('<CardStats>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardStats, {
        props: {
          card,
        },
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
      cy.dataCy('card-stats-icon').then((element) => {
        cy.testIcon({
          element,
          name: `card-stats-${card.icon}`,
          size: 48,
        });
      });
    });

    it('renders stats', () => {
      // count
      cy.dataCy('card-stats-item').should('have.length', card.stats.length);
      // items
      cy.dataCy('card-stats-item').each(($item, index) => {
        cy.wrap($item)
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black)
          .and('contain', card.stats[index].text);
      });
      // icons
      cy.dataCy('card-stats-item-icon').each((element, index) => {
        cy.testIcon({
          element,
          name: `card-stats-item-${card.stats[index].icon}`,
          size: 14,
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
