import { colors } from 'quasar';
import CardFollow from '../homepage/CardFollow.vue';
import { hexToRgb } from 'app/test/cypress/utils';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const grey8 = getPaletteColor('grey-8');
const primary = getPaletteColor('primary');

// selectors
const classSelectorAvatar = '.q-avatar';
const selectorCardFollow = 'card-follow';
const selectorCardFollowTitle = 'card-follow-title';
const selectorCardFollowHandle = 'card-follow-handle';
const selectorCardFollowAvatar = 'card-follow-avatar';
const selectorCardFollowImage = 'card-follow-image';
const selectorCardFollowLinkIcon = 'card-follow-link-icon';

// variables
const { borderRadiusCard } = rideToWorkByBikeConfig;
const borderColor = hexToRgb(rideToWorkByBikeConfig.colorGrayMiddle);
const titleFontSize = '16px';
const titleFontWeight = '700';
const handleFontSize = '14px';
const handleFontWeight = '400';
const imageBorderRadius = '50%';
const imageWidth = '56px';
const iconSize = '18px';

describe('<CardFollow>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.cardFollow', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listCardsFollow').then((listCardsFollow) => {
        cy.wrap(listCardsFollow[0]).as('card');
        cy.mount(CardFollow, {
          props: {
            card: listCardsFollow[0],
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listCardsFollow').then((listCardsFollow) => {
        cy.wrap(listCardsFollow[0]).as('card');
        cy.mount(CardFollow, {
          props: {
            card: listCardsFollow[0],
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('has white background', () => {
    cy.window().then(() => {
      cy.dataCy(selectorCardFollow).should('have.backgroundColor', white);
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy(selectorCardFollow).should(
        'have.css',
        'border-radius',
        borderRadiusCard,
      );
    });
  });

  it('has border', () => {
    cy.window().then(() => {
      cy.dataCy(selectorCardFollow).should(
        'have.css',
        'border',
        `1px solid ${borderColor}`, // config colorGrayMiddle
      );
    });
  });

  it('has no shadow', () => {
    cy.window().then(() => {
      cy.dataCy(selectorCardFollow).should('have.css', 'box-shadow', 'none');
    });
  });

  it('has padding 16px', () => {
    cy.window().then(() => {
      cy.dataCy(selectorCardFollow).should('have.css', 'padding', '16px');
    });
  });

  it('renders title', () => {
    cy.get('@card').then((card) => {
      cy.window().then(() => {
        cy.dataCy(selectorCardFollowTitle)
          .should('have.css', 'font-size', titleFontSize)
          .and('have.css', 'font-weight', titleFontWeight)
          .and('have.color', grey10)
          .and('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });
  });

  it('renders handle', () => {
    cy.get('@card').then((card) => {
      cy.window().then(() => {
        cy.dataCy(selectorCardFollowHandle)
          .should('have.css', 'font-size', handleFontSize)
          .and('have.css', 'font-weight', handleFontWeight)
          .and('have.color', grey8)
          .and('contain', card.handle)
          .then(($title) => {
            expect($title.text()).to.equal(card.handle);
          });
      });
    });
  });

  it('renders image', () => {
    cy.get('@card').then((card) => {
      cy.window().then(() => {
        cy.dataCy(selectorCardFollowAvatar)
          .should('be.visible')
          .find(classSelectorAvatar)
          .should('have.css', 'border-radius', imageBorderRadius)
          .should('have.css', 'width', imageWidth);
        // wait until image has no loading indicator
        cy.dataCy(selectorCardFollowImage)
          .should('exist')
          .and('be.visible')
          .find('.q-img__loading')
          .should('not.exist');
        // test image height
        cy.dataCy(selectorCardFollowImage)
          .find('img')
          .should('exist')
          .and('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(card.image.src);
          });
        // take a snapshot
        cy.matchImageSnapshotNamed(
          selectorCardFollowImage,
          `${Cypress.currentTest.titlePath[0]}-avatar`,
        );
      });
    });
  });

  it('renders link icon', () => {
    cy.dataCy(selectorCardFollowLinkIcon)
      .should('be.visible')
      .and('have.css', 'width', iconSize)
      .and('have.css', 'height', iconSize)
      .and('have.color', primary);
  });
}
