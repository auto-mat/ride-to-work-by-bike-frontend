import BannerImage from 'components/BannerImage.vue';
import { bannerImage } from 'src/mocks/homepage';

const config = JSON.parse(process.env.RIDE_TO_WORK_BY_BIKE_CONFIG);

describe('<BannerImage>', () => {

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BannerImage, {
        props: {
          banner: bannerImage,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders two columns', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap');

        cy.dataCy('banner-half').should('have.length', 2).should('be.visible');

        cy.testElementPercentageWidth(cy.dataCy('banner-half'), 50);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain.text', bannerImage.title)
          .then(($title) => {
            expect($title.text()).to.equal(bannerImage.title);
          });
      });
    });

    it('renders perex', () => {
      cy.window().then(() => {
        cy.dataCy('banner-perex')
          .should('be.visible')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should('contain.text', bannerImage.perex)
          .then(($perex) => {
            expect($perex.text()).to.equal(bannerImage.perex);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(bannerImage.image.src);
          });

        cy.dataCy('banner').find('img').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('has correct background color', () => {
      cy.window().then(() => {
        cy.dataCy('banner').should(
          'have.backgroundColor',
          config.colorGrayLight
        );
      });

      it('has rounded corners', () => {
        cy.window().then(() => {
          cy.dataCy('banner')
            .should('be.visible')
            .should('have.css', 'border-radius', config.borderRadiusCard)
            .should('have.css', 'overflow', 'hidden');

          cy.dataCy('banner-half')
            .first()
            .should('have.css', 'border-top-left-radius', config.borderRadiusCard)
            .should('have.css', 'border-bottom-left-radius', config.borderRadiusCard);
        });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerImage, {
        props: {
          banner: bannerImage,
        },
      });

      cy.viewport('iphone-6');
    });

    it('renders single column', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap');

        cy.dataCy('banner-half').should('have.length', 2).should('be.visible');

        cy.testElementPercentageWidth(cy.dataCy('banner-half'), 100);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain.text', bannerImage.title)
          .then(($title) => {
            expect($title.text()).to.equal(bannerImage.title);
          });
      });
    });

    it('renders perex', () => {
      cy.window().then(() => {
        cy.dataCy('banner-perex')
          .should('be.visible')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should('contain.text', bannerImage.perex)
          .then(($perex) => {
            expect($perex.text()).to.equal(bannerImage.perex);
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(bannerImage.image.src);
          });

        cy.dataCy('banner').find('img').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('has correct background color', () => {
      cy.window().then(() => {
        cy.dataCy('banner').should(
          'have.backgroundColor',
          config.colorGrayLight
        );
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .should('have.css', 'border-radius', config.borderRadiusCard)
          .should('have.css', 'overflow', 'hidden');
      });
    });
  });
});
