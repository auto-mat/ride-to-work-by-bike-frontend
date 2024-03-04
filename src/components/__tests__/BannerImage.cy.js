import { colors } from 'quasar';
import BannerImage from '../homepage/BannerImage.vue';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { bannerImage } from '../../mocks/homepage';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const grey8 = getPaletteColor('grey-8');
const grey5 = getPaletteColor('grey-5');

const { borderRadiusCard, colorGrayLight, maxWidthBanner } =
  rideToWorkByBikeConfig;

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
          .and('have.css', 'flex-wrap', 'wrap')
          .and('have.css', 'border', `1px solid ${grey5}`)
          .and('have.backgroundColor', white)
          .and('have.css', 'max-width', maxWidthBanner);
        cy.dataCy('banner-half').should('have.length', 2).and('be.visible');
        cy.testElementPercentageWidth(cy.dataCy('banner-half'), 50);
      });
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('banner-title')
          .should('be.visible')
          .and('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
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
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey8)
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
        cy.dataCy('banner').should('have.backgroundColor', colorGrayLight);
      });

      it('has rounded corners', () => {
        cy.window().then(() => {
          cy.dataCy('banner')
            .should('be.visible')
            .and('have.css', 'border-radius', borderRadiusCard)
            .and('have.css', 'overflow', 'hidden');
          cy.dataCy('banner-half')
            .first()
            .should('have.css', 'border-top-left-radius', borderRadiusCard)
            .and('have.css', 'border-bottom-left-radius', borderRadiusCard);
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
        cy.dataCy('banner').should('have.backgroundColor', colorGrayLight);
      });
    });

    it('has rounded corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner')
          .should('be.visible')
          .and('have.css', 'border-radius', borderRadiusCard)
          .and('have.css', 'overflow', 'hidden');
      });
    });
  });
});
