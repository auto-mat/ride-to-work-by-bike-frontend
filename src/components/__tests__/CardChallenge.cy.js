import { colors } from 'quasar';
import CardChallenge from '../homepage/CardChallenge.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');

describe('<CardChallenge>', () => {
  const title = 'Challenge 1';
  const url = '#';
  const dates = '1. říj.–31. říj. 2022';
  const image = {
    src: 'https://picsum.photos/id/70/500/550',
    alt: 'road lined with trees',
  };
  const company = true;

  beforeEach(() => {
    cy.mount(CardChallenge, {
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

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['dates', 'company'],
      'index.cardChallenge',
      i18n,
    );
  });

  it('renders title with icon on gray background', () => {
    cy.window().then(() => {
      cy.dataCy('card-title')
        .should('be.visible')
        .and('have.backgroundColor', 'rgba(0, 0, 0, 0.47)')
        .and('contain', title);
      cy.dataCy('card-title')
        .find('i')
        .should('be.visible')
        .and('contain', 'person');
      cy.dataCy('card-title')
        .find('a')
        .should('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '700')
        .then(($title) => {
          expect($title.text()).to.equal(title);
        });
    });
  });

  it('renders title link', () => {
    cy.window().then(() => {
      cy.dataCy('card-link').should('be.visible').and('have.attr', 'href', url);
    });
  });

  it('renders image', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .find('img')
        .should('be.visible')
        .then(($img) => {
          const naturalHeight = $img[0].naturalHeight;
          expect(naturalHeight).to.be.greaterThan(0);
          expect($img.attr('src')).to.equal(image.src);
        });
    });
  });

  it('renders dates', () => {
    cy.window().then(() => {
      cy.dataCy('card-dates')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'font-size', '14px')
        .and('contain', dates);
    });
  });

  it('renders company badge', () => {
    cy.window().then(() => {
      cy.dataCy('card-company-wrapper')
        .should('be.visible')
        .and('have.css', 'position', 'absolute')
        .and('have.css', 'top', '-12px');
      cy.dataCy('card-company')
        .should('be.visible')
        .and('have.css', 'border-radius', '12px')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', white)
        .and('have.css', 'height', '24px')
        .and('contain.text', i18n.global.t('index.cardChallenge.company'));
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .should('be.visible')
        .and('have.css', 'border-radius', '20px');
    });
  });
});
