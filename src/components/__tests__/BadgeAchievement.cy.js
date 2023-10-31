import { colors } from 'quasar';

import BadgeAchievement from '../BadgeAchievement.vue';
import { i18n } from '../../boot/i18n';
import { badgeList } from '../../mocks/homepage';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey9 = getPaletteColor('grey-9');
const blueGrey7 = getPaletteColor('blue-grey-7');

const badge = badgeList[0];
const badgeDark = badgeList[1];

describe('<BadgeAchievement>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BadgeAchievement, {
        props: {
          badge,
        },
      });
      cy.viewport('macbook-16', { deviceScaleFactor: 1 });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('badge-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.css', 'text-align', 'center')
          .should('have.color', grey9)
          .should('contain', badge.title)
          .then(($title) => {
            expect($title.text()).to.equal(badge.title);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('badge-image')
          .should('be.visible')
          .find('img')
          .should(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          })
          .invoke('attr', 'src')
          .should('contains', badge.image);

        cy.dataCy('badge-image').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('badge-description')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '400')
          .should('have.css', 'text-align', 'center')
          .should('have.color', grey9)
          .should('contain', badge.description)
          .then(($description) => {
            expect($description.text()).to.equal(badge.description);
          });
      });
    });
  });

  context('variant dark', () => {
    beforeEach(() => {
      cy.mount(BadgeAchievement, {
        props: {
          badge: badgeDark,
        },
      });
      cy.viewport('iphone-6', { deviceScaleFactor: 1 });
    });

    it('has dark background', () => {
      cy.dataCy('badge-card').should('have.backgroundColor', blueGrey7);
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('badge-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.css', 'text-align', 'center')
          .should('have.color', white)
          .should('contain', badgeDark.title)
          .then(($title) => {
            expect($title.text()).to.equal(badgeDark.title);
          });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('badge-description')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '400')
          .should('have.css', 'text-align', 'center')
          .should('have.color', white)
          .should('contain', badgeDark.description)
          .then(($description) => {
            expect($description.text()).to.equal(badgeDark.description);
          });
      });
    });
  });
});
