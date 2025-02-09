import { colors } from 'quasar';
import ListCardPost from '../homepage/ListCardPost.vue';
import { hexToRgb } from '../../../test/cypress/utils';
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

// variables
const title = i18n.global.t('index.cardListPost.title');

const { getPaletteColor } = colors;
const gray10 = getPaletteColor('grey-10');

describe('<ListCardPost>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'button'],
      'index.cardListPost',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listCardsPost').then((cards) => {
        cy.mount(ListCardPost, {
          props: {
            title,
            cards: cards.slice(0, 5),
          },
        });
      });

      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders swiper navigation buttons', () => {
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-prev')
        .should('be.visible')
        .and('have.css', 'width', '38px')
        .and('have.css', 'height', '38px')
        .and('have.css', 'border', `1px solid ${hexToRgb(gray10)}`);
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-next')
        .should('be.visible')
        .and('have.css', 'width', '38px')
        .and('have.css', 'height', '38px')
        .and('have.css', 'border', `1px solid ${hexToRgb(gray10)}`);
    });

    it('changes button disabled state after navigation', () => {
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-prev')
        .should('have.css', 'opacity', '0.35');
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-next')
        .should('have.css', 'opacity', '1');
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-next')
        .click();
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-prev')
        .should('have.css', 'opacity', '1');
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-next')
        .should('have.css', 'opacity', '0.35');
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-prev')
        .click();
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-prev')
        .should('have.css', 'opacity', '0.35');
      cy.dataCy('swiper-container')
        .shadow()
        .find('.swiper-button-next')
        .should('have.css', 'opacity', '1');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listCardsPost').then((cards) => {
        cy.mount(ListCardPost, {
          props: {
            title,
            cards: cards.slice(0, 5),
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders full width button container', () => {
      cy.dataCy('card-list-post-buttons').should('be.visible');
      cy.testElementPercentageWidth(cy.dataCy('card-list-post-buttons'), 100);
    });

    it('renders full width button', () => {
      cy.dataCy('card-list-post-button')
        .should('be.visible')
        .and('have.css', 'border-color', hexToRgb(gray10))
        .and('have.css', 'border-radius', '28px')
        .and('contain', i18n.global.t('index.cardListPost.button'));
      cy.testElementPercentageWidth(cy.dataCy('card-list-post-button'), 100);
    });
  });
});

function coreTests() {
  it('renders title', () => {
    cy.dataCy('section-heading-title')
      .should('contain', title)
      .then(($title) => {
        expect($title.text()).to.equal(title);
      });
  });

  it('renders correct number of items', () => {
    cy.dataCy('card-list-post-item').should('have.length', 5);
  });

  it('renders button container', () => {
    cy.dataCy('card-list-post-buttons')
      .should('be.visible')
      .and('have.css', 'text-align', 'center');
  });

  it('renders button - default lang', () => {
    cy.dataCy('card-list-post-button')
      .should('be.visible')
      .and('have.css', 'border-color', hexToRgb(gray10))
      .and('have.css', 'border-radius', '28px')
      .and('contain', i18n.global.t('index.cardListPost.button'))
      .and('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .should(
        'equal',
        getApiBaseUrlWithLang(
          null,
          rideToWorkByBikeConfig.urlBlog,
          defaultLocale,
          i18n,
        ),
      )
      .then((href) => {
        cy.request({
          url: href,
          failOnStatusCode: failOnStatusCode,
          headers: { ...userAgentHeader },
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

  it('renders button - en lang (localized URL link)', () => {
    const enLangCode = 'en';
    const defLocale = i18n.global.locale;
    i18n.global.locale = enLangCode;

    cy.dataCy('card-list-post-button')
      .should('be.visible')
      .and('have.css', 'border-color', hexToRgb(gray10))
      .and('have.css', 'border-radius', '28px')
      .and('contain', i18n.global.t('index.cardListPost.button'))
      .and('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .should(
        'equal',
        getApiBaseUrlWithLang(
          null,
          rideToWorkByBikeConfig.urlBlog,
          defaultLocale,
          i18n,
        ),
      )
      .then((href) => {
        if (i18n.lang === enLangCode) href.includes(enLangCode);
        cy.request({
          url: href,
          failOnStatusCode: failOnStatusCode,
          headers: { ...userAgentHeader },
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
}
