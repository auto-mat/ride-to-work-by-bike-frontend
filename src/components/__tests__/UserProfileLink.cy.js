import { createPinia, setActivePinia } from 'pinia';
import UserProfileLink from '../global/UserProfileLink.vue';
import { i18n } from '../../boot/i18n';
import { useLoginStore } from '../../stores/login';
import { routesConf } from '../../router/routes_conf';

// variables
const avatarSizeLg = 40;
const avatarSizeSm = 32;

describe('<UserProfileLink>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(UserProfileLink, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders avatar with correct size', () => {
      cy.dataCy('avatar').invoke('height').should('equal', avatarSizeLg);
      cy.dataCy('avatar').invoke('width').should('equal', avatarSizeLg);
      cy.dataCy('avatar-image').invoke('width').should('equal', avatarSizeLg);
      cy.dataCy('avatar-image').invoke('height').should('equal', avatarSizeLg);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(UserProfileLink, {
        props: {
          variant: 'mobile',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders avatar with correct size', () => {
      cy.dataCy('avatar').invoke('width').should('equal', avatarSizeSm);
      cy.dataCy('avatar').invoke('height').should('equal', avatarSizeSm);
      cy.dataCy('avatar-image').invoke('width').should('equal', avatarSizeSm);
      cy.dataCy('avatar-image').invoke('height').should('equal', avatarSizeSm);
    });
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy('user-profile-link').should('be.visible');
    });

    it('shows user name and email', () => {
      cy.fixture('loggedUser').then((user) => {
        const loginStore = useLoginStore();
        loginStore.setUser(user);
        const fullName = `${user.first_name} ${user.last_name}`;
        cy.dataCy('profile-name').should('be.visible').and('contain', fullName);
        cy.dataCy('profile-email')
          .should('be.visible')
          .and('contain', user.email);
      });
    });

    it('renders rounded avatar with alt text', () => {
      cy.fixture('loggedUser').then((user) => {
        const loginStore = useLoginStore();
        loginStore.setUser(user);
        expect(loginStore.getUser).to.deep.equal(user);
        // avatar
        cy.dataCy('avatar')
          .should('be.visible')
          .and('have.css', 'border-radius', '50%');
        // image
        cy.dataCy('avatar-image')
          .should('be.visible')
          .and(
            'have.attr',
            'aria-label',
            `${user.first_name} ${user.last_name}`,
          );
        // test src
        cy.dataCy('avatar-image')
          .find('img')
          .invoke('attr', 'src')
          .should('contain', 'profile-placeholder');
        // test alt text
        cy.dataCy('avatar-image')
          .find('img')
          .invoke('attr', 'alt')
          .should('eq', `${user.first_name} ${user.last_name}`);
      });
    });

    it('navigates to profile details on click', () => {
      cy.dataCy('user-profile-link')
        .should('have.attr', 'href')
        .and('include', routesConf['profile_details']['children']['fullPath']);
    });
  }
});
