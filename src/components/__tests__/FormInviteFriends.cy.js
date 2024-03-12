import { colors } from 'quasar';

import FormInviteFriends from 'components/form/FormInviteFriends.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
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
