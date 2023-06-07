import VueCardChallenge from 'components/VueCardChallenge.vue';
import { hexToRgb } from '../../../test/cypress/utils/';

describe('<VueCardChallenge>', () => {
  const title = 'Challenge 1';
  const url = '#';
  const dates = '1. říj.–31. říj. 2022';
  const image = 'https://picsum.photos/500/550';
  const company = true;

  beforeEach(() => {
    cy.mount(VueCardChallenge, {
      props: {
        card: {
          title,
          url,
          dates,
          image,
          company,
        },
      },
    });
  });

  it('renders title with icon on gray background', () => {
    cy.window().then(() => {
      cy.dataCy('card-title')
        .should('be.visible')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0.47)')
        .should('contain', title);

      cy.dataCy('card-title')
        .find('i')
        .should('be.visible')
        .should('contain', 'person');

      cy.dataCy('card-title')
        .find('a')
        .should('have.css', 'font-size', '16px')
        .should('have.css', 'font-weight', '700')
        .then((titleNode) => {
          expect(titleNode.text()).to.equal(title);
        });
    });
  });

  it('renders title link', () => {
    cy.window().then(() => {
      cy.dataCy('card-link')
        .should('be.visible')
        .should('have.attr', 'href', url);
    });
  });

  it('renders image', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .find('img')
        .then(($img) => {
          const naturalHeight = $img[0].naturalHeight;
          expect(naturalHeight).to.be.greaterThan(0);
          expect($img.attr('src')).to.equal(image);
        });
    });
  });

  it('renders dates', () => {
    cy.window().then(() => {
      cy.dataCy('card-dates')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#ffffff'))
        .should('have.css', 'font-size', '14px')
        .should('contain', dates);
    });
  });

  it('renders company badge', () => {
    cy.window().then(() => {
      cy.dataCy('card-company-wrapper')
        .should('be.visible')
        .should('have.css', 'position', 'absolute')
        .should('have.css', 'top', '-12px');

      cy.dataCy('card-company')
        .should('be.visible')
        .should('have.css', 'border-radius', '12px')
        .should('have.css', 'font-size', '12px')
        .should('have.css', 'font-weight', '400')
        .should('have.css', 'color', hexToRgb('#ffffff'))
        .should('have.css', 'height', '24px')
        .should('contain.text', 'Company challenge');
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });
});
