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

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
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
      cy.mount(FooterBar, {
        props: {
          copyright: [
            'Tato aplikace je svobodný software.',
            'Výzvu Do práce na kole pořádá <a href="https://auto-mat.cz" target="_blank">Auto*Mat, z.s.</a>',
          ],
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders background', () => {
      cy.window().then(() => {
        cy.dataCy('footer-background')
          .should('be.visible')
          .and('have.css', 'position', 'absolute')
          .and('have.css', 'top', '0px')
          .and('have.css', 'left', '0px');
      });
    });

    it('renders logo', () => {
      cy.window().then(() => {
        cy.dataCy('footer-logo')
          .should('be.visible')
          .and('have.css', 'height', '40px')
          .and('have.color', white);
      });
    });

    it('renders social menu', () => {
      cy.window().then(() => {
        cy.dataCy('footer-social-menu')
          .should('be.visible')
          .and('have.css', 'display', 'flex')
          .and('have.css', 'align-items', 'center');
        cy.dataCy('footer-social-menu-button')
          .should('be.visible')
          .and('have.css', 'border-radius', '50%');
        cy.dataCy('footer-social-menu-button')
          .invoke('height')
          .should('be.equal', 42);
        cy.dataCy('footer-social-menu-button')
          .invoke('width')
          .should('be.equal', 42);
        cy.dataCy('footer-social-menu-link-facebook')
          .should('be.visible')
          .and('have.attr', 'href', rideToWorkByBikeConfig.urlFacebook);
        cy.dataCy('footer-social-menu-link-instagram')
          .should('be.visible')
          .and('have.attr', 'href', rideToWorkByBikeConfig.urlInstagram);
        cy.dataCy('footer-social-menu-link-twitter')
          .should('be.visible')
          .and('have.attr', 'href', rideToWorkByBikeConfig.urlTwitter);
        cy.dataCy('footer-social-menu-link-youtube')
          .should('be.visible')
          .and('have.attr', 'href', rideToWorkByBikeConfig.urlYoutube);
        // icons
        cy.dataCy('footer-social-menu-icon').each((element, index) => {
          cy.testIcon({
            element,
            name: `footer-social-menu-icon-${index}`,
            size: 18,
            click: false,
          });
        });
      });
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
        cy.dataCy('language-switcher-footer')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', white);
      });
    });

    it('renders a go to top button', () => {
      cy.window().then(() => {
        cy.dataCy('footer-top-button')
          .should('be.visible')
          .and('have.css', 'width', '38px')
          .and('have.css', 'height', '38px')
          .and('have.color', white);
      });
    });

    it('renders copyright list', () => {
      cy.window().then(() => {
        cy.dataCy('footer-copyright-list-desktop')
          .should('be.visible')
          .and('have.css', 'display', 'flex')
          .and('have.css', 'flex-wrap', 'wrap')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', white);
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
  });
});
