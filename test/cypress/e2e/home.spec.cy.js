import { whiteColor, hexToRgb } from '../../../test/cypress/utils/';

describe('Home page', () => {

  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
  });

  it('renders all components', () => {
    let i18n;
    cy.window().should('have.property', 'i18n');
    cy.window().then((win) => { i18n = win.i18n; })
      .then(() => {
        cy.dataCy('q-main')
          .should('be.visible');

        cy.dataCy('index-title')
          .should('be.visible')
          .should('have.css', 'font-size', '24px')
          .should('have.css', 'font-weight', '700')
          .should('contain', i18n.global.t('index.title'));

        cy.dataCy('event-countdown')
          .should('be.visible');

        cy.dataCy('list-challenge')
          .should('be.visible');

        cy.dataCy('banner-image')
          .should('be.visible');

        cy.dataCy('heading-background')
          .should('be.visible');

        cy.dataCy('list-event')
          .should('be.visible');

      })
  });

  it('renders left drawer on desktop', () => {
    cy.viewport('macbook-13');

    cy.dataCy('q-drawer')
      .should('be.visible');
  })

  it('allows user to change profile to "User 3" and back to "User 1"', () => {
    cy.viewport('macbook-13');

    cy.dataCy('user-select-input').click();

    cy.get(".q-item__label")
      .should('be.visible')
      .should('have.length', 3)
      .should('contain.text', 'User')
      .last()
      .click()

    cy.dataCy('user-select-input')
      .should('contain', 'User 3');

    cy.dataCy('user-select-input').click();

    cy.get(".q-item__label")
      .should('be.visible')
      .should('have.length', 3)
      .should('contain.text', 'User')
      .first()
      .click()

    cy.dataCy('user-select-input')
      .should('contain', 'User 1');
  })

  it('allows user to show and hide left panel on mobile', () => {
    cy.viewport('iphone-6');

    cy.dataCy('q-drawer')
      .should('not.be.visible');

    cy.dataCy('drawer-open-button').click();

    cy.dataCy('q-drawer')
      .should('be.visible')
      .and('have.css', 'width', '320px');

    // TODO: test closing the drawer
    // cy.get('body')
    //   .trigger('pointerdown', { button: 0, clientX: 325, clientY: 100, force: true })
    //   .trigger('pointerup', { button: 0, clientX: 325, clientY: 100, force: true });

    // cy.dataCy('q-drawer')
    //   .should('not.be.visible');

  });

});
