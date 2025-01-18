import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import { computed, nextTick } from 'vue';
import RegisterChallengePayment from 'components/register/RegisterChallengePayment.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { PaymentAmount, PaymentSubject } from '../enums/Payment';
import { useRegisterChallengeStore } from 'stores/registerChallenge';
import { useChallengeStore } from 'stores/challenge';
import { getRadioOption } from '../../../test/cypress/utils';
import { interceptOrganizationsApi } from '../../../test/cypress/support/commonTests';
import { OrganizationType } from '../types/Organization';
import { getCurrentPriceLevelsUtil } from '../../utils/price_levels';
import { PriceLevelCategory } from '../../components/enums/Challenge';
import { Currency, useFormatPrice } from '../../composables/useFormatPrice';

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
const selectorTotalPriceValue = 'total-price-value';
const selectorVoucherBannerCode = 'voucher-banner-code';
const selectorVoucherButtonRemove = 'voucher-button-remove';
const selectorVoucherInput = 'form-field-voucher-input';

// variables
const borderRadiusCardSmall = rideToWorkByBikeConfig.borderRadiusCardSmall;
let defaultPaymentAmountMin = 0;
const defaultPaymentAmountMax = parseInt(
  rideToWorkByBikeConfig.entryFeePaymentMax,
);
const sliderClickTolerance = 10;
const testNumberValue = 500;
const { formatPriceCurrency } = useFormatPrice();

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
  before(() => {
    // dynamically load default payment amount from fixture
    cy.fixture('apiGetThisCampaign.json').then((response) => {
      const priceLevels = response.results[0].price_level;
      const currentPriceLevels = getCurrentPriceLevelsUtil(priceLevels);
      defaultPaymentAmountMin =
        currentPriceLevels[PriceLevelCategory.basic].price;
    });
  });

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
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'getHasOrganizationAdmin',
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
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        // for first organization, intercept API call with response true
        cy.fixture('apiGetHasOrganizationAdminResponseTrue').then(
          (response) => {
            cy.interceptHasOrganizationAdminGetApi(
              rideToWorkByBikeConfig,
              i18n,
              formFieldCompanyResponse.results[0].id,
              response,
            );
          },
        );
        // for second organization, intercept API call with response false
        cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptHasOrganizationAdminGetApi(
              rideToWorkByBikeConfig,
              i18n,
              formFieldCompanyResponse.results[1].id,
              response,
            );
          },
        );
        cy.interceptIsUserOrganizationAdminGetApi(rideToWorkByBikeConfig, i18n);
      });
      cy.mount(RegisterChallengePayment, {
        props: {},
      });
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((storeChallenge) => {
          storeChallenge.setPriceLevel(response.results[0].price_level);
        });
      });
      cy.viewport('macbook-16');
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
      cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
        // for first organization, intercept API call with response true
        cy.fixture('apiGetHasOrganizationAdminResponseTrue').then(
          (response) => {
            cy.interceptHasOrganizationAdminGetApi(
              rideToWorkByBikeConfig,
              i18n,
              formFieldCompanyResponse.results[0].id,
              response,
            );
          },
        );
        // for second organization, intercept API call with response false
        cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptHasOrganizationAdminGetApi(
              rideToWorkByBikeConfig,
              i18n,
              formFieldCompanyResponse.results[1].id,
              response,
            );
          },
        );
        cy.interceptIsUserOrganizationAdminGetApi(rideToWorkByBikeConfig, i18n);
      });
      cy.mount(RegisterChallengePayment, {
        props: {},
      });
      cy.fixture('apiGetThisCampaign.json').then((response) => {
        cy.wrap(useChallengeStore()).then((storeChallenge) => {
          storeChallenge.setPriceLevel(response.results[0].price_level);
        });
      });
      cy.viewport('iphone-6');
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
          i18n.global.t('register.challenge.textPaymentMinimum', {
            amount: formatPriceCurrency(defaultPaymentAmountMin, Currency.CZK),
          }),
        ).then((text) => {
          cy.wrap($element.text()).should('equal', text);
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
    // apply HALF voucher and use the returned discount amount
    cy.applyHalfVoucher(
      rideToWorkByBikeConfig,
      i18n,
      defaultPaymentAmountMin,
    ).then((discountAmount) => {
      // option with discounted amount is available
      cy.dataCy(selectorPaymentAmount)
        .should('be.visible')
        .find('.q-radio__inner.q-radio__inner--truthy')
        .siblings('.q-radio__label')
        .should('contain', discountAmount);
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
        .should('contain', discountAmount);
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
    // apply voucher HALF
    cy.applyHalfVoucher(
      rideToWorkByBikeConfig,
      i18n,
      defaultPaymentAmountMin,
    ).then((discountAmount) => {
      cy.dataCy(selectorTotalPriceValue).should('contain', discountAmount);
      // custom amount is set to discount value
      cy.dataCy(getRadioOption(PaymentAmount.custom)).click();
      cy.dataCy(getRadioOption(discountAmount)).should('be.visible');
      // total price shows discounted amount
      cy.dataCy(selectorTotalPriceValue).should('contain', discountAmount);
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
    // apply invalid voucher
    cy.applyInvalidVoucher(rideToWorkByBikeConfig, i18n);
    // input amount is hidden
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    // input custom amount is hidden
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
  });

  it('if selected voucher - allows to apply voucher (FULL) + donate option', () => {
    // option default amount is active
    cy.dataCy(getRadioOption(defaultPaymentAmountMin))
      .should('be.visible')
      .click();
    // option voucher payment is active
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    // apply FULL voucher
    cy.applyFullVoucher(rideToWorkByBikeConfig, i18n);
    // option amount hidden
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    // total price is hidden
    cy.dataCy(selectorTotalPriceValue).should('not.exist');
    // custom amount hidden
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // clear input
    cy.dataCy(selectorDonation).should('be.visible');
    // if voucher FULL is applied, user still has option to add donation
    testDonation();
  });

  it('if selected voucher - retains shown voucher after switching between payment subjects', () => {
    // select voucher
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    // apply voucher HALF
    cy.applyHalfVoucher(rideToWorkByBikeConfig, i18n, defaultPaymentAmountMin);
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

  it('if selected voucher - resets prices after switching back to option individual', () => {
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    cy.dataCy(selectorPaymentAmount).should('not.exist');
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // apply voucher HALF
    cy.applyHalfVoucher(
      rideToWorkByBikeConfig,
      i18n,
      defaultPaymentAmountMin,
    ).then((discountAmount) => {
      // amount options and custom amount are hidden
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // HALF voucher value is shown
      cy.dataCy(getRadioOption(discountAmount)).should('be.visible');
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
    // apply voucher HALF
    cy.applyHalfVoucher(
      rideToWorkByBikeConfig,
      i18n,
      defaultPaymentAmountMin,
    ).then((discountAmount) => {
      // amount options and custom amount are hidden
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
      // HALF voucher value is shown
      cy.dataCy(getRadioOption(discountAmount)).should('be.visible');
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
      .then(($element) => {
        cy.stripHtmlTags(
          i18n.global.t('register.challenge.textOrganization'),
        ).then((text) => {
          expect($element.text()).to.equal(text);
        });
      });

    // if company is paying the fee, user still has option to add donation
    testDonation();
  });

  it('if selected company and no coordinator - allows to register as coordinator + donate option', () => {
    /**
     * Scenario: Selected company has no company coordinator
     * Displays checkbox with coordinator option
     * If option is checked, displays partial form for registration
     */
    cy.dataCy(selectorCompany).should('not.exist');
    cy.dataCy(getRadioOption(PaymentSubject.company))
      .should('be.visible')
      .click();
    cy.dataCy(selectorCompany).should('be.visible');
    // checkbox coordinator
    cy.dataCy(selectorCoordinatorCheckbox).should('not.exist');
    // only show form when enabled
    cy.dataCy(selectorCoordinatorText).should('not.exist');
    cy.dataCy(selectorCoordinatorPhone).should('not.exist');
    cy.dataCy(selectorCoordinatorJobTitle).should('not.exist');
    cy.dataCy(selectorCoordinatorResponsibility).should('not.exist');
    cy.dataCy(selectorCoordinatorTerms).should('not.exist');
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
    cy.testPaymentTotalPriceWithDonation(
      i18n,
      defaultPaymentAmountMin,
      testNumberValue,
    );

    // company
    cy.dataCy(getRadioOption(PaymentSubject.company))
      .should('be.visible')
      .click();
    cy.dataCy('total-price').should('not.exist');
    cy.testPaymentTotalPriceWithDonation(
      i18n,
      defaultPaymentAmountMin,
      testNumberValue,
    );

    // voucher
    cy.dataCy(getRadioOption(PaymentSubject.voucher))
      .should('be.visible')
      .click();
    cy.dataCy('total-price').should('not.exist');
    // apply voucher HALF
    cy.applyHalfVoucher(
      rideToWorkByBikeConfig,
      i18n,
      defaultPaymentAmountMin,
    ).then((discountAmount) => {
      // total price is shown
      cy.dataCy('total-price')
        .should('contain', i18n.global.t('global.total'))
        .and('contain', discountAmount);
    });
    // remove voucher
    cy.dataCy(selectorVoucherButtonRemove).click();
    cy.dataCy('total-price').should('not.exist');
    // apply voucher FULL
    cy.applyFullVoucher(rideToWorkByBikeConfig, i18n);
    cy.dataCy('total-price').should('not.exist');
    cy.testPaymentTotalPriceWithDonation(
      i18n,
      defaultPaymentAmountMin,
      testNumberValue,
    );
  });

  it('shows checkbox become coordinator if organization has no coordinator and user no coordinator', () => {
    cy.fixture('apiGetIsUserOrganizationAdminResponseFalse.json').then(
      (response) => {
        cy.waitForIsUserOrganizationAdminApi(response);
      },
    );
    cy.dataCy(getRadioOption(PaymentSubject.company))
      .should('be.visible')
      .click();
    // open organization select
    cy.dataCy(selectorCompany)
      .should('be.visible')
      .find('.q-field__append')
      .click();
    // from menu select first organization
    cy.get('.q-menu').within(() => {
      cy.get('.q-item').first().click();
    });
    // checkbox become coordinator should not be visible
    cy.dataCy(selectorCoordinatorCheckbox).should('not.exist');
    // open organization select
    cy.dataCy(selectorCompany)
      .should('be.visible')
      .find('.q-field__append')
      .click();
    // select second organization
    cy.get('.q-menu').within(() => {
      cy.get('.q-item').eq(1).click();
    });
    // checkbox become coordinator should be visible
    cy.dataCy(selectorCoordinatorCheckbox)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', primary)
      .and(
        'contain',
        i18n.global.t('companyCoordinator.labelRegisterCoordinator'),
      );
    // get store
    cy.wrap(useRegisterChallengeStore()).then((store) => {
      // access store via computed property to correctly track changes
      const computedPaymentSubject = computed(
        () => store.getIsUserOrganizationAdmin,
      );
      // set isUserOrganizationAdmin to true
      cy.wrap(store.setIsUserOrganizationAdmin(true));
      // start in default state (individual)
      cy.wrap(computedPaymentSubject).its('value').should('be.true');
      // checkbox coordinator should not be visible
      cy.dataCy(selectorCoordinatorCheckbox).should('not.exist');
      // without next tick, the UI updates too fast to be checked
      nextTick(() => {
        // set isUserOrganizationAdmin back to false
        cy.wrap(store.setIsUserOrganizationAdmin(false));
        // start in default state (individual)
        cy.wrap(computedPaymentSubject).its('value').should('be.false');
        // checkbox coordinator should be visible
        cy.dataCy(selectorCoordinatorCheckbox).should('be.visible');
      });
    });
    // enable checkbox
    cy.dataCy(selectorCoordinatorCheckbox).click();
    // test coordinator form
    cy.dataCy(selectorCoordinatorText)
      .should('be.visible')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .then(($el) => {
        cy.stripHtmlTags(
          i18n.global.t('companyCoordinator.textBecomeCoordinator'),
        ).then((translation) => {
          expect($el.text()).to.eq(translation);
        });
      });
    // input phone label
    cy.dataCy(selectorCoordinatorPhone);
    // input job title label
    cy.dataCy(selectorCoordinatorJobTitle).should('be.visible');
    // checkbox responsibility
    cy.dataCy(selectorCoordinatorResponsibility).should('be.visible');
    // checkbox terms
    cy.dataCy(selectorCoordinatorTerms).should('be.visible');
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
