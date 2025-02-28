import { createPinia, setActivePinia } from 'pinia';
import RegisterChallengePaymentMessages from 'components/register/RegisterChallengePaymentMessages.vue';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { i18n } from '../../boot/i18n';

describe('<RegisterChallengePaymentMessages>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'textDonationPaymentSuccessful',
        'textPayuPaymentFailed',
        'textPayuWaitingForPayment',
        'textRegistrationWaitingForConfirmation',
        'textRegistrationWaitingForConfirmationNoCoordinator',
        'textRegistrationWaitingForCoordinator',
        'textYourCoordinator',
      ],
      'register.challenge',
      i18n,
    );
  });

  context('payment step', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(RegisterChallengePaymentMessages, {
        props: {
          isPaymentStep: true,
        },
      });
      cy.viewport('macbook-16');
    });

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
      cy.dataCy('registration-waiting-for-confirmation')
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
      cy.dataCy('registration-waiting-for-confirmation')
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
      cy.fixture('apiGetRegisterChallengeIndividualNotPaid.json').then(
        (data) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            store.setRegisterChallengeFromApi(data.results[0]);
            store.setIsPayuTransactionInitiated(true);
          });
        },
      );
      cy.dataCy('registration-payu-waiting-for-payment')
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
      cy.fixture('apiGetRegisterChallengeIndividualUnknown.json').then(
        (data) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            store.setRegisterChallengeFromApi(data.results[0]);
          });
        },
      );
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
  });

  context('summary step', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(RegisterChallengePaymentMessages, {
        props: {
          isPaymentStep: false,
        },
      });
    });

    it('renders message waiting for company coordinator approval with name and email', () => {
      cy.fixture('apiGetMyOrganizationAdmin.json').then((data) => {
        cy.interceptMyOrganizationAdminGetApi(
          rideToWorkByBikeConfig,
          i18n,
          data,
        );
      });
      cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then((data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
          store.setHasOrganizationAdmin(true);
        });
      });
      // wait for my organization admin API call
      cy.waitForMyOrganizationAdminGetApi();
      // check that the message is visible
      cy.fixture('apiGetMyOrganizationAdmin.json').then((data) => {
        cy.dataCy('registration-waiting-for-coordinator')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t(
              'register.challenge.textRegistrationWaitingForCoordinator',
            ),
          );
        cy.dataCy('registration-coordinator-details')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('register.challenge.textYourCoordinator'),
          )
          .and('contain', data.organization_admin[0].admin_name)
          .and('contain', data.organization_admin[0].admin_email);
      });
    });

    it('renders message waiting for company coordinator approval and hides name and email if not available', () => {
      cy.fixture('apiGetMyOrganizationAdminEmpty.json').then((data) => {
        cy.interceptMyOrganizationAdminGetApi(
          rideToWorkByBikeConfig,
          i18n,
          data,
        );
      });
      cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then((data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
          store.setHasOrganizationAdmin(true);
        });
      });
      // wait for my organization admin API call
      cy.fixture('apiGetMyOrganizationAdminEmpty.json').then((data) => {
        cy.waitForMyOrganizationAdminGetApi(data);
      });
      // check that the message is visible
      cy.dataCy('registration-waiting-for-coordinator')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t(
            'register.challenge.textRegistrationWaitingForCoordinator',
          ),
        )
        .and(
          'not.contain',
          i18n.global.t('register.challenge.textYourCoordinator'),
        );
      cy.dataCy('registration-coordinator-details').should('not.exist');
    });

    it('renders message company has no coordinator', () => {
      cy.fixture('apiGetRegisterChallengeCompanyWaiting.json').then((data) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setRegisterChallengeFromApi(data.results[0]);
          store.setHasOrganizationAdmin(false);
        });
      });
      cy.dataCy('registration-waiting-for-confirmation-no-coordinator')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t(
            'register.challenge.textRegistrationWaitingForConfirmationNoCoordinator',
          ),
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

    it('renders no messages for individual not paid', () => {
      cy.fixture('apiGetRegisterChallengeIndividualNotPaid.json').then(
        (data) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            store.setRegisterChallengeFromApi(data.results[0]);
            store.setIsPayuTransactionInitiated(true);
          });
        },
      );
      // no messages
      cy.get('.q-banner').should('not.exist');
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

    it('renders no messages for individual paid with donation', () => {
      cy.fixture('apiGetRegisterChallengeIndividualPaidWithDonation.json').then(
        (data) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            store.setRegisterChallengeFromApi(data.results[0]);
          });
        },
      );
      // no messages
      cy.get('.q-banner').should('not.exist');
    });

    it('renders no messages for individual unknown', () => {
      cy.fixture('apiGetRegisterChallengeIndividualUnknown.json').then(
        (data) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            store.setRegisterChallengeFromApi(data.results[0]);
          });
        },
      );
      // no messages
      cy.get('.q-banner').should('not.exist');
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

    it('renders no messages for voucher full with donation', () => {
      cy.fixture('apiGetRegisterChallengeVoucherFullWithDonation.json').then(
        (data) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            store.setRegisterChallengeFromApi(data.results[0]);
          });
        },
      );
      // no messages
      cy.get('.q-banner').should('not.exist');
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

    it('renders no messages for voucher half with donation', () => {
      cy.fixture('apiGetRegisterChallengeVoucherHalfWithDonation.json').then(
        (data) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            store.setRegisterChallengeFromApi(data.results[0]);
          });
        },
      );
      // no messages
      cy.get('.q-banner').should('not.exist');
    });
  });
});
