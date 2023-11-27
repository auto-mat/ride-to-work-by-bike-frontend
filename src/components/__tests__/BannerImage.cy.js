import { colors } from 'quasar';
import BannerImage from '../homepage/BannerImage.vue';
import { bannerImage } from '../../mocks/homepage';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

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
          .and('have.css', 'display', 'flex')
          .and('have.css', 'flex-wrap', 'wrap');
        cy.dataCy('banner-half').should('have.length', 2).and('be.visible');
        cy.testElementPercentageWidth(cy.dataCy('banner-half'), 50);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
          .and('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '500')
          .and('have.color', black)
          .and('contain.text', bannerImage.title)
          .then(($title) => {
            expect($title.text()).to.equal(bannerImage.title);
          });
      });
    });

    it('renders perex', () => {
      cy.window().then(() => {
        cy.dataCy('banner-perex')
          .should('be.visible')
          .and('have.css', 'font-size', '12px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black)
          .and('contain.text', bannerImage.perex)
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
          config.colorGrayLight,
        );
      });

      it('has rounded corners', () => {
        cy.window().then(() => {
          cy.dataCy('banner')
            .should('be.visible')
            .and('have.css', 'border-radius', config.borderRadiusCard)
            .and('have.css', 'overflow', 'hidden');
          cy.dataCy('banner-half')
            .first()
            .should(
              'have.css',
              'border-top-left-radius',
              config.borderRadiusCard,
            )
            .and(
              'have.css',
              'border-bottom-left-radius',
              config.borderRadiusCard,
            );
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
          .and('have.css', 'display', 'flex')
          .and('have.css', 'flex-wrap', 'wrap');
        cy.dataCy('banner-half').should('have.length', 2).and('be.visible');
        cy.testElementPercentageWidth(cy.dataCy('banner-half'), 100);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
          .and('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '500')
          .and('have.color', black)
          .and('contain.text', bannerImage.title)
          .then(($title) => {
            expect($title.text()).to.equal(bannerImage.title);
          });
      });
    });

    it('renders perex', () => {
      cy.window().then(() => {
        cy.dataCy('banner-perex')
          .should('be.visible')
          .and('have.css', 'font-size', '12px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black)
          .and('contain.text', bannerImage.perex)
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
          config.colorGrayLight,
        );
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .and('have.css', 'border-radius', config.borderRadiusCard)
          .and('have.css', 'overflow', 'hidden');
      });
    });
  });
});
