import { colors } from 'quasar';
import BannerRoutesApp from 'components/routes/BannerRoutesApp.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

describe('<BannerRoutesApp>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonLinkNewDevice', 'buttonLinkToApp', 'statusLinked'],
      'routes',
      i18n,
    );
  });

  context('desktop not linked', () => {
    beforeEach(() => {
      cy.fixture('bannerRoutesAppList').then((bannerRoutesAppList) => {
        const app = bannerRoutesAppList[0];
        cy.mount(BannerRoutesApp, {
          props: {
            app,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders component', () => {
      cy.fixture('bannerRoutesAppList').then((bannerRoutesAppList) => {
        const app = bannerRoutesAppList[0];
        // Component
        cy.dataCy('banner-routes-app').should('be.visible');
        // Image
        cy.dataCy('banner-routes-app-image').should('be.visible');
        cy.dataCy('banner-routes-app-image')
          .should('be.visible')
          .find('img')
          .should(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          })
          .invoke('attr', 'src')
          .should('contains', app.image.src);
        // Title
        cy.dataCy('banner-routes-app-title')
          .should('be.visible')
          .and('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black);
        // Icon (should be visible when app is linked)
        cy.dataCy('banner-routes-app-icon').should('not.exist');
        cy.dataCy('banner-routes-app-status').should('not.exist');
        // Button (not linked)
        cy.dataCy('banner-routes-app-button')
          .should('be.visible')
          .and('contain', i18n.global.t('routes.buttonLinkToApp'));
      });
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('bannerRoutesAppList').then((bannerRoutesAppList) => {
        const app = bannerRoutesAppList[1];
        cy.mount(BannerRoutesApp, {
          props: {
            app,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('bannerRoutesAppList').then((bannerRoutesAppList) => {
        const app = bannerRoutesAppList[1];
        cy.mount(BannerRoutesApp, {
          props: {
            app,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('bannerRoutesAppList').then((bannerRoutesAppList) => {
      const app = bannerRoutesAppList[1];
      // Component
      cy.dataCy('banner-routes-app').should('be.visible');
      // Image
      cy.dataCy('banner-routes-app-image').should('be.visible');
      cy.dataCy('banner-routes-app-image')
        .should('be.visible')
        .find('img')
        .should(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        })
        .invoke('attr', 'src')
        .should('contains', app.image.src);
      // Title
      cy.dataCy('banner-routes-app-title')
        .should('be.visible')
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', black);
      // Icon (should be visible when app is linked)
      cy.dataCy('banner-routes-app-icon')
        .should('be.visible')
        .and('have.css', 'font-size', '18px');
      // Status (linked)
      cy.dataCy('banner-routes-app-status')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', black);
      // Button (linked and linkable)
      cy.dataCy('banner-routes-app-button')
        .should('be.visible')
        .and('contain', i18n.global.t('routes.buttonLinkNewDevice'));
    });
  });
}
