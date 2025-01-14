import { createPinia, setActivePinia } from 'pinia';
import RegisterChallengePaymentMessages from 'components/register/RegisterChallengePaymentMessages.vue';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { i18n } from '../../boot/i18n';

describe('<RegisterChallengePaymentMessages>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'textDonationPaymentSuccessful',
        'textPayuPaymentFailed',
        'textPayuWaitingForPayment',
        'textRegistrationWaitingForConfirmation',
      ],
      'register.challenge',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(RegisterChallengePaymentMessages, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders no messages for company no_admission', () => {
    cy.fixture('apiGetRegisterChallengeCompanyNoAdmission.json').then(
      (data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
        });
      },
    );
    // no messages
    cy.get('.q-banner').should('not.exist');
  });

  it('renders waiting for coordinator message for company waiting', () => {
    cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then((data) => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setRegisterChallengeFromApi(data.results[0]);
      });
    });
    cy.dataCy('registration-waiting-for-coordinator-message')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t(
          'register.challenge.textRegistrationWaitingForConfirmation',
        ),
      );
  });

  it('renders waiting for coordinator and donation success messages for company waiting with donation', () => {
    cy.fixture('apiGetRegisterChallengeCompanyWaitingWithDonation.json').then(
      (data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
        });
      },
    );
    cy.dataCy('registration-waiting-for-coordinator-message')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t(
          'register.challenge.textRegistrationWaitingForConfirmation',
        ),
      );
    cy.dataCy('registration-donation-payment-successful')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.textDonationPaymentSuccessful'),
      );
  });

  it('renders no messages for individual no_admission', () => {
    cy.fixture('apiGetRegisterChallengeIndividualNoAdmission.json').then(
      (data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
        });
      },
    );
    // no messages
    cy.get('.q-banner').should('not.exist');
  });

  it('renders waiting for payment message for individual not paid', () => {
    cy.fixture('apiGetRegisterChallengeIndividualNotPaid.json').then((data) => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setRegisterChallengeFromApi(data.results[0]);
        store.setIsPayuTransactionInitiated(true);
      });
    });
    cy.dataCy('registration-waiting-for-payment-confirmation-message')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.textPayuWaitingForPayment'),
      );
  });

  it('renders no messages for individual paid', () => {
    cy.fixture('apiGetRegisterChallengeIndividualPaid.json').then((data) => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setRegisterChallengeFromApi(data.results[0]);
      });
    });
    // no messages
    cy.get('.q-banner').should('not.exist');
  });

  it('renders donation success message for individual paid with donation', () => {
    cy.fixture('apiGetRegisterChallengeIndividualPaidWithDonation.json').then(
      (data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
        });
      },
    );
    cy.dataCy('registration-donation-payment-successful')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.textDonationPaymentSuccessful'),
      );
  });

  it('renders payment failed message for individual unknown', () => {
    cy.fixture('apiGetRegisterChallengeIndividualUnknown.json').then((data) => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setRegisterChallengeFromApi(data.results[0]);
      });
    });
    cy.dataCy('registration-payu-payment-failed')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.textPayuPaymentFailed'),
      );
  });

  it('renders no messages for voucher full', () => {
    cy.fixture('apiGetRegisterChallengeVoucherFull.json').then((data) => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setRegisterChallengeFromApi(data.results[0]);
      });
    });
    // no messages
    cy.get('.q-banner').should('not.exist');
  });

  it('renders donation success message for voucher full with donation', () => {
    cy.fixture('apiGetRegisterChallengeVoucherFullWithDonation.json').then(
      (data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
        });
      },
    );
    cy.dataCy('registration-donation-payment-successful')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.textDonationPaymentSuccessful'),
      );
  });

  it('renders no messages for voucher half', () => {
    cy.fixture('apiGetRegisterChallengeVoucherHalf.json').then((data) => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setRegisterChallengeFromApi(data.results[0]);
      });
    });
    // no messages
    cy.get('.q-banner').should('not.exist');
  });

  it('renders donation success message for voucher half with donation', () => {
    cy.fixture('apiGetRegisterChallengeVoucherHalfWithDonation.json').then(
      (data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
        });
      },
    );
    cy.dataCy('registration-donation-payment-successful')
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('register.challenge.textDonationPaymentSuccessful'),
      );
  });
}
