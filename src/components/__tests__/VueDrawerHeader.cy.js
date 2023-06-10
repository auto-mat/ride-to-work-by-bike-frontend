import { hexToRgb } from 'app/test/cypress/utils';
import VueDrawerHeader from '../VueDrawerHeader.vue';

describe('<VueDrawerHeader>', () => {
  beforeEach(() => {
    cy.mount(VueDrawerHeader, {});
  });

  it('renders logo', () => {
    cy.window().then(() => {
      cy.dataCy('logo')
        .should('be.visible')
        .should('have.css', 'height', '40px');
    });
  });

  it('renders help icon', () => {
    cy.window().then(() => {
      cy.dataCy('icon-help')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#000000'))
        .should('have.css', 'width', '24px')
        .should('contain.text', 'help');
    });
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.dataCy('icon-notification')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#000000'))
        .should('have.css', 'width', '24px')
        .should('contain.text', 'notifications');
    });
  });
});
