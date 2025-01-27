import { nextTick } from 'vue';
import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import LoginRegisterMobileMenu from 'components/global/LoginRegisterMobileMenu.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { emptyUser, useLoginStore } from '../../stores/login';
import { rgbaColorObjectToString } from '../../utils';

// colors
const { getPaletteColor, changeAlpha, hexToRgb } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

// config
const { borderRadiusCard, colorWhiteBackgroundOpacity } =
  rideToWorkByBikeConfig;

// selectors
const selectorDialogHelp = 'dialog-help';
const selectorMenuButton = 'mobile-menu-button';
const selectorMenuDropdown = 'mobile-menu-dropdown';
const selectorMenuHelp = 'mobile-menu-help';
const selectorMenuLanguageHeader = 'mobile-menu-language-header';
const selectorMenuLanguageSwitcher = 'mobile-menu-language-switcher';
const selectorMenuLogout = 'mobile-menu-logout';
const selectorMenuSeparator = 'mobile-menu-separator';
const selectorMenuUserInfo = 'mobile-menu-user-info';
const selectorMenuUserInfoEmail = 'mobile-menu-user-info-email';
const selectorMenuUserInfoLabel = 'mobile-menu-user-info-label';
const selectorMobileMenu = 'login-register-mobile-menu';

// variables
const fontWeightBold = 700;
const border = `1px solid ${rgbaColorObjectToString(hexToRgb(changeAlpha(white, colorWhiteBackgroundOpacity)))}`;

describe('<LoginRegisterMobileMenu>', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelHelp', 'labelLanguage', 'labelLoggedInAs'],
      'loginRegisterMobileMenu',
      i18n,
    );
    cy.testLanguageStringsInContext(['logout'], 'userSelect', i18n);
  });

  context('logged out', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterMobileMenu, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders component', () => {
      cy.dataCy(selectorMobileMenu).should('be.visible');
    });

    it('renders menu button with correct styling', () => {
      cy.dataCy(selectorMenuButton)
        .should('be.visible')
        .and('have.backgroundColor', white)
        .and('have.color', primary);
      // changing menu icon
      cy.dataCy(selectorMenuButton).should('contain', 'menu');
      cy.dataCy(selectorMenuButton).click();
      cy.dataCy(selectorMenuButton).should('contain', 'close');
      cy.dataCy(selectorMenuButton).click();
      cy.dataCy(selectorMenuButton).should('contain', 'menu');
    });

    it('shows menu with correct items when clicked', () => {
      // menu initially hidden
      cy.dataCy(selectorMenuDropdown).should('not.exist');
      cy.dataCy(selectorMenuUserInfo).should('not.exist');
      // click menu button
      cy.dataCy(selectorMenuButton).click();
      // menu dropdown
      cy.dataCy(selectorMenuDropdown)
        .should('be.visible')
        .and('have.backgroundColor', primary)
        .and('have.css', 'border', border)
        .and('have.css', 'border-radius', borderRadiusCard);
      // help button
      // cy.dataCy(selectorMenuHelp).should('be.visible');
      // language header
      cy.dataCy(selectorMenuLanguageHeader)
        .should('be.visible')
        .and('contain', i18n.global.t('loginRegisterMobileMenu.labelLanguage'));
      // language switcher
      cy.dataCy(selectorMenuLanguageSwitcher).should('be.visible');
    });

    it.skip('renders help button and displays dialog when clicked', () => {
      // open menu
      cy.dataCy(selectorMenuButton).click();
      // help button
      cy.dataCy(selectorMenuHelp)
        .should('be.visible')
        .and('contain', i18n.global.t('loginRegisterMobileMenu.labelHelp'));
      // click help button
      cy.dataCy(selectorMenuHelp).click();
      // help dialog
      cy.dataCy(selectorDialogHelp).should('be.visible');
    });

    it('renders language switcher', () => {
      // open menu
      cy.dataCy(selectorMenuButton).click();
      // language switcher
      cy.dataCy(selectorMenuLanguageSwitcher)
        .should('be.visible')
        .find('[data-cy="language-switcher"]')
        .should('exist');
    });
  });

  context('logged in', () => {
    beforeEach(() => {
      cy.mount(LoginRegisterMobileMenu, {
        props: {},
      });
      cy.fixture('loginResponse.json')
        .as('loginResponse')
        .then((loginResponse) => {
          const store = useLoginStore();
          store.setUser(loginResponse.user);
        });
      cy.viewport('iphone-6');
    });

    it('renders component', () => {
      cy.dataCy(selectorMobileMenu).should('be.visible');
    });

    it('shows user info and logout button when menu is opened', () => {
      // Click menu button
      cy.dataCy(selectorMenuButton).click();
      // user info
      cy.dataCy(selectorMenuUserInfo).should('be.visible');
      cy.dataCy(selectorMenuUserInfoLabel)
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('loginRegisterMobileMenu.labelLoggedInAs'),
        );
      // user email
      cy.get('@loginResponse').then((loginResponse) => {
        cy.dataCy(selectorMenuUserInfoEmail)
          .should('be.visible')
          .and('have.color', white)
          .and('have.css', 'font-weight', `${fontWeightBold}`)
          .and('contain', loginResponse.user.email);
      });
      // logout button
      cy.dataCy(selectorMenuLogout)
        .should('be.visible')
        .and('contain', i18n.global.t('userSelect.logout'));
    });

    it('shows all menu items and separators', () => {
      // click menu button
      cy.dataCy(selectorMenuButton).click();
      // menu dropdown
      cy.dataCy(selectorMenuDropdown).within(() => {
        cy.dataCy(selectorMenuUserInfo).should('be.visible');
        cy.dataCy(selectorMenuSeparator).first().should('exist');
        // cy.dataCy(selectorMenuHelp).should('be.visible');
        cy.dataCy(selectorMenuLogout).should('be.visible');
        cy.dataCy(selectorMenuSeparator).last().should('exist');
        cy.dataCy(selectorMenuLanguageHeader).should('be.visible');
        cy.dataCy(selectorMenuLanguageSwitcher).should('be.visible');
      });
    });

    it('logs out user when logout button is clicked', () => {
      const store = useLoginStore();
      // user is logged in
      cy.wrap(store.getUserEmail).should('not.be.empty');
      // open menu and click logout
      cy.dataCy(selectorMenuButton).click();
      cy.dataCy(selectorMenuLogout).click();
      // menu is closed
      cy.dataCy(selectorMenuDropdown).should('not.exist');
      // store is cleared
      nextTick(() => {
        cy.wrap(store.getUserEmail).should('be.empty');
        cy.wrap(store.getUser).should('deep.equal', emptyUser);
        cy.wrap(store.getAccessToken).should('be.empty');
        cy.wrap(store.getRefreshToken).should('be.empty');
        cy.wrap(store.getJwtExpiration).should('be.null');
      });
    });
  });
});
