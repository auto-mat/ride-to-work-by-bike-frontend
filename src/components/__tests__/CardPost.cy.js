import { colors, date } from 'quasar';

import CardPost from '../homepage/CardPost.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const blueGrey5 = getPaletteColor('blue-grey-5');

const { borderRadiusCard } = rideToWorkByBikeConfig;
const { formatDate } = date;

describe('<CardPost>', () => {
  beforeEach(() => {
    cy.fixture('listCardsPost').then((listCardsPost) => {
      cy.wrap(listCardsPost[0]).as('card');
      cy.mount(CardPost, {
        props: {
          card: listCardsPost[0],
        },
      });
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.cardPost', i18n);
  });

  it('has correct background color', () => {
    cy.window().then(() => {
      cy.dataCy('card-post')
        .should('be.visible')
        .and('have.backgroundColor', white);
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card-post')
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadiusCard);
    });
  });

  it('has border', () => {
    cy.window().then(() => {
      cy.dataCy('card-post').should(
        'have.css',
        'border',
        '1px solid rgba(0, 0, 0, 0.12)',
      );
    });
  });

  it('has no shadow', () => {
    cy.window().then(() => {
      cy.dataCy('card-post').should('have.css', 'box-shadow', 'none');
    });
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-post-title')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });
  });

  it('renders date', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-post-date')
          .should('have.css', 'font-size', '12px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', blueGrey5)
          .then(($date) => {
            // manual workaround to avoid having to calculate dynamic date
            expect($date.text()).to.equal(
              formatDate(card.date, 'D. MMM. YYYY'),
            );
          });
      });
    });
  });

  it('renders image', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-post-image')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(card.image);
          });
        cy.dataCy('card-post-image').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });
  });
});
