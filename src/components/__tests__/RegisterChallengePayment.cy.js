import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import { computed } from 'vue';
import RegisterChallengePayment from 'components/register/RegisterChallengePayment.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { PaymentAmount, PaymentSubject } from '../enums/Payment';
import { useRegisterChallengeStore } from 'stores/registerChallenge';
import { getRadioOption } from '../../../test/cypress/utils';
import { interceptOrganizationsApi } from '../../../test/cypress/support/commonTests';
import { OrganizationType } from '../types/Organization';

// selectors
const selectorBannerPaymentMinimum = 'banner-payment-minimum';
const selectorCompany = 'form-field-company';
const selectorCompanyLabel = 'form-field-company-label';
const selectorCompanyPaymentText = 'payment-company-text';
const selectorDonation = 'form-field-donation';
const selectorDonationCheckbox = 'form-field-donation-checkbox';
const selectorPaymentAmount = 'form-field-payment-amount';
const selectorPaymentAmountCustom = 'form-field-payment-amount-custom';
const selectorPaymentAmountLabel = 'form-field-payment-amount-label';
const selectorPaymentSubject = 'form-field-payment-subject';
const selectorPaymentSubjectLabel = 'form-field-payment-subject-label';
const selectorRegisterChallengePayment = 'register-challenge-payment';
const selectorCoordinatorCheckbox = 'register-coordinator-checkbox';
const selectorCoordinatorText = 'register-coordinator-text';
const selectorCoordinatorJobTitle = 'register-coordinator-job-title';
const selectorCoordinatorPhone = 'register-coordinator-phone';
const selectorCoordinatorResponsibility = 'register-coordinator-responsibility';
const selectorCoordinatorTerms = 'register-coordinator-terms';
const selectorSliderNumberInput = 'form-field-slider-number-input';
const selectorSliderNumberSlider = 'form-field-slider-number-slider';
const selectorTextPaymentOrganizer = 'text-payment-organizer';
const selectorVoucherBannerCode = 'voucher-banner-code';
const selectorVoucherButtonRemove = 'voucher-button-remove';
const selectorVoucherInput = 'form-field-voucher-input';
const selectorVoucherSubmit = 'form-field-voucher-submit';

// variables
const borderRadiusCardSmall = rideToWorkByBikeConfig.borderRadiusCardSmall;
const defaultPaymentAmountMin = rideToWorkByBikeConfig.entryFeePaymentMin;
const defaultPaymentAmountMax = rideToWorkByBikeConfig.entryFeePaymentMax;
const sliderClickTolerance = 10;
const testNumberValue = 500;

// colors
const { getPaletteColor, lighten } = colors;
const grey10 = getPaletteColor('grey-10');
const grey8 = getPaletteColor('grey-8');
const primary = getPaletteColor('primary');
const primaryLight = lighten(primary, 90);

const optionsPaymentSubject = [
  'labelPaymentSubjectIndividual',
  'labelPaymentSubjectVoucher',
  'labelPaymentSubjectCompany',
  'labelPaymentSubjectSchool',
];

describe('<RegisterChallengePayment>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelCompanyOrSchool',
        'labelPaymentAmount',
        'labelPaymentSubject',
        'labelPaymentSubjectCompany',
        'labelPaymentSubjectIndividual',
        'labelPaymentSubjectSchool',
        'labelPaymentSubjectVoucher',
        'textOrganization',
        'textPaymentMinimum',
        'textPaymentOrganizer',
      ],
      'register.challenge',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['labelRegisterCoordinator', 'textBecomeCoordinator'],
      'companyCoordinator',
      i18n,
    );
    cy.testLanguageStringsInContext(['custom', 'total'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.school,
      );
      cy.fixture('registerPaymentVoucherFull').then((voucherFull) => {
        cy.fixture('registerPaymentVoucherHalf').then((voucherHalf) => {
          cy.wrap(voucherFull).as('voucherFull');
          cy.wrap(voucherHalf).as('voucherHalf');
          cy.mount(RegisterChallengePayment, {
            props: {},
          });
          cy.viewport('macbook-16');
        });
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.school,
      );
      cy.fixture('registerPaymentVoucherFull').then((voucherFull) => {
        cy.fixture('registerPaymentVoucherHalf').then((voucherHalf) => {
          cy.wrap(voucherFull).as('voucherFull');
          cy.wrap(voucherHalf).as('voucherHalf');
          cy.mount(RegisterChallengePayment, {
            props: {},
          });
          cy.viewport('iphone-6');
        });
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component in default state (individual)', () => {
    // component
    cy.dataCy(selectorRegisterChallengePayment).should('be.visible');
    // text
    cy.dataCy(selectorTextPaymentOrganizer)
      .should('be.visible')
      .then(($element) => {
        cy.stripHtmlTags(
          i18n.global.t('register.challenge.textPaymentOrganizer'),
        ).then((text) => {
          expect($element.text()).to.equal(text);
        });
      });
    // banner
    cy.dataCy(selectorBannerPaymentMinimum)
      .should('be.visible')
      .and('have.color', primary)
      .and('have.backgroundColor', primaryLight)
      .and('have.css', 'padding', '16px')
      .and('have.css', 'border-radius', borderRadiusCardSmall)
      .then(($element) => {
        cy.stripHtmlTags(
          i18n.global.t('register.challenge.textPaymentMinimum'),
        ).then((text) => {
          expect($element.text()).to.equal(text);
        });
      });
    // input subject
    cy.dataCy(selectorPaymentSubjectLabel)
      .should('be.visible')
      .and('have.color', grey10)
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and(
        'have.text',
        i18n.global.t('register.challenge.labelPaymentSubject'),
      );
    cy.dataCy(selectorPaymentSubject).should('be.visible');
    cy.dataCy(selectorPaymentSubject)
      .find('[role="radio"]')
      .should('be.visible')
      .and('have.length', 4)
      .each((element, index) => {
        cy.wrap(element).should(
          'contain',
          i18n.global.t(`register.challenge.${optionsPaymentSubject[index]}`),
        );
      });
    // input amount radios
    cy.dataCy(selectorPaymentAmountLabel)
      .should('be.visible')
      .and('have.color', grey10)
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.text', i18n.global.t('register.challenge.labelPaymentAmount'));
    cy.dataCy(selectorPaymentAmount).should('be.visible');
    cy.dataCy(selectorPaymentAmount)
      .find('[role="radio"]')
      .should('be.visible')
      .and('have.length', 4);
  });

  it('stores payment subject in store', () => {
    // get store
    cy.wrap(useRegisterChallengeStore()).then((store) => {
      // access store via computed property to correctly track changes
      const computedPaymentSubject = computed(() => store.getPaymentSubject);
      store.setPaymentSubject(null);
      // start in default state (individual)
      cy.wrap(computedPaymentSubject).its('value').should('be.null');
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedPaymentSubject)
        .its('value')
        .should('equal', PaymentSubject.individual);
      // switch to voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedPaymentSubject)
        .its('value')
        .should('equal', PaymentSubject.voucher);
      // switch to company
      cy.dataCy(getRadioOption(PaymentSubject.company))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedPaymentSubject)
        .its('value')
        .should('equal', PaymentSubject.company);
      // switch to school
      cy.dataCy(getRadioOption(PaymentSubject.school))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedPaymentSubject)
        .its('value')
        .should('equal', PaymentSubject.school);
    });
  });

  it('if selected individual + custom amount - renders amount input with slider', () => {
    // enable custom payment amount
    cy.dataCy(getRadioOption(PaymentAmount.custom))
      .should('be.visible')
      .click();
    cy.dataCy(selectorPaymentAmountCustom).should('be.visible');
    // switch to fixed payment amount
    cy.dataCy(getRadioOption(testNumberValue)).should('be.visible').click();
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // switch to custom payment amount
    cy.dataCy(getRadioOption(PaymentAmount.custom))
      .should('be.visible')
      .click();
    // custom amount is set to last selected
    cy.dataCy(selectorSliderNumberInput).should(
      'have.value',
      testNumberValue.toString(),
    );
  });

  it('handles default price when switching between individual and discount voucher', () => {
    cy.get('@voucherHalf').then((voucher) => {
      // ensure we are on step individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // check amount
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', defaultPaymentAmountMin);
      // switch to voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // amount options are hidden
      cy.dataCy(selectorPaymentAmount).should('not.exist');
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option with discounted amount is available
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', voucher.amount);
      // switch to individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // amount is reset to default value
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', defaultPaymentAmountMin);
      // switch to voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // amount is reset to voucher value
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', voucher.amount);
      // select payment amount available for both payment subjects
      cy.dataCy(getRadioOption(testNumberValue)).should('be.visible').click();
      // amount is set to shared test value
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', testNumberValue);
      // switch to individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // amount stays the same
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', testNumberValue);
      // switch to voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // amount stays the same
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', testNumberValue);
    });
  });

  it('if selected voucher - allows to apply voucher (HALF)', () => {
    cy.get('@voucherHalf').then((voucher) => {
      // option default amount is active
      cy.dataCy(getRadioOption(defaultPaymentAmountMin))
        .should('be.visible')
        .click();
      // option voucher payment is active
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // input amount is hidden
      cy.dataCy(selectorPaymentAmount).should('not.exist');
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option with discounted amount is available
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // custom amount is set to discount value
      cy.dataCy(getRadioOption(PaymentAmount.custom)).click();
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // clear voucher
      cy.dataCy(selectorVoucherButtonRemove).click();
      // input voucher is shown
      cy.dataCy(selectorVoucherInput).should('be.visible');
      // input amount is hidden
      cy.dataCy(selectorPaymentAmount).should('not.exist');
      // input custom amount is hidden
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    });
  });

  it('if selected voucher - does not allow to apply invalid voucher', () => {
    // option default amount is active
    cy.dataCy(getRadioOption(defaultPaymentAmountMin))
      .should('be.visible')
      .click();
    // option voucher payment is active
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    cy.dataCy(selectorVoucherInput).type('ABCD');
    cy.dataCy(selectorVoucherSubmit).click();
    cy.dataCy(selectorVoucherInput).find('input').should('have.value', 'ABCD');
    // input amount is hidden
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    // input custom amount is hidden
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
  });

  it('if selected voucher - allows to apply voucher (FULL) + donate option', () => {
    cy.get('@voucherFull').then((voucher) => {
      // option default amount is active
      cy.dataCy(getRadioOption(defaultPaymentAmountMin))
        .should('be.visible')
        .click();
      // option voucher payment is active
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option amount hidden
      cy.dataCy(selectorPaymentAmount).should('not.exist');
      // custom amount hidden
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // clear input
      cy.dataCy(selectorDonation).should('be.visible');

      // if voucher FULL is applied, user still has option to add donation
      testDonation();
    });
  });

  it('if selected voucher - retains shown voucher after switching between payment subjects', () => {
    cy.get('@voucherHalf').then((voucher) => {
      // select voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // shows voucher
      cy.dataCy(selectorVoucherBannerCode).should('be.visible');
      // switch back to individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // shows amount selection but not voucher
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorVoucherBannerCode).should('not.exist');
      // switch back to voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // shows voucher
      cy.dataCy(selectorVoucherBannerCode).should('be.visible');
    });
  });

  it('if selected voucher - resets prices after switching back to option individual', () => {
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // enter voucher HALF
    cy.get('@voucherHalf').then((voucher) => {
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // amount options and custom amount are hidden
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // HALF voucher value is shown
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // switch back to individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // amount options are shown
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // default amount is shown
      cy.dataCy(getRadioOption(defaultPaymentAmountMin)).should('be.visible');
    });
  });

  it('if selected voucher - resets prices after switching back to option individual (custom amount)', () => {
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // enter voucher HALF
    cy.get('@voucherHalf').then((voucher) => {
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // amount options and custom amount are hidden
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // HALF voucher value is shown
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // select custom amount
      cy.dataCy(getRadioOption(PaymentAmount.custom))
        .should('be.visible')
        .click();
      // switch back to individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // amount options are shown
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // default amount is shown
      cy.dataCy(getRadioOption(defaultPaymentAmountMin)).should('be.visible');
    });
  });

  it('if selected company - renders company select + donate option', () => {
    cy.dataCy(selectorCompany).should('not.exist');
    cy.dataCy(getRadioOption(PaymentSubject.company))
      .should('be.visible')
      .click();
    // amount options are hidden
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    // organization select is shown
    cy.dataCy(selectorCompany).should('be.visible');
    cy.dataCy(selectorCompanyLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelCompany'));
    // info text
    cy.dataCy(selectorCompanyPaymentText)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('register.challenge.textOrganization'));

    // if company is paying the fee, user still has option to add donation
    testDonation();
  });

  it('if selected company and no coordinator - allows to register as coordinator + donate option', () => {
    /**
     * Scenario: Selected company has no company coordinator
     * Displays checkbox with coordinator option
     * If option is checked, displays partial form for registration
     * TODO: Add condition - NO COORDINATOR IN SELECTED COMPANY
     */
    cy.dataCy(selectorCompany).should('not.exist');
    cy.dataCy(getRadioOption(PaymentSubject.company))
      .should('be.visible')
      .click();
    cy.dataCy(selectorCompany).should('be.visible');
    // checkbox coordinator
    cy.dataCy(selectorCoordinatorCheckbox)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', primary)
      .and(
        'contain',
        i18n.global.t('companyCoordinator.labelRegisterCoordinator'),
      );
    // only show form when enabled
    cy.dataCy(selectorCoordinatorText).should('not.exist');
    cy.dataCy(selectorCoordinatorPhone).should('not.exist');
    cy.dataCy(selectorCoordinatorJobTitle).should('not.exist');
    cy.dataCy(selectorCoordinatorResponsibility).should('not.exist');
    cy.dataCy(selectorCoordinatorTerms).should('not.exist');
    // enable
    cy.dataCy(selectorCoordinatorCheckbox).click();
    // form
    cy.dataCy(selectorCoordinatorText)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .then(($el) => {
        cy.stripHtmlTags(
          i18n.global.t('companyCoordinator.textBecomeCoordinator'),
        ).then((translation) => {
          expect($el.text()).to.eq(translation);
        });
      });
    // phone label
    cy.dataCy(selectorCoordinatorPhone).should('be.visible');
    // input label
    cy.dataCy(selectorCoordinatorJobTitle).should('be.visible');
    // checkbox responsibility
    cy.dataCy(selectorCoordinatorResponsibility).should('be.visible');
    // checkbox terms
    cy.dataCy(selectorCoordinatorTerms).should('be.visible');

    // if coordinator user still has option to add donation
    testDonation();
  });

  it('if selected school - renders school select + donate option', () => {
    cy.dataCy(selectorCompany).should('not.exist');
    cy.dataCy(getRadioOption(PaymentSubject.school))
      .should('be.visible')
      .click();
    // amount options are hidden
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    // organization select is shown
    cy.dataCy(selectorCompany).should('be.visible');
    // label school
    cy.dataCy(selectorCompanyLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelSchool'));

    // user still has option to add donation
    testDonation();
  });

  it('if selected company or school, saves organization type value in store', () => {
    cy.wrap(useRegisterChallengeStore()).then((store) => {
      // access store via computed property to correctly track changes
      const computedStoreProperty = computed(() => store.getOrganizationType);
      // start in default state (individual)
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // switch to company
      cy.dataCy(getRadioOption(PaymentSubject.company))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedStoreProperty)
        .its('value')
        .should('equal', OrganizationType.company);
      // switch to school
      cy.dataCy(getRadioOption(PaymentSubject.school))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedStoreProperty)
        .its('value')
        .should('equal', OrganizationType.school);
      // switch to individual
      cy.dataCy(getRadioOption(PaymentSubject.individual))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedStoreProperty)
        .its('value')
        .should('equal', OrganizationType.none);
      // switch to company
      cy.dataCy(getRadioOption(PaymentSubject.company))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedStoreProperty)
        .its('value')
        .should('equal', OrganizationType.company);
      // switch to voucher
      cy.dataCy(getRadioOption(PaymentSubject.voucher))
        .should('be.visible')
        .click();
      // check store value
      cy.wrap(computedStoreProperty)
        .its('value')
        .should('equal', OrganizationType.none);
    });
  });

  it('shows correct total price', () => {
    // individual
    cy.dataCy(getRadioOption(PaymentSubject.individual))
      .should('be.visible')
      .click();
    cy.dataCy(selectorPaymentAmount).should('be.visible');
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    cy.dataCy(selectorDonationCheckbox).should('not.exist');
    cy.dataCy('total-price')
      .should('contain', i18n.global.t('global.total'))
      .and('contain', defaultPaymentAmountMin);
    // styling
    cy.dataCy('total-price-label')
      .should('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey8);
    cy.dataCy('total-price-value')
      .should('have.css', 'font-size', '24px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10);
    // change amount to test value
    cy.dataCy(getRadioOption(testNumberValue)).should('be.visible').click();
    cy.dataCy('total-price')
      .should('contain', i18n.global.t('global.total'))
      .and('contain', testNumberValue);
    // custom amount
    cy.dataCy(getRadioOption(PaymentAmount.custom))
      .should('be.visible')
      .click();
    // test value should be shown
    cy.dataCy('total-price')
      .should('contain', i18n.global.t('global.total'))
      .and('contain', testNumberValue);

    // school
    cy.dataCy(getRadioOption(PaymentSubject.school))
      .should('be.visible')
      .click();
    cy.dataCy('total-price').should('not.exist');

    // company
    cy.dataCy(getRadioOption(PaymentSubject.company))
      .should('be.visible')
      .click();
    cy.dataCy('total-price').should('not.exist');

    // voucher
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    cy.dataCy('total-price').should('not.exist');
    // enter voucher FULL
    cy.get('@voucherFull').then((voucher) => {
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      cy.dataCy('total-price').should('not.exist');
    });
    // remove voucher
    cy.dataCy(selectorVoucherButtonRemove).click();
    cy.dataCy('total-price').should('not.exist');
    // enter voucher HALF
    cy.get('@voucherHalf').then((voucher) => {
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      cy.dataCy('total-price')
        .should('contain', i18n.global.t('global.total'))
        .and('contain', voucher.amount);
    });
  });
}

function testDonation() {
  cy.dataCy(selectorDonationCheckbox).click();
  cy.dataCy(selectorSliderNumberInput)
    .should('be.visible')
    .and('have.value', defaultPaymentAmountMin.toString());
  // click in the middle of slider
  cy.dataCy(selectorSliderNumberSlider).should('be.visible').click();
  cy.dataCy(selectorSliderNumberInput)
    .invoke('val')
    .then((value) => {
      const intValue = parseInt(value);
      const midValue = parseInt(
        Math.round(
          (parseInt(defaultPaymentAmountMax) +
            parseInt(defaultPaymentAmountMin)) /
            2,
        ),
      );
      // clicking on the slider is not entirely precise - we define tolerance
      expect(Math.abs(intValue - midValue)).to.be.lessThan(
        sliderClickTolerance,
      );
    });
}
