import AutomatLogo from 'components/global/AutomatLogo.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { defaultLocale } from 'src/i18n/def_locale';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';

import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';

// colors
// selectors
const selectorAutomatLogoButton = 'automat-logo-button';
const selectorAutomatLogoImage = 'automat-logo-image';

// variables
const logoHeight = 28;

describe('<AutomatLogo>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(AutomatLogo);
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(AutomatLogo);
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorAutomatLogoButton).should('be.visible');
    cy.dataCy(selectorAutomatLogoImage).should('be.visible');
  });

  it('has correct link to AutoMat website - default lang', () => {
    cy.dataCy(selectorAutomatLogoButton)
      .should(
        'have.attr',
        'href',
        getApiBaseUrlWithLang(
          null,
          rideToWorkByBikeConfig.urlAutoMat,
          defaultLocale,
          i18n,
        ),
      )
      .and('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .then((href) => {
        // test link
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

  it('has correct link to AutoMat website - en lang (localized URL link)', () => {
    const enLangCode = 'en';
    const defLocale = i18n.global.locale;
    i18n.global.locale = enLangCode;

    cy.dataCy(selectorAutomatLogoButton)
      .should(
        'have.attr',
        'href',
        getApiBaseUrlWithLang(
          null,
          rideToWorkByBikeConfig.urlAutoMat,
          defaultLocale,
          i18n,
        ),
      )
      .and('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .then((href) => {
        if (i18n.lang === enLangCode) href.includes(enLangCode);
        // test link
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
        i18n.global.locale = defLocale;
      });
  });

  it('renders logo with correct attributes', () => {
    cy.dataCy(selectorAutomatLogoImage)
      .find('img')
      .should('have.attr', 'src')
      .and('include', 'logo-automat.svg');

    cy.dataCy(selectorAutomatLogoImage)
      .find('img')
      .should('have.attr', 'alt')
      .and('equal', i18n.global.t('index.logoAutomatAltText'));
  });

  it('has correct styling', () => {
    cy.dataCy(selectorAutomatLogoButton).and(
      'have.css',
      'text-transform',
      'none',
    );

    cy.dataCy(selectorAutomatLogoImage)
      .invoke('height')
      .should('equal', logoHeight);
  });
}
