import { colors } from 'quasar';

import BannerRoutes from '../homepage/BannerRoutes.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const white = getPaletteColor('white');
const grey1 = getPaletteColor('grey-1');

const routesCount = 3;

describe('<BannerRoutes>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'titleStart', 'addRoutes', 'addFirstRoutes'],
      'index.bannerRoutes',
      i18n,
    );
  });

  context('desktop default variant', () => {
    beforeEach(() => {
      cy.mount(BannerRoutes, {
        props: {
          routesCount,
          variant: 'default',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders button icon with correct spacing', () => {
      // icon additional tests
      cy.dataCy('banner-routes-button-icon')
        .should('be.visible')
        .and('have.color', white)
        .and('have.css', 'margin-right', '8px');
    });

    it('renders title with the number of missing routes', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title').should('contain', routesCount);
      });
    });

    it('renders title with correct styling', () => {
      cy.dataCy('banner-routes-title')
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', black);
    });

    it('renders button', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.color', white)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'padding-top', '16px')
        .and('have.css', 'padding-left', '16px')
        .and('have.css', 'padding-bottom', '16px')
        .and('have.css', 'padding-right', '24px')
        .and('contain', i18n.global.t('index.bannerRoutes.addRoutes'));
    });

    it('has gray background', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .and('have.backgroundColor', grey1);
      });
    });

    it('has sharp corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .and('have.css', 'border-radius', '0px');
      });
    });

    it('renders title section and button section side to side', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-title'),
        67,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-button'),
        33,
      );
    });
  });

  context('desktop start variant', () => {
    beforeEach(() => {
      cy.mount(BannerRoutes, {
        props: {
          routesCount,
          variant: 'start',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders title width the "start" message', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title').should(
          'contain',
          i18n.global.t('index.bannerRoutes.titleStart'),
        );
      });
    });

    it('renders title with correct styling', () => {
      cy.dataCy('banner-routes-title')
        .should('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', black);
    });

    it('renders button', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.color', white)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'padding-top', '16px')
        .and('have.css', 'padding-left', '16px')
        .and('have.css', 'padding-bottom', '16px')
        .and('have.css', 'padding-right', '24px')
        .and('contain', i18n.global.t('index.bannerRoutes.addFirstRoutes'));
    });

    it('has gray background', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .and('have.backgroundColor', grey1);
      });
    });

    it('has sharp corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .and('have.css', 'border-radius', '0px');
      });
    });

    it('renders title section and button section stacked', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-title'),
        100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-button'),
        100,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerRoutes, {
        props: {
          routesCount,
          variant: 'default',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders title with the number of missing routes', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', black)
          .and('contain', routesCount);
      });
    });

    it('renders button', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.color', white)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'padding-top', '16px')
        .and('have.css', 'padding-left', '16px')
        .and('have.css', 'padding-bottom', '16px')
        .and('have.css', 'padding-right', '24px')
        .and('contain', i18n.global.t('index.bannerRoutes.addRoutes'));
    });

    it('has gray background', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .and('have.backgroundColor', grey1);
      });
    });

    it('has sharp corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .and('have.css', 'border-radius', '0px');
      });
    });

    it('renders title section and button section stacked', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-title'),
        100,
      );
      cy.testElementPercentageWidth(
        cy.dataCy('banner-routes-section-button'),
        100,
      );
    });
  });
});

function coreTests() {
  it('renders button icon with correct spacing', () => {
    cy.viewport(1280, 800).then(() => {
      cy.window().then(() => {
        // icon core test
        cy.dataCy('banner-routes-button-icon').then((element) => {
          cy.testIcon({
            element,
            name: `${Cypress.currentTest.titlePath}-add`,
            size: 24,
          });
        });
      });
    });
    // icon additional tests
    cy.dataCy('banner-routes-button-icon')
      .should('be.visible')
      .and('have.color', white)
      .and('have.css', 'margin-right', '8px');
  });
}
