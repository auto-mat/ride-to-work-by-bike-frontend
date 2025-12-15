import { colors } from 'quasar';
import ChallengeInactiveInfo from 'components/homepage/ChallengeInactiveInfo.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const whiteOpacity20 = changeAlpha(
  white,
  rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
);

// selectors
const selectorChallengeInactiveInfo = 'challenge-inactive-info';
const selectorChallengeInactiveTitle = 'challenge-inactive-title';
const selectorChallengeInactiveText = 'challenge-inactive-text';
const selectorChallengeInactiveGraphics = 'challenge-inactive-graphics';
const selectorChallengeInactiveAvatar = 'challenge-inactive-avatar';
const selectorChallengeInactiveIcon = 'challenge-inactive-icon';

// variables
const fontSizeTitle = 24;
const fontWeightTitle = 700;
const fontSizeText = 14;
const fontWeightText = 400;
const avatarSize = 64;
const iconSize = 40;

describe('<ChallengeInactiveInfo>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'text'],
      'challengeInactive',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.interceptThisCampaignGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(ChallengeInactiveInfo, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.interceptThisCampaignGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(ChallengeInactiveInfo, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.wait('@thisCampaignRequest');
    cy.dataCy(selectorChallengeInactiveInfo).should('be.visible');
    cy.fixture('apiGetThisCampaign').then((campaign) => {
      const description = campaign['results'][0]['description'];
      const titleRegex = /<h1>(.*)<\/h1>/g;
      const title = titleRegex.exec(description);
      // title
      cy.dataCy(selectorChallengeInactiveTitle)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeTitle}px`)
        .and('have.css', 'font-weight', `${fontWeightTitle}`)
        .and('have.color', white)
        .and('contain', title[1]);
      // text
      cy.dataCy(selectorChallengeInactiveText)
        .should('be.visible')
        .and('have.css', 'font-size', `${fontSizeText}px`)
        .and('have.css', 'font-weight', `${fontWeightText}`)
        .then(($el) => {
          const content = $el.text();
          cy.stripHtmlTags(
            description.substring(title[0].length, description.length),
          ).then((text) => {
            expect(content).to.equal(text);
          });
        });
    });

    // graphics
    cy.dataCy(selectorChallengeInactiveGraphics).should('be.visible');
    // avatar
    cy.dataCy(selectorChallengeInactiveAvatar)
      .should('be.visible')
      .and('have.backgroundColor', whiteOpacity20)
      .invoke('height')
      .should('eq', avatarSize);
    cy.dataCy(selectorChallengeInactiveAvatar)
      .invoke('width')
      .should('eq', avatarSize);
    // icon
    cy.dataCy(selectorChallengeInactiveIcon)
      .should('be.visible')
      .and('have.color', white)
      .invoke('height')
      .should('eq', iconSize);
    cy.dataCy(selectorChallengeInactiveIcon)
      .invoke('width')
      .should('eq', iconSize);
    cy.dataCy(selectorChallengeInactiveIcon)
      .find('use')
      .invoke('attr', 'xlink:href')
      .should('eq', 'icons/challenge_inactive/icons.svg#email');
  });
}
