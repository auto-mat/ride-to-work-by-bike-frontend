/* eslint-disable @typescript-eslint/no-unused-vars */
import { nextTick } from 'vue';
import { colors } from 'quasar';
import { i18n } from '../../boot/i18n';
import MenuLinks from '../global/MenuLinks.vue';
import { useSocialLinks } from '../../composables/useSocialLinks';
import { useUsefulLinks } from '../../composables/useUsefulLinks';
import { defaultLocale } from 'src/i18n/def_locale';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';
import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// colors
const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const blueGrey1 = getPaletteColor('blue-grey-1');

describe('<MenuLinks>', () => {
  context('social', () => {
    const title = 'Find us on social media';

    beforeEach(() => {
      cy.mount(MenuLinks, {
        props: {
          title,
          variant: 'social',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title with correct styling', () => {
      cy.dataCy('title-menu-links')
        .should('be.visible')
        .and('contain', title)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700');
    });

    it('renders buttons in a grid', () => {
      cy.dataCy('menu-links-list')
        .should('be.visible')
        .and('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap')
        .and('have.css', 'column-gap', '24px');
    });

    it('renders social buttons with correct styling (social links variant)', () => {
      cy.dataCy('button-menu-links')
        .and('have.backgroundColor', blueGrey1)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', black);
        });
    });

    it('provides valid URLs for buttons (social links variant)', () => {
      const { socialLinks } = useSocialLinks();
      cy.dataCy('button-menu-links')
        .should('have.length', socialLinks.length)
        .each(($el, index) => {
          cy.wrap($el)
            .should('have.attr', 'href', socialLinks[index].url)
            .and('have.attr', 'target', '_blank')
            .and('have.attr', 'title', socialLinks[index].title)
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
  });

  context('useful', () => {
    const title = 'Useful links';
    beforeEach(() => {
      cy.mount(MenuLinks, {
        props: {
          title,
          variant: 'useful',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders link buttons with correct styling (useful links variant)', () => {
      cy.dataCy('button-menu-links')
        .and('have.backgroundColor', blueGrey1)
        .and('have.css', 'border-radius', '28px')
        .and('have.css', 'margin-top', '16px')
        .find('.q-btn__content span')
        .then(($el) => {
          cy.wrap($el).should('have.color', black);
        });
    });

    it('provides valid URLs for buttons (useful links variant) - default lang', () => {
      const { usefulLinks } = useUsefulLinks();

      cy.wrap(nextTick()).then(() => {
        cy.dataCy('button-menu-links')
          .and('have.length', usefulLinks.length)
          .each(($el, index) => {
            cy.wrap($el)
              .should(
                'have.attr',
                'href',
                usefulLinks[index].url === rideToWorkByBikeConfig.urlAutoMat
                  ? getApiBaseUrlWithLang(
                      null,
                      usefulLinks[index].url,
                      defaultLocale,
                      i18n,
                    )
                  : usefulLinks[index].url,
              )
              .and('have.attr', 'target', '_blank')
              .and('contain', usefulLinks[index].title)
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
    });

    it('provides valid URLs for buttons (useful links variant) - en lang (localized URL link)', () => {
      const enLangCode = 'en';
      const defLocale = i18n.global.locale;
      i18n.global.locale = enLangCode;
      const { usefulLinks } = useUsefulLinks();

      cy.wrap(nextTick())
        .then(() => {
          cy.dataCy('button-menu-links')
            .and('have.length', usefulLinks.length)
            .each(($el, index) => {
              cy.wrap($el)
                .should(
                  'have.attr',
                  'href',
                  usefulLinks[index].url === rideToWorkByBikeConfig.urlAutoMat
                    ? getApiBaseUrlWithLang(
                        null,
                        usefulLinks[index].url,
                        defaultLocale,
                        i18n,
                      )
                    : usefulLinks[index].url,
                )
                .and('have.attr', 'target', '_blank')
                .and('have.attr', 'title', usefulLinks[index].title)
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
        })
        .then(() => {
          i18n.global.locale = defLocale;
        });
    });
  });

  // TODO: Check for icons
});
