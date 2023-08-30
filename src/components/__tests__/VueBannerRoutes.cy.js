import VueBannerRoutes from 'components/VueBannerRoutes.vue';
import { i18n } from '../../boot/i18n';

const routesCount = 3;

describe('<VueBannerRoutes>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.bannerRoutes', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueBannerRoutes, {
        props: {
          routesCount
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title with the number of missing routes', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#000000')
          .should('contain', routesCount)
      });
    })

    it('renders button', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '500')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.color', '#212121')
        .should('have.css', 'border-radius', '28px')
        .should('contain', i18n.global.t('index.bannerRoutes.addRoutes'))
        .then(($title) => {
          expect($title.text()).to.equal(i18n.global.t('index.bannerRoutes.addRoutes'));
        });
    })

    it('renders title icon', () => {
      cy.dataCy('banner-routes-button-add-routes')
        .find('.q-icon')
        .should('contain', 'add')
        .should('have.color', '#fff')
        .should('have.css', 'width', '24px')
        .should('have.css', 'height', '24px');
    })

    it('has gray background', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .should('have.backgroundColor', '#f5f5f5'); // grey-1
      });
    })

    it('has sharp corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .should('have.css', 'border-radius', '0');
      });
    })
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueBannerRoutes, {
        props: {
          routesCount
        },
      });
      cy.viewport('iphone-6');
    });


    it('renders title with the number of missing routes', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#000000')
          .should('contain', routesCount)
      });
    })

    it('renders button', () => {
      cy.dataCy('banner-routes-button')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '500')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.color', '#212121')
        .should('have.css', 'border-radius', '28px')
        .should('contain', i18n.global.t('index.bannerRoutes.button'))
        .then(($title) => {
          expect($title.text()).to.equal(i18n.global.t('index.bannerRoutes.button'));
        });
    })



    it('has gray background', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .should('have.backgroundColor', '#f5f5f5'); // grey-1
      });
    })

    it('has sharp corners', () => {
      cy.window().then(() => {
        cy.dataCy('banner-routes-card')
          .should('be.visible')
          .should('have.css', 'border-radius', '0');
      });
    })
  });
});
