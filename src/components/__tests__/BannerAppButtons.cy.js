import { colors } from 'quasar';
import BannerAppButtons from 'components/BannerAppButtons.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<BannerAppButtons>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'description'],
      'login.bannerAppButtons',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BannerAppButtons, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders container with semi-transparent white background and rounded corners', () => {
      cy.dataCy('banner-app-buttons-container')
        .should('have.css', 'padding', '16px')
        .should('have.backgroundColor', 'rgba(255, 255, 255, 0.5)')
        .should('have.css', 'border-radius', '8px');
    });

    it('renders title', () => {
      cy.dataCy('banner-app-buttons-title')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '700')
        .should('have.color', grey10)
        .should('contain', i18n.global.t('login.bannerAppButtons.title'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('login.bannerAppButtons.title'),
          );
        });
    });

    it('renders description', () => {
      cy.dataCy('banner-app-buttons-description')
        .should('have.css', 'font-size', '12px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', grey10)
        .should('contain', i18n.global.t('login.bannerAppButtons.description'))
        .then(($description) => {
          expect($description.text()).to.equal(
            i18n.global.t('login.bannerAppButtons.description'),
          );
        });
    });

    it('renders google play button', () => {
      cy.dataCy('banner-app-buttons-google-play')
        .should('be.visible')
        .invoke('height')
        .should('be.equal', 40);
      cy.dataCy('banner-app-buttons-google-play')
        .find('.q-img')
        .should('be.visible')
        .then(($img) => {
          cy.testImageHeight($img);
        });
    });

    it('renders app store button', () => {
      cy.dataCy('banner-app-buttons-app-store')
        .should('be.visible')
        .invoke('height')
        .should('be.equal', 40);
      cy.dataCy('banner-app-buttons-app-store')
        .find('.q-img')
        .should('be.visible')
        .then(($img) => {
          cy.testImageHeight($img);
        });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerAppButtons, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
