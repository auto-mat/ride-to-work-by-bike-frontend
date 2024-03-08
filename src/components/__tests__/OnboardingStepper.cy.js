import OnboardingStepper from 'components/onboarding/OnboardingStepper.vue';
import { i18n } from '../../boot/i18n';

describe('<OnboardingStepper>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(OnboardingStepper, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('onboarding-stepper').should('be.visible');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(OnboardingStepper, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
