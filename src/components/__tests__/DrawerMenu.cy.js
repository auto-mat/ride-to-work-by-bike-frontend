import DrawerMenu from '../global/DrawerMenu.vue';
import { i18n } from '../../boot/i18n';
import { colors } from 'quasar';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { defaultLocale } from 'src/i18n/def_locale';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';
import { useMenu } from 'src/composables/useMenu';

import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey4 = getPaletteColor('grey-4');

// selectors
const selectorDrawerMenuItem = 'drawer-menu-item';
const selectorDrawerMenuItemIcon = 'drawer-menu-item-icon';

// variables
const iconSize = 18;
const fontSize = '16px';

const {
  urlRideToWorkByBikeOldFrontendDjangoApp,
  urlRideToWorkByBikeOldFrontendDjangoAppAdmin,
} = rideToWorkByBikeConfig;
const rtwbbOldFrontendDjangoAdminUrl = `${urlRideToWorkByBikeOldFrontendDjangoApp}/${urlRideToWorkByBikeOldFrontendDjangoAppAdmin}`;

const { getMenuBottom, getMenuTop } = useMenu();

describe('DrawerMenu', () => {
  context('menu top - user is not coordinator', () => {
    beforeEach(() => {
      cy.wrap(
        getMenuTop({
          isUserOrganizationAdmin: false,
          isUserStaff: false,
          urlAdmin: rtwbbOldFrontendDjangoAdminUrl,
          isEntryEnabled: true,
          isResultsEnabled: true,
        }),
      ).then((menuTop) => {
        cy.mount(DrawerMenu, {
          props: {
            items: menuTop,
          },
        });
        cy.wrap(menuTop).as('menu');
      });
    });

    coreTests();

    it('has translation for all strings', () => {
      cy.get('@menu').then((menuTop) => {
        cy.testLanguageStringsInContext(
          menuTop.map((item) => item.title),
          'drawerMenu',
          i18n,
        );
      });
    });

    it('does not render coordinator item', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.coordinator'))
        .should('not.exist');
    });
  });

  context('menu top - user is coordinator', () => {
    beforeEach(() => {
      cy.wrap(
        getMenuTop({
          isUserOrganizationAdmin: true,
          isUserStaff: false,
          urlAdmin: rtwbbOldFrontendDjangoAdminUrl,
          isEntryEnabled: true,
          isResultsEnabled: true,
        }),
      ).then((menuTop) => {
        cy.mount(DrawerMenu, {
          props: {
            items: menuTop,
          },
        });
        cy.wrap(menuTop).as('menu');
      });
    });

    coreTests();

    it('has translation for all strings', () => {
      cy.get('@menu').then((menuTop) => {
        cy.testLanguageStringsInContext(
          menuTop.map((item) => item.title),
          'drawerMenu',
          i18n,
        );
      });
    });

    it('renders coordinator item', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.coordinator'))
        .should('be.visible');
    });
  });

  context('menu top - user staff', () => {
    beforeEach(() => {
      const urlAdmin = getApiBaseUrlWithLang(
        null,
        rtwbbOldFrontendDjangoAdminUrl,
        defaultLocale,
        i18n,
      );
      cy.wrap(
        getMenuTop({
          isUserOrganizationAdmin: false,
          isUserStaff: true,
          urlAdmin,
          isEntryEnabled: true,
          isResultsEnabled: true,
        }),
      ).then((menuTop) => {
        cy.mount(DrawerMenu, {
          props: {
            items: menuTop,
          },
        });
        cy.wrap(menuTop).as('menu');
      });
    });

    coreTests();

    it('has translation for all strings', () => {
      cy.get('@menu').then((menuTop) => {
        cy.testLanguageStringsInContext(
          menuTop.map((item) => item.title),
          'drawerMenu',
          i18n,
        );
      });
    });

    it('renders administration item', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.admin'))
        .should('be.visible')
        .and(
          'have.attr',
          'href',
          getApiBaseUrlWithLang(
            null,
            rtwbbOldFrontendDjangoAdminUrl,
            defaultLocale,
            i18n,
          ),
        )
        .should('have.attr', 'target', '_blank')
        .invoke('attr', 'href')
        .then((href) => {
          cy.request({
            url: href,
            failOnStatusCode: failOnStatusCode,
            headers: { ...userAgentHeader },
          }).then((resp) => {
            if (resp.status === httpTooManyRequestsStatus) {
              cy.log(httpTooManyRequestsStatusMessage);
              return;
            }
            expect(resp.status).to.eq(httpSuccessfullStatus);
          });
        });
    });
  });

  context('menu top - entry disabled', () => {
    beforeEach(() => {
      const urlAdmin = getApiBaseUrlWithLang(
        null,
        rtwbbOldFrontendDjangoAdminUrl,
        defaultLocale,
        i18n,
      );
      cy.wrap(
        getMenuTop({
          isUserOrganizationAdmin: false,
          isUserStaff: true,
          urlAdmin,
          isEntryEnabled: false,
          isResultsEnabled: true,
        }),
      ).then((menuTop) => {
        cy.mount(DrawerMenu, {
          props: {
            items: menuTop,
          },
        });
        cy.wrap(menuTop).as('menu');
      });
    });

    it('renders routes item as disabled', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.routes'))
        .should('have.class', 'disabled');
    });
  });

  context('menu top - entry and results enabled', () => {
    beforeEach(() => {
      const urlAdmin = getApiBaseUrlWithLang(
        null,
        rtwbbOldFrontendDjangoAdminUrl,
        defaultLocale,
        i18n,
      );
      cy.wrap(
        getMenuTop({
          isUserOrganizationAdmin: false,
          isUserStaff: true,
          urlAdmin,
          isEntryEnabled: true,
          isResultsEnabled: true,
        }),
      ).then((menuTop) => {
        cy.mount(DrawerMenu, {
          props: {
            items: menuTop,
          },
        });
        cy.wrap(menuTop).as('menu');
      });
    });

    it('renders routes item as enabled', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.routes'))
        .should('not.have.class', 'disabled');
    });

    it('renders results item as enabled', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.results'))
        .should('not.have.class', 'disabled');
    });
  });

  context('menu top - results disabled', () => {
    beforeEach(() => {
      cy.wrap(
        getMenuTop({
          isUserOrganizationAdmin: false,
          isUserStaff: true,
          urlAdmin: rtwbbOldFrontendDjangoAdminUrl,
          isEntryEnabled: true,
          isResultsEnabled: false,
        }),
      ).then((menuTop) => {
        cy.mount(DrawerMenu, {
          props: {
            items: menuTop,
          },
        });
        cy.wrap(menuTop).as('menu');
      });
    });

    it('renders results item as disabled', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.results'))
        .should('have.class', 'disabled');
    });
  });

  context('menu bottom', () => {
    beforeEach(() => {
      const urlDonate = getApiBaseUrlWithLang(
        null,
        rideToWorkByBikeConfig.urlDonate,
        defaultLocale,
        i18n,
      );
      const menuBottom = getMenuBottom(urlDonate);
      cy.mount(DrawerMenu, {
        props: {
          items: menuBottom,
        },
      });
      cy.wrap(menuBottom).as('menu');
    });

    coreTests();

    it('renders donate item with correct href - default lang', () => {
      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.donate'))
        .should(
          'have.attr',
          'href',
          getApiBaseUrlWithLang(
            null,
            rideToWorkByBikeConfig.urlDonate,
            defaultLocale,
            i18n,
          ),
        )
        .should('have.attr', 'target', '_blank')
        .invoke('attr', 'href')
        .then((href) => {
          cy.request({
            url: href,
            failOnStatusCode: failOnStatusCode,
            headers: { ...userAgentHeader },
          }).then((resp) => {
            if (resp.status === httpTooManyRequestsStatus) {
              cy.log(httpTooManyRequestsStatusMessage);
              return;
            }
            expect(resp.status).to.eq(httpSuccessfullStatus);
          });
        });
    });
  });

  context('menu bottom - change lang to en lang', () => {
    beforeEach(() => {
      const enLangCode = 'en';
      i18n.global.locale = enLangCode;

      const urlDonate = getApiBaseUrlWithLang(
        null,
        rideToWorkByBikeConfig.urlDonate,
        defaultLocale,
        i18n,
      );
      const menuBottom = getMenuBottom(urlDonate);
      cy.mount(DrawerMenu, {
        props: {
          items: menuBottom,
        },
      });
      cy.wrap(menuBottom).as('menu');
    });
    it('renders donate item with correct href - en lang (localized URL link)', () => {
      const enLangCode = 'en';

      cy.dataCy(selectorDrawerMenuItem)
        .contains(i18n.global.t('drawerMenu.donate'))
        .should(
          'have.attr',
          'href',
          getApiBaseUrlWithLang(
            null,
            rideToWorkByBikeConfig.urlDonate,
            defaultLocale,
            i18n,
          ),
        )
        .should('have.attr', 'target', '_blank')
        .invoke('attr', 'href')
        .then((href) => {
          if (i18n.lang === enLangCode) href.includes(enLangCode);
          cy.request({
            url: href,
            failOnStatusCode: failOnStatusCode,
            headers: { ...userAgentHeader },
          }).then((resp) => {
            if (resp.status === httpTooManyRequestsStatus) {
              cy.log(httpTooManyRequestsStatusMessage);
              return;
            }
            expect(resp.status).to.eq(httpSuccessfullStatus);
          });
        });
    });
  });

  function coreTests() {
    it('should render the list with the correct number of items', () => {
      cy.window().then(() => {
        cy.get('@menu').then((menu) => {
          cy.dataCy(selectorDrawerMenuItem).should('have.length', menu.length);
        });
      });
    });

    it('renders items with correct styling', () => {
      cy.window().then(() => {
        cy.get('@menu').then((menu) => {
          // skip test if menu is empty
          if (menu.length === 0) {
            return;
          }
          cy.dataCy(selectorDrawerMenuItem).each(($item, index) => {
            // test if current route
            if ($item.hasClass('menu-active-item')) {
              // active item
              cy.wrap($item)
                .should('have.color', white)
                .and('have.css', 'font-size', fontSize)
                .and('have.css', 'font-weight', '700')
                .and(
                  'contain',
                  i18n.global.t(`drawerMenu.${menu[index].title}`),
                )
                .within(() => {
                  cy.dataCy(selectorDrawerMenuItemIcon).should(
                    'have.color',
                    white,
                  );
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('width')
                    .should('be.eq', iconSize);
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('height')
                    .should('be.eq', iconSize);
                });
            } else {
              // inactive item
              cy.wrap($item)
                .should('have.color', white)
                .and('have.css', 'font-size', fontSize)
                .and('have.css', 'font-weight', '400')
                .and(
                  'contain',
                  i18n.global.t(`drawerMenu.${menu[index].title}`),
                )
                .within(() => {
                  cy.dataCy(selectorDrawerMenuItemIcon).should(
                    'have.color',
                    grey4,
                  );
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('width')
                    .should('be.eq', iconSize);
                  cy.dataCy(selectorDrawerMenuItemIcon)
                    .invoke('height')
                    .should('be.eq', iconSize);
                });
            }
          });
        });
      });
    });
  }
});
