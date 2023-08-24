import VueNewsletterSwitch from 'components/VueNewsletterSwitch.vue';
import { i18n } from '../../boot/i18n';

import { newsletterOptions } from 'src/mocks/homepage';

describe('<VueNewsletterSwitch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'description', 'groupTitle', 'message'],
      'index.newsletterSwitch',
      i18n
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterSwitch, {
        props: {
          options: newsletterOptions,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', i18n.global.t('index.newsletterSwitch.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.newsletterSwitch.title')
            );
          });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-description')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should(
            'contain',
            i18n.global.t('index.newsletterSwitch.description')
          );
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-image')
          .should('be.visible')
          .find('img')
          .should(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });

        cy.dataCy('newsletter-switch-image').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('renders toggle groups with title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-group-title')
          .should('be.visible')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#000000')
          .should(
            'contain',
            i18n.global.t('index.newsletterSwitch.groupTitle')
          );

        cy.dataCy('newsletter-switch-group')
          .first()
          .find('.q-toggle__track')
          .should('be.visible');

        cy.dataCy('newsletter-switch-group')
          .first()
          .find('.q-toggle__label')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#212121')
          .should('contain', newsletterOptions[0].label);
      });
    });

    it('renders switch message', () => {
      cy.dataCy('newsletter-switch-group-message')
        .should('have.css', 'font-size', '12px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#546e7a') // blue-grey-7
        .should('contain', i18n.global.t('index.newsletterSwitch.message'));
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('newsletter-col-image'), 25);

        cy.testElementPercentageWidth(cy.dataCy('newsletter-col-content'), 75);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterSwitch, {
        props: {
          options: newsletterOptions,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', i18n.global.t('index.newsletterSwitch.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.newsletterSwitch.title')
            );
          });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-description')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should(
            'contain',
            i18n.global.t('index.newsletterSwitch.description')
          );
      });
    });

    it('renders toggle groups with title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-group-title')
          .should('be.visible')
          .should('have.css', 'font-size', '12px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#000000')
          .should(
            'contain',
            i18n.global.t('index.newsletterSwitch.groupTitle')
          );

        cy.dataCy('newsletter-switch-group')
          .first()
          .find('.q-toggle__track')
          .should('be.visible');

        cy.dataCy('newsletter-switch-group')
          .first()
          .find('.q-toggle__label')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#212121')
          .should('contain', newsletterOptions[0].label);
      });
    });

    it('renders switch message', () => {
      cy.dataCy('newsletter-switch-group-message')
        .should('have.css', 'font-size', '12px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#546e7a') // blue-grey-7
        .should('contain', i18n.global.t('index.newsletterSwitch.message'));
    });

    it('does not render image', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-switch-image').should('not.be.visible');
      });
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('newsletter-col-content'), 100);
      });
    });
  });
});
