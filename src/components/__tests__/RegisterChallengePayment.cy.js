import { colors } from 'quasar';
import RegisterChallengePayment from 'components/register/RegisterChallengePayment.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

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
const optionCustom = 'custom';
const optionVoucher = 'voucher';
const optionCompany = 'company';
const optionSchool = 'school';
const optionIndividual = 'individual';
const sliderClickTolerance = 10;
const testNumberValue = 500;

// colors
const { getPaletteColor, lighten } = colors;
const grey10 = getPaletteColor('grey-10');
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
    cy.testLanguageStringsInContext(['custom'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
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

  it('if selected individual + custom amount - renders amount input with slider', () => {
    // enable custom payment amount
    cy.dataCy(getRadioOption(optionCustom)).should('be.visible').click();
    cy.dataCy(selectorPaymentAmountCustom).should('be.visible');
    // switch to fixed payment amount
    cy.dataCy(getRadioOption(testNumberValue)).should('be.visible').click();
    cy.dataCy(selectorPaymentAmountCustom).should('not.exist');
    // switch to custom payment amount
    cy.dataCy(getRadioOption(optionCustom)).should('be.visible').click();
    // custom amount is set to last selected
    cy.dataCy(selectorSliderNumberInput).should(
      'have.value',
      testNumberValue.toString(),
    );
  });

  it('if selected voucher - allows to apply voucher (HALF)', () => {
    cy.get('@voucherHalf').then((voucher) => {
      // option default amount is active
      cy.dataCy(getRadioOption(defaultPaymentAmountMin))
        .should('be.visible')
        .click();
      // option voucher payment is active
      cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
      // input voucher
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // option with discounted amount is available
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // custom amount is set to discount value
      cy.dataCy(getRadioOption(optionCustom)).click();
      cy.dataCy(getRadioOption(voucher.amount)).should('be.visible');
      // clear input
      cy.dataCy(selectorVoucherButtonRemove).click();
      // invalid voucher is input
      cy.dataCy(selectorVoucherInput).should('be.visible');
    });
  });

  it('if selected voucher - does not allow to apply invalid voucher', () => {
    // option default amount is active
    cy.dataCy(getRadioOption(defaultPaymentAmountMin))
      .should('be.visible')
      .click();
    // option voucher payment is active
    cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
    cy.dataCy(selectorVoucherInput).type('ABCD');
    cy.dataCy(selectorVoucherSubmit).click();
    cy.dataCy(selectorVoucherInput).find('input').should('have.value', 'ABCD');
    // option with default amount is available
    cy.dataCy(getRadioOption(defaultPaymentAmountMin)).click();
    cy.dataCy(getRadioOption(optionCustom)).click();
    // custom amount is set to default value
    cy.dataCy(selectorSliderNumberInput).should(
      'have.value',
      defaultPaymentAmountMin.toString(),
    );
  });

  it('if selected voucher - allows to apply voucher (FULL) + donate option', () => {
    cy.get('@voucherFull').then((voucher) => {
      // option default amount is active
      cy.dataCy(getRadioOption(defaultPaymentAmountMin))
        .should('be.visible')
        .click();
      // option voucher payment is active
      cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
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
      cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
      cy.dataCy(selectorVoucherInput).type(voucher.code);
      cy.dataCy(selectorVoucherSubmit).click();
      // shows voucher
      cy.dataCy(selectorVoucherBannerCode).should('be.visible');
      // switch back to individual
      cy.dataCy(getRadioOption(optionIndividual)).should('be.visible').click();
      // shows amount selection but not voucher
      cy.dataCy(selectorPaymentAmount).should('be.visible');
      cy.dataCy(selectorVoucherBannerCode).should('not.exist');
      // switch back to voucher
      cy.dataCy(getRadioOption(optionVoucher)).should('be.visible').click();
      // shows voucher
      cy.dataCy(selectorVoucherBannerCode).should('be.visible');
    });
  });

  it('if selected company - renders company select + donate option', () => {
    cy.dataCy(selectorCompany).should('not.exist');
    cy.dataCy(getRadioOption(optionCompany)).should('be.visible').click();
    cy.dataCy(selectorCompany).should('be.visible');
    cy.dataCy(selectorCompanyLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('register.challenge.labelCompanyOrSchool'));
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
    cy.dataCy(getRadioOption(optionCompany)).should('be.visible').click();
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
    cy.dataCy(getRadioOption(optionSchool)).should('be.visible').click();
    cy.dataCy(selectorCompany).should('be.visible');

    // if coordinator user still has option to add donation
    testDonation();
  });
}

function getRadioOption(value) {
  return `radio-option-${value}`;
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
