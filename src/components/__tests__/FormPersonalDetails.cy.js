import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import FormPersonalDetails from 'components/form/FormPersonalDetails.vue';
import { i18n } from '../../boot/i18n';
import { routesConf } from '../../router/routes_conf';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import {
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
} from '../../../test/cypress/support/commonTests';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const urlAppDataPrivacyPolicy = rideToWorkByBikeConfig.urlAppDataPrivacyPolicy;
const urlAppDataTermsOfService =
  rideToWorkByBikeConfig.urlAppDataTermsOfService;
const urlRegisterAsCoordinator = routesConf['register_coordinator'].path;

describe('<FormPersonalDetails>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['man', 'woman'], 'global', i18n);
    cy.testLanguageStringsInContext(
      ['hintNickname', 'messageOptionRequired', 'messageTermsRequired'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'hintGender',
        'labelNewsletterAll',
        'labelNewsletterChallenges',
        'labelNewsletterEvents',
        'labelNewsletterMobility',
        'titleGender',
        'titleNewsletter',
      ],
      'form.personalDetails',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(FormPersonalDetails, {
        props: {
          formValues: {
            firstName: 'John',
            lastName: 'Doe',
            nickname: 'John Doe',
            gender: 'male',
            newsletter: ['all'],
            terms: true,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders form field first name', () => {
      cy.dataCy('form-personal-details-first-name').should('be.visible');
    });

    it('renders form field last name', () => {
      cy.dataCy('form-personal-details-last-name').should('be.visible');
    });

    it('renders form field nickname', () => {
      cy.dataCy('form-personal-details-nickname')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
    });

    it('renders radio select gender', () => {
      cy.dataCy('form-personal-details-gender')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
      cy.dataCy('form-personal-details-gender').should(
        'contain',
        i18n.global.t('form.personalDetails.hintGender'),
      );
    });

    it('renders link to register as coordinator', () => {
      cy.dataCy('form-personal-details-register-as-coordinator').should(
        'be.visible',
      );
      cy.dataCy('form-personal-details-register-as-coordinator-text')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.form.hintRegisterAsCoordinator'),
        );
      cy.dataCy('form-personal-details-register-as-coordinator-link')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('register.form.linkRegisterAsCoordinator'),
        )
        .invoke('attr', 'href')
        .should('include', urlRegisterAsCoordinator);
    });

    it('does not render link to register as coordinator if user is organization admin', () => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setIsUserOrganizationAdmin(true);
      });
      cy.dataCy('form-personal-details-register-as-coordinator').should(
        'not.exist',
      );
    });

    it('renders checkbox select newsletter', () => {
      cy.dataCy('form-field-newsletter')
        .should('be.visible')
        .find('label')
        .should('be.visible')
        .and('have.color', grey10)
        .and('have.css', 'font-size', '12px');
    });

    it('renders checkbox terms', () => {
      cy.dataCy('form-personal-details-terms').should('be.visible');
      // default value is false
      cy.dataCy('form-terms-input').should(
        'have.attr',
        'aria-checked',
        'false',
      );
      // test clicking on the privacy policy link
      cy.dataCy('form-terms-link').should('be.visible').click();
      // this click will not change the checkbox value
      cy.dataCy('form-terms-input').should(
        'have.attr',
        'aria-checked',
        'false',
      );
      // test clicking on the terms of service link
      cy.dataCy('form-service-link').should('be.visible').click();
      // this click will not change the checkbox value
      cy.dataCy('form-terms-input').should(
        'have.attr',
        'aria-checked',
        'false',
      );
      // test clicking on the checkbox
      cy.dataCy('form-personal-details-terms')
        .find('.q-checkbox__inner')
        .click();
      // this click will change the checkbox value
      cy.dataCy('form-terms-input').should('have.attr', 'aria-checked', 'true');
    });

    it('renders link to data privacy policy', () => {
      cy.dataCy('form-terms-link')
        .should('be.visible')
        .and('have.attr', 'href', urlAppDataPrivacyPolicy)
        .and('have.attr', 'target', '_blank');
      cy.request({
        url: urlAppDataPrivacyPolicy,
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

    it('renders link to terms of service', () => {
      cy.dataCy('form-service-link')
        .should('be.visible')
        .and('have.attr', 'href', urlAppDataTermsOfService)
        .and('have.attr', 'target', '_blank');
      cy.request({
        url: urlAppDataTermsOfService,
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
});
