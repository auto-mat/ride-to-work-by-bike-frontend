import { routesConf } from '../../../src/router/routes_conf';

import { systemTimeChallengeActive } from '../support/commonTests';

const pk = 1;
const email = 'fake@fake.org';
const firstName = 'Login as';
const lastName = 'user';
const user = { pk, email, first_name: firstName, last_name: lastName };
const exp = Math.floor(Date.now() / 1000) + 60 * 60;

describe('Login user with tokens', () => {
  context('Register challenge page', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.visit('#' + routesConf['login']['path']);
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
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.visit('#' + routesConf['login']['path']);
      cy.viewport('macbook-16');
      cy.task('getAppConfig', process).then((config) => {
        cy.window().should('have.property', 'i18n');
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
  });
});
