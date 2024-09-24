import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { emptyUser, useLoginStore } from 'src/stores/login';
import FormLogin from '../login/FormLogin.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { routesConf } from '../../router/routes_conf';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

const colorPrimary = rideToWorkByBikeConfig.colorPrimary;
const contactEmail = rideToWorkByBikeConfig.contactEmail;

// selectors
const classSelectorQNotificationMessage = '.q-notification__message';

// variables
const email = 'test@example.com';
const password = 'example123';
const token = '1234567890';
const apiBase = rideToWorkByBikeConfig.apiBase;
const apiLoginUrl = `${apiBase}${routesConf.api_login.path}`;

describe('<FormLogin>', () => {
  it('has translation for all strings', () => {
    // Not testing form labels since they are the same in all languages
    cy.testLanguageStringsInContext(
      [
        'titleLogin',
        'titlePasswordReset',
        'descriptionPasswordReset',
        'messageEmailReqired',
        'messageEmailInvalid',
        'messagePasswordRequired',
        'messagePasswordResetReqired',
        'forgottenPassword',
        'submitLogin',
        'submitPasswordReset',
      ],
      'login.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.dataCy('form-title-login')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('login.form.titleLogin'));
    });

    it('renders email field', () => {
      cy.dataCy('form-login-email').should('be.visible');
      cy.dataCy('form-login-email')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password field', () => {
      cy.dataCy('form-login-password')
        .should('be.visible')
        .find('label[for="form-login-password"]')
        .should('be.visible')
        .and('have.text', i18n.global.t('login.form.labelPassword'));
      cy.dataCy('form-login-password')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
    });

    it('renders password show/hide icon', () => {
      cy.dataCy('form-login-password-icon')
        .should('contain', 'visibility')
        .and('have.color', `${colorPrimary}`);
      cy.dataCy('form-login-password-icon')
        .invoke('height')
        .should('be.equal', 18);
      cy.dataCy('form-login-password-icon')
        .invoke('width')
        .should('be.equal', 18);
    });

    it('should allow user to reveal and hide password', () => {
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'password');
      cy.dataCy('form-login-password-icon').click();
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'text');
      cy.dataCy('form-login-password-icon').click();
      cy.dataCy('form-login-password')
        .find('input')
        .should('have.attr', 'type', 'password');
    });

    it('renders forgotten password link', () => {
      cy.dataCy('form-login-forgotten-password')
        .should('be.visible')
        .and('have.color', `${colorPrimary}`)
        .and('have.css', 'text-decoration-line', 'underline')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.text', i18n.global.t('login.form.forgottenPassword'));
    });

    it('renders a submit button', () => {
      cy.dataCy('form-login-submit-login')
        .should('be.visible')
        .and('have.color', white)
        .and('have.backgroundColor', `${colorPrimary}`)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitLogin'));
    });

    it('allows to navigate between states', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-button-back').should('be.visible').click();
      cy.dataCy('form-login').should('be.visible');
    });

    it('renders password reset form title', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-title')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('login.form.titlePasswordReset'));
    });

    it('renders password reset form description', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-description')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('login.form.descriptionPasswordReset'));
    });

    it('renders password reset form email input', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
    });

    it('renders password reset form submit button', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset').should('be.visible');
      cy.dataCy('form-password-reset-submit')
        .should('be.visible')
        .and('have.color', white)
        .and('have.backgroundColor', `${colorPrimary}`)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitPasswordReset'));
    });

    it('renders final screen on password reset', () => {
      cy.dataCy('form-login-forgotten-password').should('be.visible').click();
      cy.dataCy('form-password-reset-email')
        .find('input')
        .should('be.visible')
        .type('qw123@qw.com');
      cy.dataCy('form-password-reset-submit').should('be.visible').click();
      cy.dataCy('form-reset-finished').should('be.visible');
      // icon wrapper
      cy.dataCy('form-reset-finished-icon-wrapper')
        .should('be.visible')
        .and('have.backgroundColor', 'rgba(255, 255, 255, 0.5)')
        .and('have.css', 'border-radius', '9999px');
      // icon
      cy.dataCy('form-reset-finished-icon')
        .invoke('height')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon')
        .invoke('width')
        .should('be.equal', 40);
      cy.dataCy('form-reset-finished-icon').should('have.color', colorPrimary);
      // title
      cy.dataCy('form-reset-finished-title')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.css', 'margin-top', '24px')
        .and('contain', i18n.global.t('login.form.titleResetFinished'));
      // description
      cy.dataCy('form-reset-finished-description')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and(
          'contain',
          i18n.global.t('login.form.descriptionResetFinished', {
            contactEmail,
          }),
        );
      // prompt
      cy.dataCy('form-reset-finished-prompt')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and('contain', i18n.global.t('login.form.promptWrongEmail'));
      // button
      cy.dataCy('form-reset-finished-submit')
        .should('be.visible')
        .and('have.color', colorPrimary)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'text-transform', 'uppercase')
        .and('have.text', i18n.global.t('login.form.submitNewPassword'));
    });

    it('validates login form user inputs', () => {
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      // validate password required
      // first make email pass
      cy.dataCy('form-login-email').find('input').type('test@example.com');
      cy.dataCy('form-login-submit-login').should('be.visible').click();
      cy.dataCy('form-login-password')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('login.form.messagePasswordRequired'));
    });
  });

  context('desktop - login store', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormLogin, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('uses the login store', () => {
      const loginStore = useLoginStore();
      // initial state
      expect(loginStore.user.email).to.equal(emptyUser.email);
      expect(loginStore.user.password).to.equal(emptyUser.password);
      // type email
      cy.dataCy('form-login-email').find('input').clear();
      cy.dataCy('form-login-email').find('input').type(email);
      // check email in store
      cy.dataCy('form-login-email').then(() => {
        expect(loginStore.user.email).to.equal(email);
      });
      // type password
      cy.dataCy('form-login-password').find('input').clear();
      cy.dataCy('form-login-password').find('input').type(password);
      // check password in store
      cy.dataCy('form-login-password').then(() => {
        expect(loginStore.user.password).to.equal(password);
      });
    });

    it('saves user into store after login', () => {
      const store = useLoginStore();
      const user = { email, password };
      store.setUser(user);
      expect(store.getUser).to.deep.equal(user);
    });

    it('saves token into store after login', () => {
      const store = useLoginStore();
      store.setToken(token);
      expect(store.getToken).to.equal(token);
    });

    it('shows error if login is called and email is not set', () => {
      const store = useLoginStore();
      store.setUser({ email: '', password });
      cy.wrap(store.login()).then((result) => {
        expect(result).to.equal(null);
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.form.messageEmailReqired'));
      });
    });

    it('shows error if login is called and password is not set', () => {
      const store = useLoginStore();
      store.setUser({ email, password: '' });
      cy.wrap(store.login()).then((result) => {
        expect(result).to.equal(null);
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.form.messagePasswordRequired'));
      });
    });

    it('calls API and set token on successful login', () => {
      const store = useLoginStore();
      store.setUser({ email, password });
      // intercept login API call
      cy.intercept('POST', apiLoginUrl, {
        statusCode: 200,
        body: { key: token },
      });
      cy.wrap(store.login()).then((result) => {
        expect(result).to.deep.equal({ key: token });
        expect(store.getToken).to.equal(token);
      });
    });

    it('calls API and shows error if login fails', () => {
      const store = useLoginStore();
      store.setUser({ email, password });
      // intercept login API call
      cy.intercept('POST', apiLoginUrl, {
        statusCode: 500,
      });
      // call login with stubbed apiFetch
      cy.wrap(store.login()).then(() => {
        cy.get(classSelectorQNotificationMessage)
          .should('be.visible')
          .and('contain', i18n.global.t('login.apiMessageError'));
      });
    });
  });
});
