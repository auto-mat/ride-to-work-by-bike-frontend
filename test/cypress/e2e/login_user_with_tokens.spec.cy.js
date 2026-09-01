import { routesConf } from '../../../src/router/routes_conf';

import { systemTimeChallengeActive } from '../support/commonTests';

const pk = 0;
const email = 'fake0@fake0.org';
const firstName = 'Login as';
const lastName = 'user 0';
const user = { pk, email, first_name: firstName, last_name: lastName };
const exp = Math.floor(Date.now() / 1000) + 60 * 60;

describe('Login user with tokens', () => {
  context('Register challenge page', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['login']['path']);
      cy.reload(true);
      cy.dataCy('form-email-input').should('be.visible');
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.viewport('macbook-16');
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');

        cy.interceptLoginUserWithTokensRegisterChallengeOrHomePage(
          config,
          'apiGetRegisterChallengeEmpty',
        );
      });
    });

    it('login user with token', () => {
      cy.createFakeJwtToken({
        user: user,
        exp,
      }).then((token) => {
        cy.visit(
          '#' +
            `?refreshToken=${encodeURIComponent(token)}&accessToken=${encodeURIComponent(token)}&showUserNotifyMessage=true`,
        );
        cy.waitInterceptLoginUserWithTokensRegisterChallengeOrHomePage();
        cy.reload();
        cy.checkLoggedUserNotifyMessage(user);
      });
    });
  });

  context('Home page', () => {
    beforeEach(() => {
      cy.visit('#' + routesConf['login']['path']);
      cy.reload(true);
      cy.dataCy('form-email-input').should('be.visible');
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.viewport('macbook-16');
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          cy.wrap(win.i18n).as('i18n');
        });
        cy.interceptLoginUserWithTokensRegisterChallengeOrHomePage(
          config,
          'apiGetRegisterChallengeIndividualPaidComplete',
        );
      });
    });

    it('login user with token', () => {
      cy.createFakeJwtToken({
        user: user,
        exp,
      }).then((token) => {
        cy.visit(
          '#' +
            `?refreshToken=${encodeURIComponent(token)}&accessToken=${encodeURIComponent(token)}&showUserNotifyMessage=true`,
        );
        cy.waitInterceptLoginUserWithTokensRegisterChallengeOrHomePage();
        cy.reload();
        cy.checkLoggedUserNotifyMessage(user);
        cy.dataCy('profile-name').then(($el) => {
          expect($el.text()).to.contain(`${user.first_name} ${user.last_name}`);
        });
        cy.dataCy('profile-email').then(($el) => {
          expect($el.text()).to.contain(user.email);
        });
      });
    });

    it('restore logged user', () => {
      // Login user 0
      cy.createFakeJwtToken({
        user: user,
        exp,
      }).then((token) => {
        cy.visit(
          '#' +
            `?refreshToken=${encodeURIComponent(token)}&accessToken=${encodeURIComponent(token)}&showUserNotifyMessage=true&restoreLoggedUser=true`,
        );
        cy.waitInterceptLoginUserWithTokensRegisterChallengeOrHomePage();
        cy.reload();
        cy.checkLoggedUserNotifyMessage(user);
        cy.dataCy('profile-name').then(($el) => {
          expect($el.text()).to.contain(`${user.first_name} ${user.last_name}`);
        });
        cy.dataCy('profile-email').then(($el) => {
          expect($el.text()).to.contain(user.email);
        });

        // Login user 1
        const pk = 1;
        const email = 'fake1@fake1.org';
        const firstName = 'Login as';
        const lastName = 'user 1';
        const newUser = {
          pk,
          email,
          first_name: firstName,
          last_name: lastName,
        };
        cy.createFakeJwtToken({
          user: newUser,
          exp,
        }).then((token) => {
          cy.visit(
            '#' +
              `?refreshToken=${encodeURIComponent(token)}&accessToken=${encodeURIComponent(token)}&showUserNotifyMessage=true&restoreLoggedUser=true`,
          );
          cy.checkLoggedUserNotifyMessage(newUser);
          cy.dataCy('profile-name').then(($el) => {
            expect($el.text()).to.contain(
              `${newUser.first_name} ${newUser.last_name}`,
            );
          });
          cy.dataCy('profile-email').then(($el) => {
            expect($el.text()).to.contain(newUser.email);
          });

          // Logout user 1
          cy.get('@i18n').then((i18n) => {
            cy.dataCy('drawer-menu-item')
              .contains(i18n.global.t('drawerMenu.logout'))
              .click();
          });
          cy.reload();

          // Notify message of logged user 0 does not exists
          cy.get('[role="showUserNotifyMessage"]').should('not.exists');

          // Check it if user 0 is logged
          cy.dataCy('profile-name').then(($el) => {
            expect($el.text()).to.contain(
              `${user.first_name} ${user.last_name}`,
            );
          });
          cy.dataCy('profile-email').then(($el) => {
            expect($el.text()).to.contain(user.email);
          });
          // Logout user 0
          cy.get('@i18n').then((i18n) => {
            cy.dataCy('drawer-menu-item')
              .contains(i18n.global.t('drawerMenu.logout'))
              .click();
          });
          cy.dataCy('form-login-submit-login').should('be.visible');
        });
      });
    });
  });
});
