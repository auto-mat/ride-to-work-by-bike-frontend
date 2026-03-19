import PrivacyLink from '../global/PrivacyLink.vue';

import { i18n } from '../../boot/i18n';

describe('<PrivacyLink>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['header'], 'privacy', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(PrivacyLink, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(PrivacyLink, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('privacy-link').should('be.visible').click();
  });
}
