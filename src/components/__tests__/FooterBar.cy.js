import { colors } from 'quasar';
import FooterBar from '../FooterBar.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');

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
          .should('have.css', 'border-radius', '50%');
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
        cy.dataCy('footer-social-menu-icon')
          .should('be.visible')
          .should('have.color', white);
        cy.dataCy('footer-social-menu-icon')
          .invoke('height')
          .should('be.equal', 18);
        cy.dataCy('footer-social-menu-icon')
          .invoke('width')
          .should('be.equal', 18);
      });
    });

    it('provides valid URLs for social links', () => {
      cy.request(rideToWorkByBikeConfig.urlFacebook)
        .its('status')
        .should('equal', 200);
      cy.request(rideToWorkByBikeConfig.urlInstagram)
        .its('status')
        .should('equal', 200);
      cy.request(rideToWorkByBikeConfig.urlTwitter)
        .its('status')
        .should('equal', 200);
      cy.request(rideToWorkByBikeConfig.urlYoutube)
        .its('status')
        .should('equal', 200);
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
