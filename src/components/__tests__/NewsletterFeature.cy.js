import { colors } from 'quasar';
import NewsletterFeature from '../homepage/NewsletterFeature.vue';
import { i18n } from '../../boot/i18n';
import { useLoginStore } from 'src/stores/login';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// variables
const fontSizeTitle = '24px';
const fontWeightBold = '700';
const fontSizePerex = '14px';
const fontWeightRegular = '400';
const props = {
  title: 'Custom title',
  description: 'Custom description',
};

describe('<NewsletterFeature>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'aboutChallenges',
        'aboutEvents',
        'aboutMobility',
        'description',
        'following',
        'follow',
        'hint',
        'title',
      ],
      'index.newsletterFeature',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(NewsletterFeature, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-image')
          .should('be.visible')
          .find('img')
          .should('be.visible');
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
          .and('have.length', 2)
          .and('have.css', 'margin-top', '16px')
          .and('have.css', 'margin-bottom', '16px');
      });
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(cy.dataCy('newsletter-col-image'), 16.6);
        cy.testElementPercentageWidth(
          cy.dataCy('newsletter-col-content'),
          83.3,
        );
      });
    });
  });

  context('desktop override props', () => {
    beforeEach(() => {
      cy.mount(NewsletterFeature, {
        props,
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.dataCy('section-heading-title').should('contain', props.title);
    });

    it('renders description', () => {
      cy.dataCy('section-heading-perex').should('contain', props.description);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(NewsletterFeature, {
        props: {},
      });
      cy.viewport('iphone-6');
      const loginStore = useLoginStore();
      loginStore.setUserEmail('test@example.com');
    });

    coreTests();

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

function coreTests() {
  it('renders title', () => {
    cy.window().then(() => {
      cy.dataCy('section-heading-title')
        .should('have.css', 'font-size', fontSizeTitle)
        .and('have.css', 'font-weight', fontWeightBold)
        .and('have.color', primary)
        .and('contain', i18n.global.t('index.newsletterFeature.title'))
        .then(($title) => {
          expect($title.text()).to.contain(
            i18n.global.t('index.newsletterFeature.title'),
          );
        });
    });
  });

  it('renders description', () => {
    cy.window().then(() => {
      cy.dataCy('section-heading-perex')
        .should('have.css', 'font-size', fontSizePerex)
        .and('have.css', 'font-weight', fontWeightRegular)
        .and('have.color', grey10)
        .and('contain', i18n.global.t('index.newsletterFeature.description'))
        .then(($title) => {
          expect($title.text()).to.contain(
            i18n.global.t('index.newsletterFeature.description'),
          );
        });
    });
  });
}
