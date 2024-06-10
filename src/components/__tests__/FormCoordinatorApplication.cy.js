import FormCoordinatorApplication from 'components/form/FormCoordinatorApplication.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { challengeMonth } = rideToWorkByBikeConfig;

describe('<FormCoordinatorApplication>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelYourPosition',
        'labelYourPhone',
        'labelCoordinatorResponsibility',
        'labelPrivacyConsent',
        'linkPrivacyConsent',
        'buttonCoordinatorApplication',
        'labelTermsChallenge.may',
        'labelTermsChallenge.september',
        'labelTermsChallenge.october',
      ],
      'form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormCoordinatorApplication, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormCoordinatorApplication, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('form-coordinator-application').should('be.visible');
    // input position
    cy.dataCy('form-coordinator-position')
      .should('be.visible')
      .find('label')
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelYourPosition'));
    // input phone
    cy.dataCy('form-coordinator-phone')
      .should('be.visible')
      .find('label')
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelYourPhone'));
    // checkbox responsibility
    cy.dataCy('form-coordinator-responsibility')
      .should('be.visible')
      .find('.q-checkbox__label')
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelCoordinatorResponsibility'));
    // checkbox terms
    cy.dataCy('form-coordinator-terms')
      .should('be.visible')
      .find('.q-checkbox__label')
      .should('be.visible')
      .and('contain', i18n.global.t('form.labelPrivacyConsent'))
      .and('contain', i18n.global.t('form.linkPrivacyConsent'))
      .and(
        'contain',
        i18n.global.t(`form.labelTermsChallenge.${challengeMonth}`),
      );
    // submit button
    cy.dataCy('form-coordinator-submit')
      .should('be.visible')
      .and('contain', i18n.global.t('form.buttonCoordinatorApplication'));
  });
}
