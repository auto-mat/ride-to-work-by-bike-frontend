import { createPinia, setActivePinia } from 'pinia';
import UserSelect from '../global/UserSelect.vue';
import { i18n } from '../../boot/i18n';
import { emptyUser, useLoginStore } from '../../stores/login';
import { fixtureTokenExpirationTime } from '../../../test/cypress/support/commonTests';

// selectors
const selectorUserSelectInput = 'user-select-input';
const selectorAvatar = 'avatar';
const selectorAvatarImage = 'avatar-image';
const selectorMenuItem = 'menu-item';

// variables
const avatarSizeLg = 40;
const avatarSizeSm = 32;
const menuItemCount = 2;

describe('<UserSelect>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(UserSelect, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('shows user email', () => {
      cy.fixture('loggedUser').then((user) => {
        const loginStore = useLoginStore();
        loginStore.setUser(user);
        cy.dataCy(selectorUserSelectInput).should('contain', user.email);
      });
    });

    it('renders avatar with correct size', () => {
      cy.dataCy(selectorAvatar).invoke('height').should('equal', avatarSizeLg);
      cy.dataCy(selectorAvatar).invoke('width').should('equal', avatarSizeLg);
      cy.dataCy(selectorAvatarImage)
        .invoke('width')
        .should('equal', avatarSizeLg);
      cy.dataCy(selectorAvatarImage)
        .invoke('height')
        .should('equal', avatarSizeLg);
    });

    it('allows to logout', () => {
      cy.fixture('loginRegisterResponseChallengeActive.json').then(
        (loginResponse) => {
          cy.fixture('loggedUser').then((user) => {
            const loginStore = useLoginStore();
            loginStore.setAccessToken(loginResponse.access);
            loginStore.setRefreshToken(loginResponse.refresh);
            loginStore.setUser(user);
            loginStore.setJwtExpiration(fixtureTokenExpirationTime);
            cy.wrap(loginStore.getAccessToken).should(
              'equal',
              loginResponse.access,
            );
            cy.wrap(loginStore.getRefreshToken).should(
              'equal',
              loginResponse.refresh,
            );
            cy.wrap(loginStore.getUser).should('deep.equal', user);
            cy.wrap(loginStore.getJwtExpiration).should(
              'equal',
              fixtureTokenExpirationTime,
            );
            // click on logout button
            cy.dataCy('user-select-input').click();
            cy.dataCy('menu-item')
              .contains(i18n.global.t('userSelect.logout'))
              .click();
            cy.wrap(() => {
              // prevent race condition between modifying and accessing store
              return new Cypress.Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 500);
              });
            }).then(() => {
              // check if we are logged out
              cy.wrap(loginStore.getAccessToken).should('be.empty');
              cy.wrap(loginStore.getRefreshToken).should('be.empty');
              cy.wrap(loginStore.getUser).should('deep.equal', emptyUser);
              cy.wrap(loginStore.getJwtExpiration).should('be.null');
            });
          });
        },
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(UserSelect, {
        props: {
          variant: 'mobile',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders avatar with correct size', () => {
      cy.dataCy(selectorAvatar).invoke('width').should('equal', avatarSizeSm);
      cy.dataCy(selectorAvatar).invoke('height').should('equal', avatarSizeSm);
      cy.dataCy(selectorAvatarImage)
        .invoke('width')
        .should('equal', avatarSizeSm);
      cy.dataCy(selectorAvatarImage)
        .invoke('height')
        .should('equal', avatarSizeSm);
    });
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorUserSelectInput).should('be.visible');
    });

    it('renders rounded avatar with alt text', () => {
      cy.fixture('loggedUser').then((user) => {
        const loginStore = useLoginStore();
        loginStore.setUser(user);
        expect(loginStore.getUser).to.deep.equal(user);
        // avatar
        cy.dataCy(selectorAvatar)
          .should('be.visible')
          .and('have.css', 'border-radius', '50%');
        // image
        cy.dataCy(selectorAvatarImage)
          .should('be.visible')
          .and(
            'have.attr',
            'aria-label',
            `${user.first_name} ${user.last_name}`,
          );
        // test src
        cy.dataCy(selectorAvatarImage)
          .find('img')
          .invoke('attr', 'src')
          .should('contain', 'profile-placeholder');
        // test alt text
        cy.dataCy(selectorAvatarImage)
          .find('img')
          .invoke('attr', 'alt')
          .should('eq', `${user.first_name} ${user.last_name}`);
      });
    });

    it('shows dropdown on click', () => {
      cy.dataCy(selectorUserSelectInput).click();
      cy.dataCy(selectorMenuItem)
        .should('be.visible')
        .and('have.length', menuItemCount);
    });
  }
});
