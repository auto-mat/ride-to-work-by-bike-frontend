import VueCardFollow from 'components/VueCardFollow.vue';
import { i18n } from '../../boot/i18n';

const title = 'Do práce na kole – Brno';
const handle = '@DPNKBrno';
const image = 'https://picsum.photos/id/76/300/300';
const url = '#';

describe('<VueCardFollow>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.cardFollow', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardFollow, {
        props: {
          card: {
            title,
            handle,
            image,
            url,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('has white background', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow').should('have.backgroundColor', '#ffffff'); // blue-grey-2
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow').should('have.css', 'border-radius', '20px');
      });
    });

    it('has border', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow').should(
          'have.css',
          'border',
          '1px solid rgb(220, 225, 237)' // config colorGrayMiddle
        );
      });
    });

    it('has no shadow', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow').should('have.css', 'box-shadow', 'none');
      });
    });

    it('has padding 16px', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow').should('have.css', 'padding', '16px');
      });
    });

    it('has wrapper with top padding', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow-wrapper').should(
          'have.css',
          'padding-top',
          '48px'
        );
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#212121')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders handle', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow-handle')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#546e7a') // blue-grey-7
          .should('contain', handle)
          .then(($title) => {
            expect($title.text()).to.equal(handle);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('card-follow-avatar')
          .should('be.visible')
          .find('.q-avatar')
          .should('have.css', 'border-radius', '50%')
          .should('have.css', 'width', '96px')
          .should('have.css', 'height', '96px')
          .should('have.css', 'margin-top', '-64px');

        cy.dataCy('card-follow-image')
          .should('be.visible')
          .should(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          })
          .invoke('attr', 'src')
          .should('contains', image);

        cy.dataCy('card-follow-image').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardFollow, {
        props: {
          title,
          handle,
          image,
          url,
        },
      });
      cy.viewport('iphone-6');
    });
  });
});
