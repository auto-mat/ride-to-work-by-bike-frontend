import FormFieldVoucher from 'components/form/FormFieldVoucher.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorFormFieldVoucher = 'form-field-voucher';
const selecotrFormFieldVoucherInput = 'form-field-voucher-input';
const selectorFormFieldVoucherSubmit = 'form-field-voucher-submit';
const selectorQNotifyMessage = '.q-notification__message';
const selectorVoucherBanner = 'voucher-banner';
const selectorVoucherBannerCode = 'voucher-banner-code';
const selectorVoucherBannerName = 'voucher-banner-name';
const selectorVoucherButtonRemove = 'voucher-button-remove';
const selectorVoucherWidget = 'voucher-widget';

// variables
const codeInvalid = 'ABCD';

describe('<FormFieldVoucher>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonVoucherSubmit', 'labelVoucher', 'textVoucher'],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('desktop - active voucher HALF', () => {
    beforeEach(() => {
      cy.fixture('registerPaymentVoucherHalf').then((voucherHalf) => {
        cy.mount(FormFieldVoucher, {
          props: {
            activeVoucher: voucherHalf,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('registerPaymentVoucherHalf').then((voucherHalf) => {
        cy.dataCy(selectorVoucherBannerCode)
          .should('be.visible')
          .and('contain', voucherHalf.code)
          .and('contain', i18n.global.t('form.textVoucher'));
      });
    });
  });

  context('desktop - active voucher FULL', () => {
    beforeEach(() => {
      cy.fixture('registerPaymentVoucherFull').then((voucherFull) => {
        cy.mount(FormFieldVoucher, {
          props: {
            activeVoucher: voucherFull,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders active voucher if passed in', () => {
      cy.fixture('registerPaymentVoucherFull').then((voucherFull) => {
        cy.dataCy(selectorVoucherBannerCode)
          .should('be.visible')
          .and('contain', voucherFull.code)
          .and('contain', i18n.global.t('form.textVoucher'));
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldVoucher, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
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

  it('allows to submit and remove HALF voucher', () => {
    cy.fixture('registerPaymentVoucherHalf').then((voucherHalf) => {
      // submit voucher
      cy.dataCy(selecotrFormFieldVoucherInput).type(voucherHalf.code);
      cy.dataCy(selectorFormFieldVoucherSubmit).click();
      // banner
      cy.dataCy(selectorVoucherBanner).should('be.visible');
      cy.dataCy(selectorVoucherBannerCode)
        .should('be.visible')
        .and('contain', voucherHalf.code)
        .and('contain', i18n.global.t('form.textVoucher'));
      cy.dataCy(selectorVoucherBannerName)
        .should('be.visible')
        .and('contain', voucherHalf.name);
      // user message
      cy.get(selectorQNotifyMessage)
        .should('be.visible')
        .and('contain', i18n.global.t('notify.voucherApplySuccess'));
      // remove voucher
      cy.dataCy(selectorVoucherButtonRemove).should('be.visible');
      cy.dataCy(selectorVoucherButtonRemove).click();
      cy.dataCy(selectorVoucherBanner).should('not.exist');
      // widget
      cy.dataCy(selectorVoucherWidget).should('be.visible');
    });
  });

  it('allows to submit and remove FULL voucher', () => {
    cy.fixture('registerPaymentVoucherHalf').then((voucherFull) => {
      // submit voucher
      cy.dataCy(selecotrFormFieldVoucherInput).type(voucherFull.code);
      cy.dataCy(selectorFormFieldVoucherSubmit).click();
      // banner
      cy.dataCy(selectorVoucherBanner).should('be.visible');
      cy.dataCy(selectorVoucherBannerCode)
        .should('be.visible')
        .and('contain', voucherFull.code)
        .and('contain', i18n.global.t('form.textVoucher'));
      cy.dataCy(selectorVoucherBannerName)
        .should('be.visible')
        .and('contain', voucherFull.name);
      // user message
      cy.get(selectorQNotifyMessage)
        .should('be.visible')
        .and('contain', i18n.global.t('notify.voucherApplySuccess'));
      // remove voucher
      cy.dataCy(selectorVoucherButtonRemove).should('be.visible');
      cy.dataCy(selectorVoucherButtonRemove).click();
      cy.dataCy(selectorVoucherBanner).should('not.exist');
      // widget
      cy.dataCy(selectorVoucherWidget).should('be.visible');
    });
  });

  it('does not allow to submit invalid voucher', () => {
    // submit voucher
    cy.dataCy(selecotrFormFieldVoucherInput).type(codeInvalid);
    cy.dataCy(selectorFormFieldVoucherSubmit).click();
    // banner
    cy.dataCy(selectorVoucherBanner).should('not.exist');
    // user message
    cy.get(selectorQNotifyMessage)
      .should('be.visible')
      .and('contain', i18n.global.t('notify.voucherApplyError'));
    // widget
    cy.dataCy(selectorVoucherWidget).should('be.visible');
  });
}
