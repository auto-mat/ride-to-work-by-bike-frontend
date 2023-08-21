import VueBannerApp from 'components/VueBannerApp.vue';
import { bannerApp } from 'src/mocks/homepage';

describe('<VueBannerApp>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueBannerApp, {
        props: {
          banner: bannerApp,
        },
      });

      cy.viewport('macbook-16');
    });

    it('renders two columns', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap');

        cy.dataCy('banner-app-half')
          .should('have.length', 2)
          .should('be.visible');

        cy.testElementPercentageWidth(cy.dataCy('banner-app-half'), 50);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app-title')
          .should('be.visible')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#fff')
          .should('contain.text', bannerApp.title)
          .then(($title) => {
            expect($title.text()).to.equal(bannerApp.title);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            const naturalHeight = $img[0].naturalHeight;
            expect(naturalHeight).to.be.greaterThan(0);
            expect($img.attr('src')).to.equal(bannerApp.image);
          });

        cy.dataCy('banner-app').find('img').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('renders button', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app-button')
          .should('be.visible')
          .should('contain.text', bannerApp.button.title)
          .then(($button) => {
            expect($button.text()).to.equal(bannerApp.button.title);
          });
      });
    });

    it('has correct background', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .should('be.visible')
          .should('have.backgroundColor', '#455a64'); // blue-grey-8
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .should('be.visible')
          .should('have.css', 'border-radius', '20px');

        cy.dataCy('banner-app-half')
          .first()
          .should('have.css', 'border-top-left-radius', '20px')
          .should('have.css', 'border-bottom-left-radius', '20px');
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueBannerApp, {
        props: {
          banner: bannerApp,
        },
      });

      cy.viewport('iphone-6');
    });

    it('renders single column', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap');

        cy.dataCy('banner-app-half')
          .should('have.length', 2)
          .should('be.visible');

        cy.testElementPercentageWidth(cy.dataCy('banner-app-half'), 100);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app-title')
          .should('be.visible')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#fff')
          .should('contain.text', bannerApp.title)
          .then(($title) => {
            expect($title.text()).to.equal(bannerApp.title);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            const naturalHeight = $img[0].naturalHeight;
            expect(naturalHeight).to.be.greaterThan(0);
            expect($img.attr('src')).to.equal(bannerApp.image);
          });

        cy.dataCy('banner-app').find('img').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('renders button', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app-button')
          .should('be.visible')
          .should('contain.text', bannerApp.button.title)
          .then(($button) => {
            expect($button.text()).to.equal(bannerApp.button.title);
          });
      });
    });

    it('has correct background', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .should('be.visible')
          .should('have.backgroundColor', '#455a64'); // blue-grey-8
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner-app')
          .should('be.visible')
          .should('have.css', 'border-radius', '20px');

        cy.dataCy('banner-app-half')
          .first()
          .should('have.css', 'border-top-left-radius', '20px')
          .should('have.css', 'border-top-right-radius', '20px');
      });
    });
  });
});
