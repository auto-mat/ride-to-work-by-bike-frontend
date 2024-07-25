import { colors } from 'quasar';

import NewsletterItem from '../homepage/NewsletterItem.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

const icon = 'people';
const title = i18n.global.t('index.newsletterFeature.aboutEvents');
const url = '#';

describe('<NewsletterItem>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(NewsletterItem, {
        props: {
          item: {
            title,
            icon,
            url,
            following: true,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('has display flex column', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item')
          .should('be.visible')
          .and('have.css', 'display', 'flex')
          .and('have.css', 'flex-direction', 'row');
      });
    });

    it('aligns content to the sides', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item').should(
          'have.css',
          'justify-content',
          'space-between',
        );
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-title')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10)
          .and('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(NewsletterItem, {
        props: {
          item: {
            title,
            icon,
            url,
            following: true,
          },
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-title')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10)
          .and('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders full-width button', () => {
      cy.testElementPercentageWidth(cy.dataCy('newsletter-item-button'), 100);
    });

    it('aligns content to the right', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item').should(
          'have.css',
          'justify-content',
          'flex-end',
        );
      });
    });

    it('does not wrap icon and title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-content').should(
          'have.css',
          'flex-wrap',
          'nowrap',
        );
      });
    });
  });

  context('not following', () => {
    beforeEach(() => {
      cy.mount(NewsletterItem, {
        props: {
          item: {
            title,
            icon,
            url,
            following: false,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders bold title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-title')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders black button', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-button')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '500')
          .and('have.css', 'text-transform', 'uppercase')
          .and('have.color', white)
          .and('have.backgroundColor', grey10)
          .and('contain', i18n.global.t('index.newsletterFeature.follow'));
        cy.dataCy('newsletter-item-button')
          .find('.q-icon')
          .should('not.be.visible');
      });
    });
  });
});

function coreTests() {
  it('renders icon', () => {
    cy.window().then(() => {
      cy.dataCy('newsletter-item-icon').then((element) => {
        cy.testIcon({
          element,
          name: `${Cypress.currentTest.titlePath}-${icon}`,
          size: 32,
        });
      });
    });
  });

  it('renders button with icon', () => {
    cy.window().then(() => {
      cy.dataCy('newsletter-item-button')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.css', 'border-radius', '28px')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('index.newsletterFeature.following'));
      cy.dataCy('newsletter-item-button-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('newsletter-item-button-icon')
        .invoke('width')
        .should('be.equal', 18);
    });
  });
}
