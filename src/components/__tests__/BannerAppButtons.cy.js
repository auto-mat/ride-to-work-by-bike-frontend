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
      cy.dataCy('banner-app-buttons')
        .should('have.css', 'padding', '16px')
        .and('have.backgroundColor', 'rgba(255, 255, 255, 0.5)')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders title', () => {
      cy.dataCy('banner-app-buttons-title')
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('login.bannerAppButtons.title'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('login.bannerAppButtons.title'),
          );
        });
    });

    it('renders description', () => {
      cy.dataCy('banner-app-buttons-description')
        .should('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('login.bannerAppButtons.description'))
        .then(($description) => {
          expect($description.text()).to.equal(
            i18n.global.t('login.bannerAppButtons.description'),
          );
        });
    });

    it('uses correct spacing', () => {
      cy.dataCy('banner-app-buttons-title')
        .should('have.css', 'margin-top', '0px')
        .and('have.css', 'margin-bottom', '0px');

      cy.dataCy('banner-app-buttons-description')
        .should('have.css', 'margin-top', '4px')
        .and('have.css', 'margin-bottom', '16px');
    });

    it('renders google play button', () => {
      cy.dataCy('banner-app-buttons-google-play')
        .should('be.visible')
        .invoke('height')
        .should('be.equal', 40);
      cy.dataCy('banner-app-buttons-google-play')
        .find('img')
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
        .find('img')
        .should('be.visible')
        .then(($img) => {
          cy.testImageHeight($img);
        });
    });

    it('renders button in a flexbox with gap', () => {
      cy.dataCy('banner-app-buttons-container')
        .should('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap')
        .and('have.css', 'gap', '16px');
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
