import { colors } from 'quasar';
import { routesConf } from '../../../src/router/routes_conf';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const layoutBackgroundImageSelector = 'layout-background-image';

/**
 * Basic tests for Language Switcher
 *
 * Used in `register_challenge.spec.cy.js` and `login.spec.cy.js`
 */
export const testLanguageSwitcher = (): void => {
  it('allows user to switch language', () => {
    let i18n;
    cy.window().should('have.property', 'i18n');
    cy.window()
      .then((win) => {
        i18n = win.i18n;
      })
      .then(() => {
        const locales = i18n.global.availableLocales;
        const initialActiveLocale = i18n.global.locale;

        // active language has active class
        cy.dataCy('switcher-' + initialActiveLocale)
          .find('.q-btn')
          .should('have.class', 'bg-secondary');

        locales.forEach((locale) => {
          if (locale !== initialActiveLocale) {
            // changing the language
            cy.dataCy('switcher-' + locale)
              .should('exist')
              .and('be.visible')
              .find('.q-btn')
              .click();
            // old language becomes inactive
            cy.dataCy('switcher-' + initialActiveLocale)
              .find('.q-btn')
              .should('have.class', 'bg-white');
            // new language becomes active
            cy.dataCy('switcher-' + locale)
              .find('.q-btn')
              .should('have.class', 'bg-secondary');
          }
        });
      });
  });
};

/**
 * Test the visibility of a background image
 * Note that it is a `fixed` image, so we cannot test `be.visible`
 */
export const testBackgroundImage = (): void => {
  it('should have a background image', () => {
    cy.task('getAppConfig', process).then((config) => {
      cy.dataCy(layoutBackgroundImageSelector)
        .invoke('width')
        .should('be.greaterThan', 0);
      cy.dataCy(layoutBackgroundImageSelector)
        .invoke('height')
        .should('be.greaterThan', 0);
      cy.dataCy(layoutBackgroundImageSelector).should('have.css', 'mask-image');
      cy.dataCy(layoutBackgroundImageSelector)
        .find('img')
        .should('have.attr', 'src', config.urlLoginRegisterBackgroundImage);
      // test background image on different screen sizes
      cy.viewport('iphone-3');
      cy.dataCy(layoutBackgroundImageSelector).should('not.exist');
      cy.viewport('iphone-xr');
      cy.dataCy(layoutBackgroundImageSelector).should('not.exist');
      cy.viewport('macbook-11');
      cy.dataCy(layoutBackgroundImageSelector).should('exist');
      cy.viewport('macbook-16');
      cy.dataCy(layoutBackgroundImageSelector).should('exist');
    });
  });
};

export const testPasswordInputReveal = (identifier: string): void => {
  it('should allow user to reveal and hide password', () => {
    // password hidden
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'password');
    // reveal
    cy.dataCy(`${identifier}-icon`).click();
    // password revealed
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'text');
    // hide
    cy.dataCy(`${identifier}-icon`).click();
    // password hidden
    cy.dataCy(identifier).find('input').should('have.attr', 'type', 'password');
  });
};

export const testDesktopSidebar = (): void => {
  const selectorDrawer = 'q-drawer';
  const selectorDrawerHeader = 'drawer-header';
  const selectorUserSelectDesktop = 'user-select-desktop';
  const selectorDrawerMenuTop = 'drawer-menu-top';
  const selectorDrawerMenuBottom = 'drawer-menu-bottom';

  it('renders left drawer', () => {
    cy.dataCy(selectorDrawer).should('be.visible');
    cy.dataCy(selectorDrawerHeader).should('be.visible');
    cy.dataCy(selectorUserSelectDesktop).should('be.visible');
    cy.dataCy(selectorDrawerMenuTop).should('be.visible');
    cy.dataCy(selectorDrawerMenuBottom).should('be.visible');
  });

  testUserSelect(selectorUserSelectDesktop);
};

export const testMobileHeader = (): void => {
  const selectorButtonHelp = 'button-help';
  const selectorUserSelect = 'user-select-mobile';

  it('renders mobile header', () => {
    cy.dataCy(selectorButtonHelp).should('be.visible');
    cy.dataCy(selectorUserSelect).should('be.visible');
  });

  testUserSelect(selectorUserSelect);
};

export const testUserSelect = (selector: string): void => {
  const classSelectorMenu = '.q-menu';
  const selectorMenuItem = 'menu-item';

  it('renders user select', () => {
    cy.dataCy(selector).should('be.visible');
  });

  it('checks navigation links in the menu', () => {
    const selectorUserSelectInput = 'user-select-input';

    const menuItems = [
      { url: routesConf['profile_details']['children']['fullPath'] },
      { url: routesConf['profile_newsletter']['children']['fullPath'] },
      { url: routesConf['routes_app']['children']['fullPath'] },
      { url: routesConf['profile_notifications']['children']['fullPath'] },
      { url: routesConf['company_coordinator']['children']['fullPath'] },
    ];

    cy.dataCy(selector).within(() => {
      cy.dataCy(selectorUserSelectInput).should('be.visible').click();
    });
    cy.get(classSelectorMenu)
      .should('be.visible')
      .within(() => {
        menuItems.forEach((item, index) => {
          cy.dataCy(selectorMenuItem)
            .eq(index)
            .invoke('attr', 'href')
            .should('contain', item.url);
        });
      });
    cy.dataCy(selector).click();
  });
};

/**
 * Test styles for title in route list
 * Used in `RouteListDisplay.cy.js` and `RouteListEdit.cy.js`
 */
export const testRouteListDayDate = (): void => {
  it('renders route list day and date', () => {
    cy.dataCy('route-list-day-date')
      .should('be.visible')
      .and('have.css', 'font-size', '18px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
  });
};

export const httpSuccessfullStatus = 200;
export const httpInternalServerErrorStatus = 500;
export const httpTooManyRequestsStatus = 429;
export const httpTooManyRequestsStatusMessage = `HTTP status code ${httpTooManyRequestsStatus} Too Many Requests ("rate limiting").`;
export const failOnStatusCode = false;

// access token expiration time: Tuesday 24. September 2024 22:36:03
const fixtureTokenExpiration = new Date('2024-09-24T22:36:03Z');
const fixtureTokenExpirationTime = fixtureTokenExpiration.getTime() / 1000;
const timeUntilRefresh = 60;
export const timeUntilExpiration = timeUntilRefresh * 2;
export const systemTime = fixtureTokenExpirationTime - timeUntilExpiration; // 2 min before JWT expires
