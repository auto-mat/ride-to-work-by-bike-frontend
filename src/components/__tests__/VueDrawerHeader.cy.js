import VueDrawerHeader from '../VueDrawerHeader.vue';
import { i18n } from '../../boot/i18n';

describe('<VueDrawerHeader>', () => {
  beforeEach(() => {
    cy.mount(VueDrawerHeader, {});
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleStateDefault',
        'titleStateContact',
        'titleParticipants',
        'titleCoordinators',
        'titleGuide',
        'buttonGuide',
        'titleContact',
        'buttonContact',
        'titleLinks',
        'titleSocials',
      ],
      'index.help',
      i18n
    );
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
        .should('have.color', '#000000')
        .should('have.css', 'width', '24px')
        .should('contain.text', 'help');
    });
  });

  it('renders notifications icon', () => {
    cy.window().then(() => {
      cy.dataCy('icon-notification')
        .should('be.visible')
        .should('have.color', '#000000')
        .should('have.css', 'width', '24px')
        .should('contain.text', 'notifications');
    });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.dataCy('link-help')
        .click()
        .then(() => {
          cy.dataCy('dialog-help').should('be.visible');
        });
    });
  });

  it('renders modal title', () => {
    cy.window().then(() => {
      cy.dataCy('link-help')
        .click()
        .then(() => {
          cy.dataCy('dialog-header')
            .find('h3')
            .should('be.visible')
            .should('have.css', 'font-size', '20px')
            .should('have.css', 'font-weight', '500')
            .should('contain', i18n.global.t('index.help.titleStateDefault'))
            .then(($title) => {
              expect($title.text()).to.equal(
                i18n.global.t('index.help.titleStateDefault')
              );
            });
        });
    });
  });

  it('renders guide section with title and button', () => {
    cy.window().then(() => {
      cy.dataCy('link-help')
        .click()
        .then(() => {
          // TODO: Find if you can calculate height exact height of the sections
          cy.dataCy('dialog-body').scrollTo(0, 1060);

          cy.dataCy('title-guide')
            .should('be.visible')
            .should('have.css', 'font-size', '24px')
            .should('have.css', 'font-weight', '700')
            .should('contain', i18n.global.t('index.help.titleGuide'))
            .then(($title) => {
              expect($title.text()).to.equal(
                i18n.global.t('index.help.titleGuide')
              );
            });

          cy.dataCy('button-guide')
            .should('be.visible')
            .should('contain.text', i18n.global.t('index.help.buttonGuide'))
            .then(($button) => {
              expect($button.text()).to.equal(
                i18n.global.t('index.help.buttonGuide')
              );
            });
        });
    });
  });
});
