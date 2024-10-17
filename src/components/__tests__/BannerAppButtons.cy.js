import { colors } from 'quasar';
import BannerAppButtons from 'components/login/BannerAppButtons.vue';
import { i18n } from '../../boot/i18n';

import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
} from '../../../test/cypress/support/commonTests';

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const urlAppStore = rideToWorkByBikeConfig.urlAppStore;
const urlGooglePlay = rideToWorkByBikeConfig.urlGooglePlay;

const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const whiteOpacity = changeAlpha(
  white,
  rideToWorkByBikeConfig.opacityWhiteBackground,
);

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
        .and('have.backgroundColor', whiteOpacity)
        .and('have.css', 'border-radius', '8px');
    });

    it('renders title', () => {
      cy.dataCy('banner-app-buttons-title')
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', white)
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
        .and('have.color', white)
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
      cy.dataCy('banner-app-buttons-google-play')
        .should('have.attr', 'href', urlGooglePlay)
        .and('have.attr', 'target', '_blank');
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
      cy.dataCy('banner-app-buttons-app-store')
        .should('have.attr', 'href', urlAppStore)
        .and('have.attr', 'target', '_blank');
    });

    it('renders button in a flexbox with gap', () => {
      cy.dataCy('banner-app-buttons-container')
        .should('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap')
        .and('have.css', 'gap', '16px');
    });

    // Actualy disabled test because mobile apps doesn't works as expected
    it.skip('provides valid URLs for buttons - DISABLED TEST', () => {
      cy.request({
        url: urlGooglePlay,
        failOnStatusCode: failOnStatusCode,
      }).then((resp) => {
        if (resp.status === httpTooManyRequestsStatus) {
          cy.log(httpTooManyRequestsStatusMessage);
          return;
        }
        expect(resp.status).to.eq(httpSuccessfullStatus);
      });
      cy.request({ url: urlAppStore, failOnStatusCode: failOnStatusCode }).then(
        (resp) => {
          if (resp.status === httpTooManyRequestsStatus) {
            cy.log(httpTooManyRequestsStatusMessage);
            return;
          }
          expect(resp.status).to.eq(httpSuccessfullStatus);
        },
      );
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
