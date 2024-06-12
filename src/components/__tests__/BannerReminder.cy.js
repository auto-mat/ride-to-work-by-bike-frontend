import BannerReminder from 'components/global/BannerReminder.vue';
import { i18n } from '../../boot/i18n';

describe('<BannerReminder>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonBannerReminderConfirm',
        'buttonBannerReminderDismiss',
        'textBannerReminder',
      ],
      'coordinator',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BannerReminder, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerReminder, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('banner-reminder').should('be.visible');
    cy.dataCy('banner-text')
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('contain', i18n.global.t('coordinator.textBannerReminder'));
    cy.dataCy('banner-button-dismiss')
      .should('be.visible')
      .and('contain', i18n.global.t('coordinator.buttonBannerReminderDismiss'));
    cy.dataCy('banner-button-confirm')
      .should('be.visible')
      .and('contain', i18n.global.t('coordinator.buttonBannerReminderConfirm'));
  });
}
