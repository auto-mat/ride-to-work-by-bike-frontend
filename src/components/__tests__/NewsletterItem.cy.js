import { ref } from 'vue';
import { colors } from 'quasar';
import NewsletterItem from '../homepage/NewsletterItem.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { newsletterItems as newsletterItemsFixture } from '../../mocks/homepage';
import { vModelAdapter } from '../../../test/cypress/utils';

// colors
const { getPaletteColor, changeAlpha } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const newsletterItem = 'newsletter-item';
const newsletterItemAvatar = 'newsletter-item-avatar';
const newsletterItemToggle = 'newsletter-item-toggle';
const newsletterItemContent = 'newsletter-item-content';
const newsletterItemFollowIcon = 'newsletter-follow-icon';
const newsletterItemIcon = 'newsletter-item-icon';
const newsletterItemTitle = 'newsletter-item-title';

// variables
const avatarSize = 38;
const iconSize = 18;
const colorPrimaryOpacity = changeAlpha(
  primary,
  rideToWorkByBikeConfig.colorPrimaryOpacity,
);

const model = ref([newsletterItemsFixture[0].id]);
const modelEmpty = ref([]);

describe('<NewsletterItem>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(NewsletterItem, {
        props: {
          item: newsletterItemsFixture[0],
          ...vModelAdapter(model),
        },
      });
      cy.viewport('macbook-16');
    });

    it('has display flex column', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItem)
          .should('be.visible')
          .and('have.css', 'display', 'flex')
          .and('have.css', 'flex-direction', 'row');
      });
    });

    it('aligns content to the sides', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItem).should(
          'have.css',
          'justify-content',
          'space-between',
        );
      });
    });

    coreTests();

    it('renders button with icon', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItemToggle)
          .should('be.visible')
          .and('contain', i18n.global.t('index.newsletterFeature.following'));
        cy.dataCy(newsletterItemFollowIcon).should('have.color', grey10);
        cy.dataCy(newsletterItemFollowIcon)
          .invoke('height')
          .should('be.eq', iconSize);
        cy.dataCy(newsletterItemFollowIcon)
          .invoke('width')
          .should('be.eq', iconSize);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(NewsletterItem, {
        props: {
          item: newsletterItemsFixture[0],
          ...vModelAdapter(model),
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders button with icon', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItemToggle)
          .should('be.visible')
          .and('contain', i18n.global.t('index.newsletterFeature.following'));
        cy.dataCy(newsletterItemFollowIcon).should('have.color', grey10);
        cy.dataCy(newsletterItemFollowIcon)
          .invoke('height')
          .should('be.eq', iconSize);
        cy.dataCy(newsletterItemFollowIcon)
          .invoke('width')
          .should('be.eq', iconSize);
      });
      cy.testElementPercentageWidth(cy.dataCy(newsletterItemToggle), 100);
    });

    it('aligns content to the right', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItem).should(
          'have.css',
          'justify-content',
          'flex-end',
        );
      });
    });

    it('does not wrap icon and title', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItemContent).should(
          'have.css',
          'flex-wrap',
          'nowrap',
        );
      });
    });
  });

  context('not following', () => {
    beforeEach(() => {
      cy.mount(NewsletterItem, {
        props: {
          item: newsletterItemsFixture[0],
          ...vModelAdapter(modelEmpty),
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders primary button', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItemToggle)
          .should('be.visible')
          .and('contain', i18n.global.t('index.newsletterFeature.follow'))
          .within(() => {
            cy.dataCy(newsletterItemFollowIcon).should('not.be.visible');
          });
      });
    });
  });

  function coreTests() {
    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItemTitle)
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10)
          .and('contain', newsletterItemsFixture[0].title)
          .then(($title) => {
            expect($title.text()).to.equal(newsletterItemsFixture[0].title);
          });
      });
    });

    it('renders avatar', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItemAvatar)
          .should('be.visible')
          .and('have.backgroundColor', colorPrimaryOpacity);
        cy.dataCy(newsletterItemAvatar)
          .invoke('height')
          .should('be.eq', avatarSize);
        cy.dataCy(newsletterItemAvatar)
          .invoke('width')
          .should('be.eq', avatarSize);
      });
    });

    it('renders icon', () => {
      cy.window().then(() => {
        cy.dataCy(newsletterItemIcon)
          .should('be.visible')
          .and('have.color', primary);
        cy.dataCy(newsletterItemIcon)
          .invoke('height')
          .should('be.eq', iconSize);
        cy.dataCy(newsletterItemIcon).invoke('width').should('be.eq', iconSize);
      });
    });
  }
});
