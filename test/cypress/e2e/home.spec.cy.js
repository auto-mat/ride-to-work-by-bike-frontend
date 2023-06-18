import { whiteColor, hexToRgb } from '../../../test/cypress/utils/';

describe('Home page', () => {

  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.window().should('have.property', 'i18n');
  });

  it('renders all components', () => {
    let i18n;
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

  // it('renders expandable left drawer', () => {
  //   let i18n;
  //   cy.window().then((win) => { i18n = win.i18n; })
  //     .then(() => {
  //       cy.dataCy('q-drawer')
  //         .should('not.be.visible');


  //       cy.get('body')
  //         .trigger('pointerdown', { button: 0, x: 10, y: 10, force: true })
  //         .trigger('pointermove', { button: 0, x: 300, y: 10, force: true })
  //         .trigger('pointerup', { button: 0, x: 300, y: 10, force: true })

  //       cy.dataCy('q-drawer')
  //         .should('be.visible')
  //         .and('have.css', 'width', '320px');
  //     });
  // });

  it('renders main content with title', () => {
    cy.task('getAppConfig', process).then((config) => {
    });
  });

});
