import { computed } from 'vue';
import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import FormFieldListMerch from 'components/form/FormFieldListMerch.vue';
import { i18n } from '../../boot/i18n';
import { Gender } from 'components/types/Profile';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { defaultLocale } from 'src/i18n/def_locale';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';
import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';

const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');
const grey10 = getPaletteColor('grey-10');

const tshirt2024FemaleMId = 135;
const tshirt2024FemaleXsId = 133;

describe('<FormFieldListMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelNoMerch',
        'hintNoMerch',
        'hintPhoneNoMerch',
        'hintPhoneWithMerch',
        'labelPhoneOptInNoMerch',
        'labelPhoneOptInWithMerch',
        'labelUrlSizeConversionChartLink',
        'textMerchUnavailable',
      ],
      'form.merch',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [Gender.male, Gender.female, Gender.unisex],
      'global',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      // intercept API calls
      cy.interceptMerchandiseGetApi(rideToWorkByBikeConfig, i18n);

      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('macbook-16');

      // wait for API responses
      cy.waitForMerchandiseApi();
    });

    it('renders component', () => {
      cy.dataCy('no-merch-label')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey10);
      cy.dataCy('no-merch-hint')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey8);
      // component is visible
      cy.dataCy('list-merch').should('be.visible');
      // female cards are visible
      cy.dataCy('form-card-merch-female').should('be.visible');
      // tabs are visible
      cy.dataCy('list-merch-tab-female').should('be.visible');
      cy.dataCy('list-merch-tab-male').should('be.visible');
    });

    it('should render 3 cards in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        33,
      );
    });

    it('allows to select "I do not want merch" option and displays correct hints', () => {
      // select no merch
      cy.dataCy('no-merch').click();
      // merch options are hidden
      cy.dataCy('list-merch').should('not.be.visible');
      // phone number input is still visible
      cy.dataCy('form-merch-phone-input')
        .should('be.visible')
        .and('contain', i18n.global.t('form.merch.hintPhoneNoMerch'));
      // phone opt-in input is still visible
      cy.dataCy('form-merch-phone-opt-in-input').should('be.visible');
      cy.dataCy('phone-opt-in').should(
        'contain',
        i18n.global.t('form.merch.labelPhoneOptInNoMerch'),
      );
      // unselect no merch
      cy.dataCy('no-merch').click();
      // merch options are visible
      cy.dataCy('list-merch').should('be.visible');
      // phone number input is still visible
      cy.dataCy('form-merch-phone-input')
        .should('be.visible')
        .and('contain', i18n.global.t('form.merch.hintPhoneWithMerch'));
      // phone opt-in input is still visible
      cy.dataCy('form-merch-phone-opt-in-input').should('be.visible');
      cy.dataCy('phone-opt-in').should(
        'contain',
        i18n.global.t('form.merch.labelPhoneOptInWithMerch'),
      );
    });

    it('renders link to size converion chart image - default lang', () => {
      cy.dataCy('form-merch-size-conversion-chart-link')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.merch.labelUrlSizeConversionChartLink'),
        )
        .and(
          'have.attr',
          'href',
          getApiBaseUrlWithLang(
            null,
            rideToWorkByBikeConfig.urlSizeConversionChart,
            defaultLocale,
            i18n,
          ),
        )
        .and('have.attr', 'target', '_blank')
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
    it('renders link to size converion chart image - en lang (localized URL link)', () => {
      const enLangCode = 'en';
      const defLocale = i18n.global.locale;
      i18n.global.locale = enLangCode;

      cy.dataCy('form-merch-size-conversion-chart-link')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.merch.labelUrlSizeConversionChartLink'),
        )
        .and(
          'have.attr',
          'href',
          getApiBaseUrlWithLang(
            null,
            rideToWorkByBikeConfig.urlSizeConversionChart,
            defaultLocale,
            i18n,
          ),
        )
        .and('have.attr', 'target', '_blank')
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
            i18n.global.locale = defLocale;
          });
        });
    });
    it('allows to switch between tabs', () => {
      cy.dataCy('list-merch-tab-male').click();
      cy.dataCy('form-card-merch-female').should('not.exist');
      cy.dataCy('form-card-merch-male').should('be.visible');
      cy.dataCy('list-merch-tab-female').click();
      cy.dataCy('form-card-merch-female').should('be.visible');
      cy.dataCy('form-card-merch-male').should('not.exist');
    });

    it('allows user to select merch option (heading click)', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        const item = response.results[0];
        // open dialog and verify content
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="form-card-merch-link"]')
          .click();
        cy.dataCy('dialog-merch')
          .should('be.visible')
          .within(() => {
            cy.contains(item.name).should('be.visible');
            cy.contains(item.description).should('be.visible');
          });
        cy.dataCy('slider-merch').should('be.visible');
        // close dialog
        cy.dataCy('dialog-close').click();
        // first option is selected
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-selected"]')
          .should('be.visible');
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .should('not.exist');
      });
    });

    it('allows user to select merch option (button click)', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        const item = response.results[0];
        // open dialog
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .click();
        cy.dataCy('dialog-merch')
          .should('be.visible')
          .within(() => {
            cy.contains(item.name).should('be.visible');
            cy.contains(item.description).should('be.visible');
          });
        cy.dataCy('slider-merch').should('be.visible');
        // close dialog
        cy.dataCy('dialog-close').click();
        // first option is selected
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-selected"]')
          .should('be.visible');
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .should('not.exist');
      });
    });

    it('changes tabs when changing gender radio (in dialog)', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find(
          (item) => item.id === tshirt2024FemaleMId,
        );
        cy.listMerchSelectItem(item, { closeDialog: false });
        // change gender setting
        cy.dataCy('dialog-merch').within(() => {
          cy.dataCy('form-field-merch-gender')
            .contains(i18n.global.t('global.male'))
            .should('be.visible')
            .click();
        });
        // close dialog
        cy.dataCy('dialog-close').click();
        // we should see male options
        cy.dataCy('form-card-merch-male').should('be.visible');
        cy.dataCy('form-card-merch-female').should('not.exist');
        // same merch type selected
        cy.get('[data-selected="true"]').should('contain', item.name);
      });
    });

    it('when option with sizes is selected, shows size selection under the cards', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find(
          (item) => item.id === tshirt2024FemaleMId,
        );
        cy.listMerchSelectItem(item);
        // size selection is visible
        cy.dataCy('form-field-merch-size').should('be.visible');
        // select different size
        cy.dataCy('form-field-merch-size');
      });
    });

    it('when option is selected, disables the merch card interaction', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find(
          (item) => item.id === tshirt2024FemaleMId,
        );
        cy.listMerchSelectItem(item);
        // option is selected
        cy.get('[data-selected="true"]').should('contain', item.name);
        // if title is clicked dialog is not shown
        cy.get('[data-selected="true"]').contains(item.name).click();
        cy.dataCy('dialog-merch').should('not.exist');
        // button is disabled
        cy.get('[data-selected="true"]').find('button').should('be.disabled');
      });
    });

    it('when gender is changed and new product contains the same size, it is selected', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find(
          (item) => item.id === tshirt2024FemaleMId,
        );
        cy.listMerchSelectItem(item, { closeDialog: false });
        cy.dataCy('dialog-merch').within(() => {
          // change gender
          cy.dataCy('form-field-merch-gender')
            .contains(i18n.global.t('global.male'))
            .should('be.visible')
            .click();
          // same size is selected
          cy.dataCy('form-field-merch-size')
            .find('.q-radio__inner.q-radio__inner--truthy')
            .siblings('.q-radio__label')
            .should('contain', item.size);
        });
      });
    });

    it('when gender is changed via tabs, it does not open dialog', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size M)
        const item = response.results.find(
          (item) => item.id === tshirt2024FemaleMId,
        );
        cy.listMerchSelectItem(item);
        // change merch via tabs
        cy.dataCy('list-merch-tab-male').click();
        // male options are visible
        cy.dataCy('form-card-merch-male').should('be.visible');
        cy.dataCy('form-card-merch-female').should('not.exist');
        // dialog is not open
        cy.dataCy('dialog-merch').should('not.exist');
      });
    });

    it('when gender is changed to via tabs and size is not available, it selects first available size', () => {
      cy.fixture('apiGetMerchandiseResponse').then((response) => {
        // select our test item (Triko 2024, female, size XS)
        const item = response.results.find(
          (item) => item.id === tshirt2024FemaleXsId,
        );
        cy.listMerchSelectItem(item);
        // change merch via tabs
        cy.dataCy('list-merch-tab-male').click();
        // male options are visible
        cy.dataCy('form-card-merch-male').should('be.visible');
        cy.dataCy('form-card-merch-female').should('not.exist');
        // XS is not available in male options - first option is selected
        cy.dataCy('form-field-merch-size')
          .find('.q-radio__inner')
          .first()
          .should('have.class', 'q-radio__inner--truthy');
      });
    });

    it('updates phone number and phone opt-in in store when user enters values', () => {
      cy.fixture('apiPostRegisterChallengeMerchandiseRequest').then(
        (request) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            const telephone = computed(() => store.getTelephone);
            const telephoneOptIn = computed(() => store.getTelephoneOptIn);
            // default values
            cy.wrap(telephone).its('value').should('be.empty');
            cy.wrap(telephoneOptIn).its('value').should('be.false');
            // enter values
            cy.dataCy('form-merch-phone-input')
              .find('input')
              .type(request.telephone);
            cy.dataCy('form-merch-phone-opt-in-input')
              .should('be.visible')
              .click();
            // values are updated
            cy.wrap(telephone).its('value').should('eq', request.telephone);
            cy.wrap(telephoneOptIn).its('value').should('be.true');
          });
        },
      );
    });
  });

  context('desktop - merch is unavailable', () => {
    beforeEach(() => {
      cy.fixture('apiGetMerchandiseResponseUnavailable').then((response) => {
        cy.fixture('apiGetMerchandiseResponseUnavailableNext').then(
          (responseNext) => {
            cy.interceptMerchandiseGetApi(
              rideToWorkByBikeConfig,
              i18n,
              response,
              responseNext,
            );

            cy.mount(FormFieldListMerch, {
              props: {},
            });
            cy.viewport('macbook-16');

            // wait for API responses
            cy.waitForMerchandiseApi(response, responseNext);
          },
        );
      });
    });

    it('does not show merch options', () => {
      cy.dataCy('text-merch-unavailable')
        .should('be.visible')
        .and('contain', i18n.global.t('form.merch.textMerchUnavailable'));
      cy.dataCy('no-merch').should('be.visible');
      cy.dataCy('list-merch-tabs').should('not.be.visible');
      cy.dataCy('form-field-merch-size').should('not.exist');
      cy.dataCy('form-merch-size-conversion-chart-link').should('not.exist');
      cy.dataCy('form-merch-phone-input').should('be.visible');
      cy.dataCy('phone-opt-in').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      // intercept API calls
      cy.interceptMerchandiseGetApi(rideToWorkByBikeConfig, i18n);

      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('iphone-6');

      // wait for API responses
      cy.waitForMerchandiseApi();
    });

    it('should render 1 card in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        100,
      );
    });
  });
});
