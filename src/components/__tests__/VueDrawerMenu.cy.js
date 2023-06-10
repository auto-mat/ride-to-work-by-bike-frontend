import VueDrawerMenu from '../VueDrawerMenu.vue';
import { i18n } from '../../boot/i18n';

const menuItems = [
  { icon: 'home', name: 'home' },
  { icon: 'route', name: 'routes' },
  { icon: 'emoji_events', name: 'results' },
  { icon: 'people', name: 'community' },
  { icon: 'verified', name: 'discounts' },
  { icon: 'business', name: 'coordinator' },
  { icon: 'account_circle', name: 'profile' },
  {
    icon: 'email',
    name: 'inviteFriends',
  },
  {
    icon: 'volunteer_activism',
    name: 'donate',
  },
];

describe('VueDrawerMenu', () => {
  beforeEach(() => {
    cy.mount(VueDrawerMenu, {});
  });

  it('has translation for all strings', () => {
    const translationKeyList = menuItems.map((item) => `drawerMenu.${ item.name }`);

    translationKeyList.forEach((translationKey) => {
      const defaultEnglishString = i18n.global.t(translationKey, 'en');

      const locales = i18n.global.availableLocales;
      locales.filter((locale) => locale !== 'en').forEach((locale) => {
        i18n.global.locale = locale;
        const translatedString = i18n.global.t(translationKey);

        cy.wrap(translatedString)
          .should('be.a', 'string')
          .and('not.equal', defaultEnglishString);
      })
    })
  })

  it('should render the list with the correct number of items', () => {
    cy.window().then(() => {
      cy.get('.q-item').should('have.length', 9);
    });
  });

  it('should render each item with the expected icon and text content', () => {

    cy.window().then(() => {
      menuItems.forEach((item, index) => {
        cy.get('.q-item')
          .eq(index)
          .within(() => {
            cy.get('.q-icon')
              .should('be.visible')
              .should('contain.text', item.icon);
          });
      });
    });
  });
});
