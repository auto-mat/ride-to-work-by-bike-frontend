import { computed } from 'vue';
import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import FormRegisterCoordinator from 'components/register/FormRegisterCoordinator.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import {
  fillFormRegisterCoordinator,
  httpSuccessfullStatus,
  interceptOrganizationsApi,
  interceptRegisterCoordinatorApi,
  waitForOrganizationsApi,
} from '../../../test/cypress/support/commonTests';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { OrganizationType } from '../../components/types/Organization';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormRegisterCoordinator>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'title',
        'labelFirstName',
        'labelLastName',
        'labelJobTitle',
        'labelJobTitleShort',
        'labelEmail',
        'labelPhone',
        'labelPassword',
        'labelPasswordConfirm',
        'labelResponsibility',
        'labelPrivacyConsent',
        'linkPrivacyConsent',
        'buttonSubmit',
        'messageFieldRequired',
        'messageEmailInvalid',
        'messagePhoneInvalid',
        'messagePasswordStrong',
        'messagePasswordConfirmNotMatch',
        'hintPassword',
      ],
      'register.coordinator.form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['labelOrganizationType', 'labelSchoolShort', 'labelFamilyShort'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['apiMessageError', 'apiMessageErrorWithMessage', 'apiMessageSuccess'],
      'registerCoordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      // intercept organizations API call (before mounting component)
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      // intercept register coordinator API call (before mounting component)
      interceptRegisterCoordinatorApi(rideToWorkByBikeConfig, i18n);
      cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
        (response) => {
          cy.interceptIsUserOrganizationAdminGetApi(
            rideToWorkByBikeConfig,
            i18n,
            response,
          );
        },
      );
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('register-coordinator-form-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', i18n.global.t('register.coordinator.form.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('register.coordinator.form.title'),
            );
          });
      });
    });

    it('renders first name field', () => {
      cy.dataCy('form-register-coordinator-first-name').should('be.visible');
    });

    it('renders last name field', () => {
      cy.dataCy('form-register-coordinator-last-name').should('be.visible');
    });

    it('renders company field', () => {
      // input label
      cy.dataCy('form-register-coordinator-company').should('be.visible');
      cy.dataCy('form-register-coordinator-company').should(
        'contain',
        i18n.global.t('form.labelCompanyForCoordinator'),
      );
    });

    it('renders job title field', () => {
      // input label
      cy.dataCy('form-register-coordinator-job-title').should('be.visible');
    });

    it('renders correct company field label based on organization type', () => {
      // select organization type
      cy.dataCy('form-organization-type').within(() => {
        cy.contains(i18n.global.t('form.labelCompanyShort')).click();
      });
      // organization field label
      cy.dataCy('form-register-coordinator-company').should(
        'contain',
        i18n.global.t('form.labelCompanyForCoordinator'),
      );
      // select school organization type
      cy.dataCy('form-organization-type').within(() => {
        cy.contains(i18n.global.t('form.labelSchoolShort')).click();
      });
      // organization field label
      cy.dataCy('form-register-coordinator-company').should(
        'contain',
        i18n.global.t('form.labelSchoolForCoordinator'),
      );
      // select family organization type
      cy.dataCy('form-organization-type').within(() => {
        cy.contains(i18n.global.t('form.labelFamilyShort')).click();
      });
      // organization field label
      cy.dataCy('form-register-coordinator-company').should(
        'contain',
        i18n.global.t('form.labelFamilyForCoordinator'),
      );
    });

    it('renders phone field', () => {
      // input label
      cy.dataCy('form-register-coordinator-phone')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'have.text',
          i18n.global.t('register.coordinator.form.labelPhone'),
        );
      // input wrapper
      cy.dataCy('form-register-coordinator-phone')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input
      cy.dataCy('form-register-coordinator-phone')
        .find('input')
        .should('be.visible');
    });

    it('renders checkbox responsibility', () => {
      cy.dataCy('form-register-coordinator-responsibility')
        .should('be.visible')
        .find('.q-checkbox__label')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.labelResponsibility'),
        );
    });

    it('renders checkbox terms', () => {
      cy.dataCy('form-register-coordinator-terms')
        .should('be.visible')
        .find('.q-checkbox__label')
        .should('be.visible')
        .and('have.color', grey10)
        .and(
          'contain',
          i18n.global.t('register.coordinator.form.labelPrivacyConsent'),
        );
    });

    it('validates checkboxes correctly', () => {
      // wait for organizations API call
      cy.fixture('formFieldCompany').then((formFieldCompany) => {
        cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
          waitForOrganizationsApi(formFieldCompany, formFieldCompanyNext);
        });
      });
      // fill in other parts of the form to be able to test password
      fillFormRegisterCoordinator();
      // test responsibility checkbox unchecked
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      // responsibility - required message shown
      cy.contains(
        i18n.global.t(
          'register.coordinator.form.messageResponsibilityRequired',
        ),
      ).should('be.visible');
      // test responsibility checkbox checked
      cy.dataCy('form-register-coordinator-responsibility')
        .find('.q-checkbox')
        .click();
      // responsibility - required message hidden
      cy.contains(
        i18n.global.t(
          'register.coordinator.form.messageResponsibilityRequired',
        ),
      ).should('not.exist');
      // test terms checkbox unchecked
      cy.dataCy('form-register-coordinator-submit')
        .should('be.visible')
        .click();
      // terms - required message shown
      cy.contains(
        i18n.global.t('register.coordinator.form.messageTermsRequired'),
      ).should('be.visible');
      // test terms checkbox checked
      cy.dataCy('form-register-coordinator-terms').find('.q-checkbox').click();
      // terms - required message hidden
      cy.contains(
        i18n.global.t('register.coordinator.form.messageTermsRequired'),
      ).should('not.exist');
    });

    it('submits form correctly', () => {
      cy.fixture('registerResponse').then(() => {
        // wait for organizations API call
        cy.fixture('formFieldCompany').then((formFieldCompany) => {
          cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
            waitForOrganizationsApi(formFieldCompany, formFieldCompanyNext);
          });
        });
        // fill in the form
        fillFormRegisterCoordinator();
        // check responsibility checkbox
        cy.dataCy('form-register-coordinator-responsibility')
          .find('.q-checkbox')
          .click();
        // check terms checkbox
        cy.dataCy('form-register-coordinator-terms')
          .find('.q-checkbox')
          .click();
        // submit form
        cy.dataCy('form-register-coordinator-submit').click();
        // wait for API call to finish
        cy.wait('@registerCoordinator')
          .then((interception) => {
            cy.fixture('apiPostRegisterCoordinatorRequest').then(
              (registerRequestBody) => {
                expect(interception.request.body).to.deep.equal(
                  registerRequestBody,
                );
                expect(interception.response.statusCode).to.equal(
                  httpSuccessfullStatus,
                );
              },
            );
          })
          .then(() => {
            // check success message
            cy.contains(
              i18n.global.t('registerCoordinator.apiMessageSuccess'),
            ).should('be.visible');
            // check user coordinator status in `registerChallenge` store
            cy.wrap(useRegisterChallengeStore()).then(
              (registerChallengeStore) => {
                const isUserOrganizationAdmin = computed(
                  () => registerChallengeStore.getIsUserOrganizationAdmin,
                );
                cy.wrap(isUserOrganizationAdmin).its('value').should('be.true');
              },
            );
          });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
