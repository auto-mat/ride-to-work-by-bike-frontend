import NewsletterFeature from 'components/NewsletterFeature.vue';
import { i18n } from '../../boot/i18n';

describe('<NewsletterFeature>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'title',
        'description',
        'aboutChallenges',
        'aboutEvents',
        'aboutMobility',
        'following',
        'follow',
      ],
      'index.newsletterFeature',
      i18n
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(NewsletterFeature, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', i18n.global.t('index.newsletterFeature.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.newsletterFeature.title')
            );
          });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-description')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should(
            'contain',
            i18n.global.t('index.newsletterFeature.description')
          )
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.newsletterFeature.description')
            );
          });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-image')
          .should('be.visible')
          .find('img')
          .should(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });

        cy.dataCy('newsletter-feature-image').matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-item')
          .should('have.length', 3)
          .each(($item) => {
            cy.wrap($item).should('be.visible');
          });
      });
    });

    it('renders divider between items', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-separator')
          .should('be.visible')
          .should('have.length', 2)
          .should('have.css', 'margin-top', '16px')
          .should('have.css', 'margin-bottom', '16px');
      });
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
      cy.mount(NewsletterFeature, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', i18n.global.t('index.newsletterFeature.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.newsletterFeature.title')
            );
          });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-description')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#000000')
          .should(
            'contain',
            i18n.global.t('index.newsletterFeature.description')
          )
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.newsletterFeature.description')
            );
          });
      });
    });

    it('does not render image', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-image').should('not.be.visible');
      });
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('newsletter-col-content'), 100);
      });
    });
  });
});
