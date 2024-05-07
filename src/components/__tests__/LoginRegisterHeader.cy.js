import { colors } from 'quasar';

import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');

describe('<LoginRegisterHeader>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['siteTitle'], 'header', i18n);
    cy.testLanguageStringsInContext(['logoAltText'], 'index', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterHeader, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders logo', () => {
      cy.dataCy('logo')
        .should('be.visible')
        .invoke('height')
        .should('be.equal', 80);
    });

    it('renders help button', () => {
      cy.dataCy('button-help')
        .should('be.visible')
        .and('have.css', 'font-size', '13px')
        .and('have.css', 'font-weight', '500')
        .and('have.backgroundColor', primary)
        .and('have.css', 'border-radius', '50%'); // round
      cy.dataCy('button-help').should('contain', 'question_mark');
    });

    it('renders help button with correct size', () => {
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('button-help').invoke('height').should('be.equal', 39);
      cy.dataCy('button-help').invoke('width').should('be.equal', 39);
    });

    it('renders language switcher', () => {
      cy.dataCy('language-switcher').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterHeader, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
