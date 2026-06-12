import { useLoginStore, emptyUser } from '../../stores/login';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';
import { httpSuccessfullStatus } from '../../../test/cypress/support/commonTests';
import UserSelect from '../global/UserSelect.vue';

const { apiBase, apiDefaultLang, urlApiLogout } = rideToWorkByBikeConfig;
const logoutSuccessDetail = 'Successfully logged out.';

describe('loginStore logout()', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage'],
      'logout',
      i18n,
    );
  });

  context('successful logout', () => {
    beforeEach(() => {
      cy.mount(UserSelect);
      const apiBaseUrl = getApiBaseUrlWithLang(
        null,
        apiBase,
        apiDefaultLang,
        i18n,
      );
      const apiLogoutUrl = `${apiBaseUrl}${urlApiLogout}`;
      // intercept logout API call
      cy.intercept('POST', apiLogoutUrl, {
        statusCode: httpSuccessfullStatus,
        body: { detail: logoutSuccessDetail },
      }).as('logoutRequest');
      // set up store with logged user
      cy.fixture('loginRegisterResponseChallengeActive.json').then(
        (loginResponse) => {
          cy.fixture('loggedUser').then((loggedUser) => {
            const loginStore = useLoginStore();
            loginStore.setAccessToken(loginResponse.access);
            loginStore.setRefreshToken(loginResponse.refresh);
            loginStore.setUser(loggedUser);
            // trigger logout
            cy.wrap(loginStore.logout());
          });
        },
      );
    });

    it('sends logout POST request', () => {
      cy.fixture('loginRegisterResponseChallengeActive.json').then(
        (loginResponse) => {
          cy.wait('@logoutRequest').then((interception) => {
            expect(interception.request.method).to.eq('POST');
            expect(interception.request.headers.authorization).to.include(
              loginResponse.access,
            );
          });
        },
      );
    });

    it('shows success message as notification', () => {
      cy.wait('@logoutRequest');
      cy.get('.q-notification__message').should('contain', logoutSuccessDetail);
    });

    it('clears local login state after API call', () => {
      cy.wait('@logoutRequest').then(() => {
        const loginStore = useLoginStore();
        cy.wrap(loginStore.getAccessToken).should('be.empty');
        cy.wrap(loginStore.getRefreshToken).should('be.empty');
        cy.wrap(loginStore.getUser).should('deep.equal', emptyUser);
      });
    });
  });
});
