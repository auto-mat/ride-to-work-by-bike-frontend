import FooterBar from 'components/FooterBar.vue';
import { i18n } from '../../boot/i18n';

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
          .should('have.css', 'position', 'absolute')
          .should('have.css', 'top', '0px')
          .should('have.css', 'left', '0px');
      });
    });

    it('renders logo', () => {
      cy.window().then(() => {
        cy.dataCy('footer-logo')
          .should('be.visible')
          .should('have.css', 'height', '40px')
          .should('have.color', '#ffffff');
      });
    });

    it('renders social menu', () => {
      cy.window().then(() => {
        cy.dataCy('footer-social-menu')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'align-items', 'center');
      });
    });

    it('renders language switcher', () => {
      cy.window().then(() => {
        cy.dataCy('footer-language-switcher')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#ffffff');
      });
    });

    it('renders a go to top button', () => {
      cy.window().then(() => {
        cy.dataCy('footer-top-button')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.color', '#ffffff');
      });
    });

    it('renders copyright list', () => {
      cy.window().then(() => {
        cy.dataCy('footer-copyright-list-desktop')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#ffffff');
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
