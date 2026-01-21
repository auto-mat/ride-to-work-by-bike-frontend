/**
 * Setup common API intercepts for voucher testing and visit challenge page
 * @param {Object} params - Parameters object with config and fixtures
 */
Cypress.Commands.add(
  'setupVoucherTestEnvironment',
  ({
    config,
    routesConf,
    defLocale,
    registerChallengeFixture,
    discountCouponFixture,
  }) => {
    cy.interceptThisCampaignGetApi(config, defLocale);
    cy.visit('#' + routesConf['challenge_inactive']['path']);
    cy.waitForThisCampaignApi();
    cy.fixture(registerChallengeFixture).then((response) => {
      cy.interceptRegisterChallengeGetApi(config, defLocale, response);
    });
    cy.fixture(discountCouponFixture).then((response) => {
      cy.interceptDiscountCouponGetApi(
        config,
        defLocale,
        response.results[0].name,
        response,
      );
    });
    // intercept common response (not currently used)
    cy.interceptRegisterChallengePostApi(config, defLocale);
    cy.interceptRegisterChallengeCoreApiRequests(config, defLocale);
  },
);

/**
 * Switch to payment without reward
 */
Cypress.Commands.add('switchToPaymentWithoutReward', () => {
  cy.dataCy('checkbox-payment-with-reward')
    .should('be.visible')
    .find('.q-checkbox__inner')
    .click();
  cy.dataCy('checkbox-payment-with-reward')
    .find('.q-checkbox__inner')
    .should('have.class', 'q-checkbox__inner--falsy');
});

/**
 * Switch to payment with reward
 */
Cypress.Commands.add('switchToPaymentWithReward', () => {
  cy.dataCy('checkbox-payment-with-reward')
    .should('be.visible')
    .find('.q-checkbox__inner')
    .click();
  cy.dataCy('checkbox-payment-with-reward')
    .find('.q-checkbox__inner')
    .should('have.class', 'q-checkbox__inner--truthy');
});

/**
 * Validate step Merch without reward
 * "I don't want merch" checkbox should be selected and disabled
 * Next step button should be visible and enabled
 */
Cypress.Commands.add('validateStepMerchWithoutReward', (phone) => {
  cy.dataCy('form-merch-no-merch-checkbox')
    .should('be.visible')
    .and('have.class', 'disabled')
    .find('.q-checkbox__inner')
    .should('have.class', 'q-checkbox__inner--truthy');
  // merch cards should not be visible
  cy.dataCy('list-merch').should('not.be.visible');
  // fill phone if needed
  if (phone) {
    cy.dataCy('form-merch-phone-input').find('input').type(phone);
  }
  // go to next step
  cy.dataCy('step-6-continue').should('be.visible').click();
  // on step 7
  cy.dataCy('step-7').find('.q-stepper__step-content').should('be.visible');
});

/**
 * Apply HALF voucher and verify its effects
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 * @param {number} defaultPaymentAmountMin - Default minimum payment amount
 * @returns {Cypress.Chainable<number>} - Calculated discount amount
 */
Cypress.Commands.add(
  'applyHalfVoucher',
  (config, i18n, defaultPaymentAmountMin) => {
    return cy
      .fixture('apiGetDiscountCouponResponseHalf')
      .then((apiResponse) => {
        // intercept coupon endpoint
        cy.interceptDiscountCouponGetApi(
          config,
          i18n,
          apiResponse.results[0].name,
          apiResponse,
        );
        // submit voucher
        cy.dataCy('form-field-voucher-input').type(apiResponse.results[0].name);
        cy.dataCy('form-field-voucher-submit').click();
        // wait for API response
        cy.waitForDiscountCouponApi(apiResponse);
        // check success message
        cy.contains(i18n.global.t('notify.voucherApplySuccess')).should(
          'be.visible',
        );
        // calculate discount amount
        const discountAmountInt = Math.round(
          (defaultPaymentAmountMin * apiResponse.results[0].discount) / 100,
        );
        // verify banner content
        cy.dataCy('voucher-banner-code')
          .should('be.visible')
          .and('contain', apiResponse.results[0].name);
        cy.dataCy('voucher-banner-name')
          .should('be.visible')
          .and('contain', i18n.global.t('global.discount'))
          .and('contain', apiResponse.results[0].discount)
          .and('contain', discountAmountInt);
        // return discount amount as a chainable value
        return cy.wrap(discountAmountInt);
      });
  },
);

/**
 * Apply FULL voucher and verify its effects
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 */
Cypress.Commands.add('applyFullVoucher', (config, i18n) => {
  cy.fixture('apiGetDiscountCouponResponseFull').then((apiResponse) => {
    // intercept coupon endpoint
    cy.interceptDiscountCouponGetApi(
      config,
      i18n,
      apiResponse.results[0].name,
      apiResponse,
    );
    // submit voucher
    cy.dataCy('form-field-voucher-input').type(apiResponse.results[0].name);
    cy.dataCy('form-field-voucher-submit').click();
    // wait for API response
    cy.waitForDiscountCouponApi(apiResponse);
    // check success message
    cy.contains(i18n.global.t('notify.voucherApplySuccess')).should(
      'be.visible',
    );
    // verify banner content
    cy.dataCy('voucher-banner-code')
      .should('be.visible')
      .and('contain', apiResponse.results[0].name);
    cy.dataCy('voucher-banner-name')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.labelVoucherFreeRegistration'),
      );
  });
});

/**
 * Apply invalid voucher and verify error
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 */
Cypress.Commands.add('applyInvalidVoucher', (config, i18n) => {
  const invalid = 'INVALID TOKEN WITH SPACES';
  cy.fixture('apiGetDiscountCouponResponseEmpty').then((responseEmpty) => {
    // intercept coupon endpoint
    cy.interceptDiscountCouponGetApi(config, i18n, invalid, responseEmpty);
    // submit voucher
    cy.dataCy('form-field-voucher-input').type(invalid);
    cy.dataCy('form-field-voucher-submit').click();
    // verify error state
    cy.dataCy('voucher-banner').should('not.exist');
    cy.contains(i18n.global.t('notify.voucherApplyError')).should('be.visible');
    cy.dataCy('form-field-voucher-input')
      .should('be.visible')
      .find('input')
      .should('have.value', invalid);
  });
});

/**
 * Apply full voucher with "without reward" prefix
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 */
Cypress.Commands.add('applyVoucherFullWithoutReward', (config, i18n) => {
  cy.fixture('apiGetDiscountCouponResponseWithoutReward').then(
    (apiResponse) => {
      // intercept coupon endpoint
      cy.interceptDiscountCouponGetApi(
        config,
        i18n,
        apiResponse.results[0].name,
        apiResponse,
      );
      // submit voucher
      cy.dataCy('form-field-voucher-input').type(apiResponse.results[0].name);
      cy.dataCy('form-field-voucher-submit').click();
      // wait for API response
      cy.waitForDiscountCouponApi(apiResponse);
      // check success message
      cy.contains(i18n.global.t('notify.voucherApplySuccess')).should(
        'be.visible',
      );
      // verify banner content
      cy.dataCy('voucher-banner-code')
        .should('be.visible')
        .and('contain', apiResponse.results[0].name);
      cy.dataCy('voucher-banner-name')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.challenge.labelVoucherFreeRegistration'),
        );
    },
  );
});

/**
 * Apply half voucher with "without reward" prefix
 * @param {Config} config - App global config
 * @param {I18n} i18n - i18n instance
 * @param {number} defaultPaymentAmountMin - Default minimum payment amount
 * @returns {Cypress.Chainable<number>} - Calculated discount amount
 */
Cypress.Commands.add(
  'applyVoucherHalfWithoutReward',
  (config, i18n, defaultPaymentAmountMin) => {
    cy.fixture('apiGetDiscountCouponResponseHalfWithoutReward').then(
      (apiResponse) => {
        // intercept coupon endpoint
        cy.interceptDiscountCouponGetApi(
          config,
          i18n,
          apiResponse.results[0].name,
          apiResponse,
        );
        // submit voucher
        cy.dataCy('form-field-voucher-input').type(apiResponse.results[0].name);
        cy.dataCy('form-field-voucher-submit').click();
        // wait for API response
        cy.waitForDiscountCouponApi(apiResponse);
        // check success message
        cy.contains(i18n.global.t('notify.voucherApplySuccess')).should(
          'be.visible',
        );
        // calculate discount amount
        const discountAmountInt = Math.round(
          (defaultPaymentAmountMin * apiResponse.results[0].discount) / 100,
        );
        // verify banner content
        cy.dataCy('voucher-banner-code')
          .should('be.visible')
          .and('contain', apiResponse.results[0].name);
        cy.dataCy('voucher-banner-name')
          .should('be.visible')
          .and('contain', i18n.global.t('global.discount'))
          .and('contain', apiResponse.results[0].discount)
          .and('contain', discountAmountInt);
        // return discount amount as a chainable value
        return cy.wrap(discountAmountInt);
      },
    );
  },
);
