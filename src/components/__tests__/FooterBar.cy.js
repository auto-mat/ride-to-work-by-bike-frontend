import { colors } from 'quasar';
import FooterBar from '../global/FooterBar.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
} from '../../../test/cypress/support/commonTests';

// colors
const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');
const primary = getPaletteColor('primary');

// selectors
const selectorFooterLogo = 'footer-logo';
const selectorFooterAutoMatLogoLink = 'footer-auto-mat-logo-link';
const selectorFooterAutoMatLogo = 'footer-auto-mat-logo';
const selectorFooterLogoSeparator = 'footer-logo-separator';
const selectorFooterSocialMenu = 'footer-social-menu';
const selectorFooterSocialMenuButton = 'footer-social-menu-button';
const selectorFooterSocialMenuLinkFacebook = 'footer-social-menu-link-facebook';
const selectorFooterSocialMenuLinkInstagram =
  'footer-social-menu-link-instagram';
const selectorFooterSocialMenuLinkTwitter = 'footer-social-menu-link-twitter';
const selectorFooterSocialMenuLinkYoutube = 'footer-social-menu-link-youtube';
const selectorFooterSocialMenuIcon = 'footer-social-menu-icon';
const selectorLanguageSwitcherFooter = 'language-switcher-footer';
const selectorFooterTopButton = 'footer-top-button';
const selectorFooterTopButtonText = 'footer-top-button-text';
const selectorFooterAutoMat = 'footer-auto-mat';
const selectorFooterChallengeOrganizer = 'footer-challenge-organizer';
const selectorFooterAppInfoDesktop = 'footer-app-info-desktop';
const selectorFooterAppInfoMobile = 'footer-app-info-mobile';
const selectorFooterAppInfoLicenceDesktop = 'footer-app-info-licence-desktop';
const selectorFooterAppInfoDeployedVersionDesktop =
  'footer-app-info-deployed-version-desktop';
const selectorFooterAppInfoLicenceMobile = 'footer-app-info-licence-mobile';
const selectorFooterAppInfoDeployedVersionMobile =
  'footer-app-info-deployed-version-mobile';

// variables
const iconSize = 24;
const displayFlex = 'flex';
const flexWrap = 'wrap';
const fontSize = '14px';
const fontWeight = '400';

// Fix make request user-agent header on the macOS with Google Chrome web browser
const urlTwitterUserAgentHeader =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) \
AppleWebKit/537.36 (KHTML, like Gecko) \
Chrome/119.0.0.0 Safari/537.36';

describe('<FooterBar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FooterBar, {});
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders Auto*Mat logo text', () => {
      cy.dataCy(selectorFooterChallengeOrganizer)
        .should('be.visible')
        .and('have.css', 'font-size', fontSize)
        .and('have.css', 'font-weight', fontWeight)
        .and('have.color', grey8)
        .and('contain', i18n.global.t('footer.textChallengeOrganizer'));
    });

    it('renders application info', () => {
      cy.window().then(() => {
        cy.dataCy(selectorFooterAppInfoDesktop)
          .should('be.visible')
          .and('have.css', 'display', displayFlex)
          .and('have.css', 'flex-wrap', flexWrap)
          .and('have.css', 'font-size', fontSize)
          .and('have.css', 'font-weight', fontWeight)
          .and('have.color', grey8);
      });
      cy.dataCy(selectorFooterAppInfoLicenceDesktop).should(
        'have.attr',
        'href',
        rideToWorkByBikeConfig.urlFreeSoftwareDefinition,
      );
      cy.fixture('deployedAppVersion').then((deployedAppVersion) => {
        cy.dataCy(selectorFooterAppInfoDeployedVersionDesktop).should(
          'have.text',
          `${i18n.global.t('footer.deployedAppVersion')}: ${deployedAppVersion.version}`,
        );
      });
    });

    it('test application info URL', () => {
      cy.request({
        url: rideToWorkByBikeConfig.urlFreeSoftwareDefinition,
        failOnStatusCode: failOnStatusCode,
      }).then((resp) => {
        if (resp.status === httpTooManyRequestsStatus) {
          cy.log(httpTooManyRequestsStatusMessage);
          return;
        }
        expect(resp.status).to.eq(httpSuccessfullStatus);
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FooterBar, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders application info', () => {
      cy.window().then(() => {
        cy.dataCy(selectorFooterAppInfoMobile)
          .should('be.visible')
          .and('have.css', 'display', displayFlex)
          .and('have.css', 'flex-wrap', flexWrap)
          .and('have.css', 'font-size', fontSize)
          .and('have.css', 'font-weight', fontWeight)
          .and('have.color', grey8);
      });
      cy.dataCy(selectorFooterAppInfoLicenceMobile).should(
        'have.attr',
        'href',
        rideToWorkByBikeConfig.urlFreeSoftwareDefinition,
      );
      cy.fixture('deployedAppVersion').then((deployedAppVersion) => {
        cy.dataCy(selectorFooterAppInfoDeployedVersionMobile).should(
          'have.text',
          `${i18n.global.t('footer.deployedAppVersion')}: ${deployedAppVersion.version}`,
        );
      });
    });
  });
});

function coreTests() {
  it('renders RTWBB logo', () => {
    cy.window().then(() => {
      cy.dataCy(selectorFooterLogo)
        .should('be.visible')
        .and('have.css', 'width', '142px')
        .and('have.css', 'height', '40px');
    });
  });

  it('renders Auto*Mat logo with separator and text, validate URL link', () => {
    cy.window().then(() => {
      // link
      cy.dataCy(selectorFooterAutoMatLogoLink)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlAutoMat);
      cy.request({
        url: rideToWorkByBikeConfig.urlAutoMat,
        failOnStatusCode: failOnStatusCode,
      }).then((resp) => {
        if (resp.status === httpTooManyRequestsStatus) {
          cy.log(httpTooManyRequestsStatusMessage);
          return;
        }
        expect(resp.status).to.eq(httpSuccessfullStatus);
      });
      cy.dataCy(selectorFooterAutoMatLogo)
        .should('be.visible')
        .and('have.css', 'width', '74px')
        .and('have.css', 'height', '28px');
    });
  });

  it('renders separator between logos', () => {
    cy.dataCy(selectorFooterLogoSeparator).should('be.visible');
  });

  it('renders social menu', () => {
    cy.window().then(() => {
      cy.dataCy(selectorFooterSocialMenu)
        .should('be.visible')
        .and('have.css', 'display', displayFlex)
        .and('have.css', 'align-items', 'center');
      cy.dataCy(selectorFooterSocialMenuButton)
        .should('be.visible')
        .and('have.css', 'border-radius', '50%');
      cy.dataCy(selectorFooterSocialMenuLinkFacebook)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlFacebook);
      cy.dataCy(selectorFooterSocialMenuLinkInstagram)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlInstagram);
      cy.dataCy(selectorFooterSocialMenuLinkTwitter)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlTwitter);
      cy.dataCy(selectorFooterSocialMenuLinkYoutube)
        .should('be.visible')
        .and('have.attr', 'href', rideToWorkByBikeConfig.urlYoutube);
      cy.dataCy(selectorFooterSocialMenuIcon)
        .should('be.visible')
        .and('have.color', primary);
      cy.dataCy(selectorFooterSocialMenuIcon)
        .invoke('height')
        .should('be.equal', iconSize);
      cy.dataCy(selectorFooterSocialMenuIcon)
        .invoke('width')
        .should('be.equal', iconSize);
    });
  });

  it('renders social menu items side by side', () => {
    cy.testElementsSideBySide(
      selectorFooterSocialMenuLinkFacebook,
      selectorFooterSocialMenuLinkInstagram,
    );
    cy.testElementsSideBySide(
      selectorFooterSocialMenuLinkInstagram,
      selectorFooterSocialMenuLinkTwitter,
    );
    cy.testElementsSideBySide(
      selectorFooterSocialMenuLinkTwitter,
      selectorFooterSocialMenuLinkYoutube,
    );
  });

  it('provides valid URLs for social links', () => {
    cy.request({
      url: rideToWorkByBikeConfig.urlFacebook,
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
    cy.request({
      url: rideToWorkByBikeConfig.urlInstagram,
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
    cy.request({
      url: rideToWorkByBikeConfig.urlTwitter,
      headers: { 'user-agent': urlTwitterUserAgentHeader },
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
    cy.request({
      url: rideToWorkByBikeConfig.urlYoutube,
      failOnStatusCode: failOnStatusCode,
    }).then((resp) => {
      if (resp.status === httpTooManyRequestsStatus) {
        cy.log(httpTooManyRequestsStatusMessage);
        return;
      }
      expect(resp.status).to.eq(httpSuccessfullStatus);
    });
  });

  it('renders language switcher', () => {
    cy.window().then(() => {
      cy.dataCy(selectorLanguageSwitcherFooter).should('be.visible');
    });
  });

  it('renders a go to top button', () => {
    cy.window().then(() => {
      // button with icon
      cy.dataCy(selectorFooterTopButton)
        .should('be.visible')
        .and('have.color', primary);
      // text
      cy.dataCy(selectorFooterTopButtonText)
        .should('be.visible')
        .and('have.css', 'font-size', fontSize)
        .and('have.css', 'font-weight', fontWeight)
        .and('have.color', primary);
    });
  });

  it('renders button and text for scrolling to top side by side', () => {
    cy.testElementsSideBySide(
      selectorFooterTopButton,
      selectorFooterTopButtonText,
    );
  });

  it('renders RTWBB logo and Auto*Mat section side by side', () => {
    cy.testElementsSideBySide(selectorFooterLogo, selectorFooterAutoMat);
  });
}
