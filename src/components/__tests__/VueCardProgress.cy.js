import VueCardProgress from 'components/VueCardProgress.vue';
import { i18n } from '../../boot/i18n';
import { cardsProgress } from '../../mocks/homepage';

const card = cardsProgress[0]

describe('<VueCardProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [],
      'index.cardProgress',
      i18n
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-header')
        .find('.q-icon')
        .should('contain', card.icon)
        .should('have.color', '#eceff1') // blue-grey-1
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.progress)
        .should('contain', i18n.global.t('index.cardProgress.toDate'));

      cy.dataCy('card-progress-circular').should('be.visible')
        .should('have.css', 'width', '220px')
        .should('have.css', 'height', '220px');

      cy.dataCy('card-progress-percentage')
        .find('.text-circular-progress')
        .should('be.visible')
        .should('have.css', 'font-size', '48px');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-header')
        .find('.q-icon')
        .should('contain', card.icon)
        .should('have.color', '#eceff1') // blue-grey-1
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.progress)
        .should('contain', i18n.global.t('index.cardProgress.toDate'));

      cy.dataCy('card-progress-circular').should('be.visible')
        .should('have.css', 'width', '128px')
        .should('have.css', 'height', '128px');

      cy.dataCy('card-progress-percentage')
        .find('.text-circular-progress')
        .should('be.visible')
        .should('have.css', 'font-size', '40px');
    });
  });
});
