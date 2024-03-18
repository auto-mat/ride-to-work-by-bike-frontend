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
        'messageRequiredEmailList',
        'messageInvalidEmailList',
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

    it('validates the fields on submit', () => {
      cy.dataCy('form-invite-submit').should('be.visible').click();
      // validate email required
      cy.dataCy('invite-email-addresses')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('onboarding.messageRequiredEmailList'));
      // define addresses to test
      const addressesInvalid = [
        // one address
        'qw123@qw',
        'abc.example.com',
        'a@b@c@example.com',
        'a"b(c)d,e:f;g<h>i[jk]l@em',
        'just"not"right@example.com',
        'this is"notallowed@example.com',
        'this still"not\\allowed@example.com',
        'i.like.underscores@but_they_are_not_allowed_in_this_part',
        // multiple addresses
        'qw123@qw, qw123@qw',
        'qw123@qw, abc.example.com',
        // combination of valid and invalid address
        'simple@example.com, abc.example.com',
        'abc.example.com, simple@example.com',
        // invalid separator
        'simple@example.com; simple@example.com',
        'simple@example.com simple@example.com',
        'simple@example.com - simple@example.com',
        // double separator
        'simple@example.com,, very.common@example.com',
      ];
      // validate invalid emails
      addressesInvalid.forEach((address) => {
        cy.dataCy('invite-email-addresses-input').type(address);
        cy.dataCy('form-invite-submit').click();
        cy.dataCy('invite-email-addresses')
          .find('.q-field__messages')
          .should('be.visible')
          .and('contain', i18n.global.t('onboarding.messageInvalidEmailList'));
        cy.dataCy('invite-email-addresses-input').clear();
      });
      const addressesValid = [
        // single address
        'a@b.c',
        'simple@example.com',
        'very.common@example.com',
        'x@example.com',
        'long.email-address-with-hyphens@and.subdomains.example.com',
        'user.name+tag+sorting@example.com',
        'name/surname@example.com',
        'mailhost!username@example.org',
        'user%example.com@example.org',
        'user-@example.org',
        // combination of valid and addresses
        'a@b.c,simple@example.com',
        'very.common@example.com, x@example.com',
        // long list of addresses
        'long.email-address-with-hyphens@and.subdomains.example.com, user.name+tag+sorting@example.com, name/surname@example.com, mailhost!username@example.org, user%example.com@example.org, user-@example.org',
        // spaces before and after
        ' a@b.c , simple@example.com ',
      ];
      // validate valid emails
      addressesValid.forEach((address) => {
        cy.dataCy('invite-email-addresses-input').type(address);
        cy.dataCy('form-invite-submit').click();
        cy.get('*[data-cy="invite-email-addresses"] .q-field__messages').should(
          'not.exist',
        );
        cy.dataCy('invite-email-addresses-input').clear();
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
