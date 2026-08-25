import { routesConf } from '../../../src/router/routes_conf';
import {
  systemTimeChallengeActive,
  httpSuccessfullStatus,
} from '../support/commonTests';

describe('Impersonation', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeActive, ['Date']);
      cy.viewport('macbook-16');
    });

    it('processes impersonation tokens and displays banner', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.beginImpersonation(config);
        cy.get('@impersonationTokens').then(({ email }) => {
          cy.assertImpersonationBannerVisible(email);
        });
        // verify tokens are removed from URL
        cy.url().should('not.include', 'refreshToken');
        cy.url().should('not.include', 'accessToken');
        // verify we're on home page
        cy.url().should('include', routesConf['home']['path']);
      });
    });

    it('allows navigation during impersonation', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.beginImpersonation(config);
        cy.get('@impersonationTokens').then(({ email }) => {
          cy.assertImpersonationBannerVisible(email);
          // navigate to another page
          cy.visit('#' + routesConf['prizes']['path']);
          // verify banner is still visible
          cy.assertImpersonationBannerVisible(email);
        });
      });
    });

    it('exits impersonation by clicking exit button', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.beginImpersonation(config);
        cy.get('@impersonationTokens').then(({ email }) => {
          cy.assertImpersonationBannerVisible(email);
        });
        // click exit button
        cy.dataCy('impersonation-exit-button').click();
        // verify banner is hidden after a short delay
        cy.dataCy('impersonation-banner').should('not.exist');
      });
    });

    it('triggers the correct API requests during redirectHomeAfterLogin', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.beginImpersonation(config);
        cy.get('@verifyEmailRequest')
          .its('response.statusCode')
          .should('eq', httpSuccessfullStatus);
        cy.get('@thisCampaignRequest')
          .its('response.statusCode')
          .should('eq', httpSuccessfullStatus);
        cy.get('@getRegisterChallenge')
          .its('response.statusCode')
          .should('eq', httpSuccessfullStatus);
        cy.get('@getIsUserOrganizationAdmin')
          .its('response.statusCode')
          .should('eq', httpSuccessfullStatus);
      });
    });

    it('blocks a second impersonation attempt while already impersonating', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.beginImpersonation(config);
        cy.get('@impersonationTokens').then((firstUserTokens) => {
          cy.assertImpersonationBannerVisible(firstUserTokens.email);
          // attempt a second impersonation while already impersonating
          cy.getImpersonationTokens({
            pk: 456,
            email: 'second-impersonated-user@example.com',
          });
          cy.get('@impersonationTokens').then((secondUserTokens) => {
            cy.startImpersonation(secondUserTokens);
          });
          // reload to apply tokens
          cy.reload();
          // verify error notification is shown
          cy.get('.q-notification').should('be.visible');
          cy.window().then((win) => {
            cy.get('.q-notification').should(
              'contain',
              win.i18n.global.t('impersonation.errorAlreadyImpersonating'),
            );
          });
          // verify the original impersonation session is unchanged
          cy.assertImpersonationBannerVisible(firstUserTokens.email);
          // verify the second attempt's tokens were stripped from the URL
          cy.url().should('not.include', 'refreshToken');
          cy.url().should('not.include', 'accessToken');
        });
      });
    });

    it('shows an error notification and logs the failure for an invalid token', () => {
      const invalidAccessToken = 'invalid-jwt-token';
      const invalidRefreshToken = 'invalid-refresh-token';

      cy.visit(
        '#' +
          routesConf['home']['path'] +
          `?refreshToken=${encodeURIComponent(invalidRefreshToken)}&accessToken=${encodeURIComponent(invalidAccessToken)}`,
        {
          onBeforeLoad(win) {
            // spy on console.error to verify `loginStore.$log?.error()`
            cy.spy(win.console, 'error').as('consoleError');
          },
        },
      );
      // verify error notification is shown
      cy.get('.q-notification').should('be.visible');
      cy.window().then((win) => {
        cy.get('.q-notification').should(
          'contain',
          win.i18n.global.t('impersonation.errorInvalidLink'),
        );
      });
      // verify the store logger
      cy.get('@consoleError').should((spy) => {
        const loggedInvalidToken = spy.getCalls().some((call) =>
          // at least one call gets the logged error
          call.args.some(
            (arg) =>
              typeof arg === 'string' &&
              arg.includes('Failed to process impersonation tokens'),
          ),
        );
        expect(loggedInvalidToken).to.be.true;
      });
      // verify banner is hidden
      cy.dataCy('impersonation-banner').should('not.exist');
      // verify tokens are not in URL
      cy.url().should('not.include', 'refreshToken');
      cy.url().should('not.include', 'accessToken');
    });

    it('persists impersonation across a page refresh', () => {
      cy.task('getAppConfig', process).then((config) => {
        cy.beginImpersonation(config);
        cy.get('@impersonationTokens').then(({ email }) => {
          cy.assertImpersonationBannerVisible(email);
          // refresh the page
          cy.reload();
          // verify impersonation banner and state survive the refresh
          cy.assertImpersonationBannerVisible(email);
          cy.url().should('include', routesConf['home']['path']);
          cy.url().should('not.include', 'refreshToken');
          cy.url().should('not.include', 'accessToken');
        });
      });
    });
  });
});
