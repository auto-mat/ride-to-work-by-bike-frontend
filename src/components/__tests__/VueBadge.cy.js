import VueBadge from 'components/VueBadge.vue';
import { i18n } from '../../boot/i18n';
import { badgeList } from 'src/mocks/homepage';

const badge = badgeList[0];
const badgeDark = badgeList[1];

describe('<VueBadge>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueBadge, {
        props: {
          badge,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('badge-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.css', 'text-align', 'center')
          .should('have.color', '#424242') // bg-grey-9
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
          .should('have.color', '#424242') // bg-grey-9
          .should('contain', badge.description)
          .then(($description) => {
            expect($description.text()).to.equal(badge.description);
          });
      });
    });
  });

  context('variant dark', () => {
    beforeEach(() => {
      cy.mount(VueBadge, {
        props: {
          badge: badgeDark,
        },
      });
      cy.viewport('iphone-6');
    });

    it('has dark background', () => {
      cy.dataCy('badge-card').should('have.backgroundColor', '#546e7a'); // bg-blue-grey-7
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('badge-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.css', 'text-align', 'center')
          .should('have.color', '#fff') // bg-grey-9
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
          .should('have.color', '#fff') // bg-grey-9
          .should('contain', badgeDark.description)
          .then(($description) => {
            expect($description.text()).to.equal(badgeDark.description);
          });
      });
    });
  });
});
