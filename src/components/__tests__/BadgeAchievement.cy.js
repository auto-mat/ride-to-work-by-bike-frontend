import { colors } from 'quasar';
import BadgeAchievement from '../homepage/BadgeAchievement.vue';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { i18n } from '../../boot/i18n';
import { badgeList } from '../../mocks/homepage';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const selectorBadgeCard = 'badge-card';
const selectorBadgeTitle = 'badge-title';
const selectorBadgeImage = 'badge-image';
const selectorBadgeDescription = 'badge-description';
const selectorBadgeShareButton = 'badge-share-button';
const selectorBadgeShareIcon = 'badge-share-icon';

// variables
const fontSizeDescription = 12;
const fontSizeTitle = 14;
const fontWeightTitle = 700;
const fontWeightDescription = 400;
const iconSize = 18;
const badge = badgeList[0];
const badgeDark = badgeList[1];

describe('<BadgeAchievement>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BadgeAchievement, {
        props: {
          badge,
        },
      });
      cy.wrap(badge).as('badge');
      cy.viewport('macbook-16', { deviceScaleFactor: 1 });
    });

    coreTests();

    it('has light background', () => {
      cy.dataCy(selectorBadgeCard).should('have.backgroundColor', white);
    });

    it('has dark text', () => {
      cy.window().then(() => {
        cy.dataCy(selectorBadgeTitle).should('have.color', grey10);
        cy.dataCy(selectorBadgeDescription).should('have.color', grey10);
      });
    });
  });

  context('desktop dark', () => {
    beforeEach(() => {
      cy.mount(BadgeAchievement, {
        props: {
          badge: badgeDark,
        },
      });
      cy.wrap(badgeDark).as('badge');
      cy.viewport('iphone-6', { deviceScaleFactor: 1 });
    });

    coreTests();

    it('has dark background', () => {
      cy.dataCy(selectorBadgeCard).should('have.backgroundColor', primary);
    });

    it('has light text', () => {
      cy.window().then(() => {
        cy.dataCy(selectorBadgeTitle).should('have.color', white);
        cy.dataCy(selectorBadgeDescription).should('have.color', white);
      });
    });
  });

  function coreTests() {
    it('renders title', () => {
      cy.window().then(() => {
        cy.get('@badge').then((badge) => {
          cy.dataCy(selectorBadgeTitle)
            .should('have.css', 'font-size', `${fontSizeTitle}px`)
            .and('have.css', 'font-weight', fontWeightTitle.toString())
            .and('have.css', 'text-align', 'center')
            .and('contain', badge.title)
            .then(($title) => {
              expect($title.text()).to.equal(badge.title);
            });
        });
      });
    });

    it('has border radius', () => {
      cy.dataCy(selectorBadgeCard).should(
        'have.css',
        'border-radius',
        rideToWorkByBikeConfig.borderRadiusCard,
      );
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.get('@badge').then((badge) => {
          cy.dataCy(selectorBadgeDescription)
            .should('have.css', 'font-size', `${fontSizeDescription}px`)
            .and('have.css', 'font-weight', fontWeightDescription.toString())
            .and('have.css', 'text-align', 'center')
            .and('contain', badge.description)
            .then(($description) => {
              expect($description.text()).to.equal(badge.description);
            });
        });
      });
    });

    it('renders image', () => {
      cy.window().then(() => {
        cy.get('@badge').then((badge) => {
          cy.dataCy(selectorBadgeImage)
            .should('be.visible')
            .find('img')
            .should(($img) => {
              expect($img[0].naturalWidth).to.be.greaterThan(0);
            })
            .invoke('attr', 'src')
            .should('contains', badge.image);
          cy.dataCy(selectorBadgeImage).matchImageSnapshot({
            failureThreshold: 0.5,
            failureThresholdType: 'percent',
          });
        });
      });
    });

    it('renders share button', () => {
      cy.dataCy(selectorBadgeShareButton).should('be.visible');
      cy.dataCy(selectorBadgeShareIcon).should('be.visible');
      cy.dataCy(selectorBadgeShareIcon).invoke('height').should('eq', iconSize);
      cy.dataCy(selectorBadgeShareIcon).invoke('width').should('eq', iconSize);
    });
  }
});
