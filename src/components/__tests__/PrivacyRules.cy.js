import PrivacyRules from '../global/PrivacyRules.vue';

import { i18n } from '../../boot/i18n';

describe('<PrivacyRules>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'header',
        'subheader',
        'matomoRules',
        'subsubheaderIpAnonymisation',
        'ipAnonymisationRules',
      ],
      'privacy',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(PrivacyRules, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(PrivacyRules, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('header').then(($el) => {
      expect($el.text()).to.equal(i18n.global.t('privacy.header'));
    });
    cy.dataCy('subheader').then(($el) => {
      expect($el.text()).to.equal(i18n.global.t('privacy.subheader'));
    });
    cy.dataCy('subsubheader-matomo').then(($el) => {
      expect($el.text()).to.equal(i18n.global.t('privacy.subsubheaderMatomo'));
    });
    cy.dataCy('matomo-rules').then(($el) => {
      cy.stripHtmlTags(i18n.global.t('privacy.matomoRules')).then((text) => {
        expect($el.text()).to.contains(text);
      });
    });
    cy.dataCy('subsubheader-ip-anonymisation').then(($el) => {
      expect($el.text()).to.equal(
        i18n.global.t('privacy.subsubheaderIpAnonymisation'),
      );
    });
    cy.dataCy('ip-anonymisation-rules').then(($el) => {
      expect($el.text()).to.equal(
        i18n.global.t('privacy.ipAnonymisationRules'),
      );
    });
  });
}
