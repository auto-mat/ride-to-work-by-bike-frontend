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

  // TODO: test drawer on mobile
  it('allows user to show and hide left panel', () => {
    cy.viewport('iphone-6');

    cy.dataCy('q-drawer')
      .should('not.be.visible');

    cy.get('body')
      .trigger('pointerdown', { button: 0, x: 10, y: 10, force: true })
      .trigger('pointermove', { button: 0, x: 300, y: 10, force: true })
      .trigger('pointerup', { button: 0, x: 300, y: 10, force: true })

    cy.dataCy('q-drawer')
      .should('be.visible')
      .and('have.css', 'width', '320px');
  });

});
