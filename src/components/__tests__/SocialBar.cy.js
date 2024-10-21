import { colors } from 'quasar';
import SocialBar from 'components/homepage/SocialBar.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const white = getPaletteColor('white');

// selectors
const selectorSocialBar = 'social-bar';
const selectorSocialBarTitle = 'social-bar-title';
const selectorSocialBarMenu = 'social-bar-menu';
const selectorSocialBarButton = 'social-bar-button';
const selectorItemFacebook = 'item-facebook';
const selectorItemInstagram = 'item-instagram';
const selectorItemTwitter = 'item-twitter';
const selectorItemYoutube = 'item-youtube';
const selectorSocialBarIcon = 'social-bar-icon';

// variables
const buttonSize = 42;
const iconSize = 18;
const fontSize = 24;
const fontWeight = 700;
const padding = 24;
const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

describe('<SocialBar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title'], 'socialBar', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(SocialBar, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(SocialBar, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorSocialBar)
      .should('be.visible')
      .and('have.backgroundColor', white)
      .and('have.css', 'padding', `${padding}px`)
      .and('have.css', 'border-radius', borderRadius);
  });

  it('renders title with correct styling', () => {
    cy.dataCy(selectorSocialBarTitle)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSize}px`)
      .and('have.css', 'font-weight', `${fontWeight}`)
      .and('have.color', grey10)
      .and('contain', i18n.global.t('socialBar.title'));
  });

  it('renders social menu', () => {
    cy.dataCy(selectorSocialBarMenu)
      .should('be.visible')
      .and('have.css', 'display', 'flex')
      .and('have.css', 'align-items', 'center');
    // buttons
    cy.dataCy(selectorSocialBarButton)
      .should('be.visible')
      .and('have.css', 'border-radius', '50%');
    cy.dataCy(selectorSocialBarButton)
      .invoke('width')
      .should('be.equal', buttonSize);
    cy.dataCy(selectorSocialBarButton)
      .invoke('height')
      .should('be.equal', buttonSize);
    // social links href
    cy.dataCy(selectorItemFacebook).within(() => {
      cy.dataCy(selectorSocialBarButton)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlFacebook);
    });
    cy.dataCy(selectorItemInstagram).within(() => {
      cy.dataCy(selectorSocialBarButton)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlInstagram);
    });
    cy.dataCy(selectorItemTwitter).within(() => {
      cy.dataCy(selectorSocialBarButton)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlTwitter);
    });
    cy.dataCy(selectorItemYoutube).within(() => {
      cy.dataCy(selectorSocialBarButton)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlYoutube);
    });
    // icon
    cy.dataCy(selectorSocialBarIcon)
      .should('be.visible')
      .and('have.color', grey10);
    cy.dataCy(selectorSocialBarIcon)
      .invoke('height')
      .should('be.equal', iconSize);
    cy.dataCy(selectorSocialBarIcon)
      .invoke('width')
      .should('be.equal', iconSize);
  });

  it('renders social menu items side by side', () => {
    cy.testElementsSideBySide(selectorItemFacebook, selectorItemInstagram);
    cy.testElementsSideBySide(selectorItemInstagram, selectorItemTwitter);
    cy.testElementsSideBySide(selectorItemTwitter, selectorItemYoutube);
  });

  it('provides valid URLs for social links', () => {
    cy.request(rideToWorkByBikeConfig.urlFacebook)
      .its('status')
      .should('eq', 200);
    cy.request(rideToWorkByBikeConfig.urlInstagram)
      .its('status')
      .should('eq', 200);
    cy.request(rideToWorkByBikeConfig.urlTwitter)
      .its('status')
      .should('eq', 200);
    cy.request(rideToWorkByBikeConfig.urlYoutube)
      .its('status')
      .should('eq', 200);
  });
}
