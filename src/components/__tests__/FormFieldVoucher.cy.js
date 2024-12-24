import { setActivePinia, createPinia } from 'pinia';
import { colors } from 'quasar';
import FormFieldVoucher from 'components/form/FormFieldVoucher.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { couponAdapter } from '../../adapters/couponAdapter';
import { useFormatPrice, Currency } from 'src/composables/useFormatPrice';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// colors
const { getPaletteColor } = colors;
const grey2 = getPaletteColor('grey-2');

// selectors
const selectorFormFieldVoucher = 'form-field-voucher';
const selecotrFormFieldVoucherInput = 'form-field-voucher-input';
const selectorFormFieldVoucherSubmit = 'form-field-voucher-submit';
const selectorVoucherBanner = 'voucher-banner';
const selectorVoucherBannerCode = 'voucher-banner-code';
const selectorVoucherBannerName = 'voucher-banner-name';
const selectorVoucherButtonRemove = 'voucher-button-remove';
const selectorVoucherWidget = 'voucher-widget';

// variables
const defaultPaymentAmountMin = parseInt(
  rideToWorkByBikeConfig.entryFeePaymentMin,
);
const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
const { formatPriceCurrency } = useFormatPrice();

describe('<FormFieldVoucher>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonVoucherSubmit', 'labelVoucher', 'textVoucher'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(['discount'], 'global', i18n);
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getDiscountCoupon',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  context('desktop - apply voucher FULL', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('allows to use and then remove coupon FULL', () => {
      // apply voucher FULL
      cy.applyFullVoucher(rideToWorkByBikeConfig, i18n);
      // check banner styling
      cy.dataCy(selectorVoucherBanner)
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadius)
        .and('have.backgroundColor', grey2);
      // remove voucher
      cy.dataCy(selectorVoucherButtonRemove).should('be.visible').click();
      cy.dataCy(selecotrFormFieldVoucherInput)
        .should('be.visible')
        .find('input')
        .should('have.value', '');
    });
  });

  context('desktop - apply voucher HALF', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('allows to use and then remove coupon HALF', () => {
      // apply voucher HALF
      cy.applyHalfVoucher(
        rideToWorkByBikeConfig,
        i18n,
        defaultPaymentAmountMin,
      );
      // check banner styling
      cy.dataCy(selectorVoucherBanner)
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadius)
        .and('have.backgroundColor', grey2);
      // remove voucher
      cy.dataCy(selectorVoucherButtonRemove).should('be.visible').click();
      cy.dataCy(selecotrFormFieldVoucherInput)
        .should('be.visible')
        .find('input')
        .should('have.value', '');
    });
  });

  context('desktop - active voucher HALF', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('apiGetDiscountCouponResponseHalf').then((response) => {
        const voucherHalf = couponAdapter.toValidatedCoupon(response);
        // set voucher via store (as if it was stored and persisted)
        cy.wrap(useRegisterChallengeStore()).then((storeRegisterChallenge) => {
          // set voucher in store
          storeRegisterChallenge.setVoucher(voucherHalf);
          // calculate displayed discount
          const discountAmountInt = Math.round(
            (defaultPaymentAmountMin * response.results[0].discount) / 100,
          );
          // banner should show voucher code
          cy.dataCy(selectorVoucherBannerCode)
            .should('be.visible')
            .and('contain', response.results[0].name);
          // banner should show discount (percentage and amount)
          cy.dataCy(selectorVoucherBannerName)
            .should('be.visible')
            .and('contain', i18n.global.t('global.discount'))
            .and('contain', response.results[0].discount)
            .and(
              'contain',
              formatPriceCurrency(discountAmountInt, Currency.CZK),
            );
        });
      });
    });
  });

  context('desktop - active voucher FULL', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('apiGetDiscountCouponResponseFull').then((response) => {
        const voucherFull = couponAdapter.toValidatedCoupon(response);
        // set voucher via store (as if it was stored and persisted)
        cy.wrap(useRegisterChallengeStore()).then((storeRegisterChallenge) => {
          // set voucher in store
          storeRegisterChallenge.setVoucher(voucherFull);
          // banner should show voucher code
          cy.dataCy(selectorVoucherBannerCode)
            .should('be.visible')
            .and('contain', response.results[0].name);
          // banner should show "free registration" message
          cy.dataCy(selectorVoucherBannerName)
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('register.challenge.labelVoucherFreeRegistration'),
            );
        });
      });
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorFormFieldVoucher).should('be.visible');
    // widget
    cy.dataCy(selectorVoucherWidget).should('be.visible');
    // input
    cy.dataCy(selecotrFormFieldVoucherInput).should('be.visible');
    // button
    cy.dataCy(selectorFormFieldVoucherSubmit)
      .should('be.visible')
      .and('contain', i18n.global.t('form.buttonVoucherSubmit'));
  });

  it('does not allow to submit invalid voucher', () => {
    cy.applyInvalidVoucher(rideToWorkByBikeConfig, i18n);
    cy.dataCy(selectorVoucherWidget).should('be.visible');
  });
}
