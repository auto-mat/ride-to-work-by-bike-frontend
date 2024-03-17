import { colors } from 'quasar';

import FormInviteFriends from 'components/form/FormInviteFriends.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');

describe('<FormInviteFriends>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonInviteFriends',
        'labelInviteEmailAddresses',
        'labelLanguage',
        'messageRequiredAddresses',
        'textMessage',
        'titleMessage',
      ],
      'onboarding',
      i18n,
    );
    cy.testLanguageStringsInContext(['messageFieldRequired'], 'form', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormInviteFriends, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-invite-friends').should('be.visible');
      cy.dataCy('invite-description')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.css', 'margin-bottom', '24px')
        .and('have.color', grey10);
      cy.dataCy('invite-email-addresses')
        .should('be.visible')
        .and('have.css', 'margin-top', '16px')
        .and('have.css', 'margin-bottom', '16px')
        .find('label[for="invite-email-addresses"]')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('invite-email-addresses-input').should('be.visible');
      cy.dataCy('invite-language')
        .should('be.visible')
        .and('have.css', 'margin-top', '16px')
        .and('have.css', 'margin-bottom', '16px')
        .find('label[for="select-language"]')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
      cy.dataCy('title-message')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', black)
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.titleMessage')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
      cy.dataCy('text-message')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', black)
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.textMessage')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
    });

    it('allows to change the message language', () => {
      cy.dataCy('invite-language-input').select('English');
      cy.dataCy('title-message')
        .should('be.visible')
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.titleMessage', 'en')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
      cy.dataCy('text-message')
        .should('be.visible')
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.textMessage', 'en')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
      cy.dataCy('invite-language-input').select('Slovak');
      cy.dataCy('title-message')
        .should('be.visible')
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.titleMessage', 'sk')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
      cy.dataCy('text-message')
        .should('be.visible')
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.textMessage', 'sk')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
      cy.dataCy('invite-language-input').select('Czech');
      cy.dataCy('title-message')
        .should('be.visible')
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.titleMessage', 'cs')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
      cy.dataCy('text-message')
        .should('be.visible')
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(i18n.global.t('onboarding.textMessage', 'cs')).then(
            (text) => {
              expect(textContent).to.contain(text);
            },
          );
        });
    });

    it('renders columns side-by-side', () => {
      cy.testElementPercentageWidth(cy.dataCy('column-1'), 50);
      cy.testElementPercentageWidth(cy.dataCy('column-2'), 50);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormInviteFriends, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders columns stacked', () => {
      cy.testElementPercentageWidth(cy.dataCy('column-1'), 100);
      cy.testElementPercentageWidth(cy.dataCy('column-2'), 100);
    });
  });
});
