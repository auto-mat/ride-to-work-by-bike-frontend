import { colors } from 'quasar';
import ResetPassword from 'components/register/ResetPassword.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { testPasswordInputReveal } from '../../../test/cypress/support/commonTests';

// colors
const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const whiteOpacity = changeAlpha(
  white,
  rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
);

// selectors
const selectorResetPassword = 'reset-password';
const selectorResetPasswordTitle = 'reset-password-title';
const selectorResetPasswordText = 'reset-password-text';
const selectorResetPasswordGraphics = 'reset-password-graphics';
const selectorResetPasswordAvatar = 'reset-password-avatar';
const selectorResetPasswordIcon = 'reset-password-icon';
const selectorFormResetPassword = 'form-reset-password';
const selectorFormResetPasswordInput = 'form-reset-password-input';
const selectorFormResetPasswordIcon = 'form-reset-password-icon';
const selectorFormResetPasswordConfirm = 'form-reset-password-confirm';
const selectorFormResetPasswordConfirmInput =
  'form-reset-password-confirm-input';
const selectorFormResetPasswordConfirmIcon = 'form-reset-password-confirm-icon';
const selectorFormResetPasswordSubmit = 'form-reset-password-submit';

// variables
const fontSizeTitle = 24;
const fontWeightTitle = 700;
const fontSizeText = 14;
const fontWeightText = 400;
const avatarSize = 64;
const iconSize = 40;
const passwordIconSize = 18;

describe('<ResetPassword>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleResetPassword',
        'textResetPassword',
        'labelPassword',
        'labelPasswordConfirm',
        'hintPassword',
        'messagePasswordRequired',
        'messagePasswordStrong',
        'messagePasswordConfirmRequired',
        'messagePasswordConfirmNotMatch',
        'submitResetPassword',
      ],
      'register.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.mount(ResetPassword, {
        props: {},
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.mount(ResetPassword, {
        props: {},
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorResetPassword).should('be.visible');
    // title
    cy.dataCy(selectorResetPasswordTitle)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeTitle}px`)
      .and('have.css', 'font-weight', `${fontWeightTitle}`)
      .and('have.color', white)
      .and('contain', i18n.global.t('register.form.titleResetPassword'));
    // text
    cy.dataCy(selectorResetPasswordText)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeText}px`)
      .and('have.css', 'font-weight', `${fontWeightText}`)
      .then(($el) => {
        const content = $el.text();
        cy.stripHtmlTags(i18n.global.t('register.form.textResetPassword')).then(
          (text) => {
            expect(content).to.contain(text);
          },
        );
      });
    // graphics
    cy.dataCy(selectorResetPasswordGraphics).should('be.visible');
    // avatar
    cy.dataCy(selectorResetPasswordAvatar)
      .should('be.visible')
      .and('have.backgroundColor', whiteOpacity)
      .invoke('height')
      .should('eq', avatarSize);
    cy.dataCy(selectorResetPasswordAvatar)
      .invoke('width')
      .should('eq', avatarSize);
    // icon
    cy.dataCy(selectorResetPasswordIcon)
      .should('be.visible')
      .and('have.color', white)
      .invoke('height')
      .should('eq', iconSize);
    cy.dataCy(selectorResetPasswordIcon).invoke('width').should('eq', iconSize);
  });

  it('renders show/hide icons for password inputs', () => {
    // password
    cy.dataCy(selectorFormResetPasswordIcon)
      .should('contain', 'visibility_off')
      .and('have.color', white);
    cy.dataCy(selectorFormResetPasswordIcon)
      .invoke('height')
      .should('be.equal', passwordIconSize);
    cy.dataCy(selectorFormResetPasswordIcon)
      .invoke('width')
      .should('be.equal', passwordIconSize);
    // password confirm
    cy.dataCy(selectorFormResetPasswordConfirmIcon)
      .should('contain', 'visibility_off')
      .and('have.color', white);
    cy.dataCy(selectorFormResetPasswordConfirmIcon)
      .invoke('height')
      .should('be.equal', passwordIconSize);
    cy.dataCy(selectorFormResetPasswordConfirmIcon)
      .invoke('width')
      .should('be.equal', passwordIconSize);
  });

  it('validates password correctly', () => {
    // test password
    cy.dataCy(selectorFormResetPasswordInput).clear();
    cy.dataCy(selectorFormResetPasswordInput).blur();
    cy.dataCy(selectorFormResetPassword)
      .find('.q-field__messages')
      .should(
        'contain',
        i18n.global.t('register.form.messagePasswordRequired'),
      );
    cy.dataCy(selectorFormResetPasswordInput).type('12345');
    cy.dataCy(selectorFormResetPasswordInput).blur();
    cy.dataCy(selectorFormResetPassword)
      .find('.q-field__messages')
      .should('contain', i18n.global.t('register.form.messagePasswordStrong'));
    cy.dataCy(selectorFormResetPasswordInput).clear();
    cy.dataCy(selectorFormResetPasswordInput).type('123456789');
    cy.dataCy(selectorFormResetPasswordInput).blur();
    cy.dataCy(selectorFormResetPassword)
      .find('.q-field__messages')
      .should('contain', i18n.global.t('register.form.messagePasswordStrong'));
    cy.dataCy(selectorFormResetPasswordInput).clear();
    cy.dataCy(selectorFormResetPasswordInput).type('12345a');
    cy.dataCy(selectorFormResetPasswordInput).blur();
    cy.dataCy(selectorFormResetPassword)
      .find('.q-field__messages')
      .should('contain', i18n.global.t('register.form.hintPassword'));
  });

  it('validates password confirm correctly', () => {
    // fill in password input to be able to test password confirm
    cy.dataCy(selectorFormResetPasswordInput).type('12345a');
    // test password confirm empty
    cy.dataCy(selectorFormResetPasswordConfirmInput).clear();
    cy.dataCy(selectorFormResetPasswordConfirmInput).blur();
    cy.dataCy(selectorFormResetPasswordConfirm)
      .find('.q-field__messages')
      .should(
        'contain',
        i18n.global.t('register.form.messagePasswordConfirmRequired'),
      );
    // test password confirm not matching
    cy.dataCy(selectorFormResetPasswordConfirmInput).type('12345b');
    cy.dataCy(selectorFormResetPasswordConfirmInput).blur();
    cy.dataCy(selectorFormResetPasswordConfirm)
      .find('.q-field__messages')
      .should(
        'contain',
        i18n.global.t('register.form.messagePasswordConfirmNotMatch'),
      );
    // test password confirm matching
    cy.dataCy(selectorFormResetPasswordConfirmInput).clear();
    cy.dataCy(selectorFormResetPasswordConfirmInput).type('12345a');
    cy.dataCy(selectorFormResetPasswordConfirmInput).blur();
    cy.dataCy(selectorFormResetPasswordConfirm)
      .find('.q-field__messages')
      .should('not.exist');
  });

  it('renders submit button', () => {
    cy.dataCy(selectorFormResetPasswordSubmit)
      .should('be.visible')
      .and('have.class', 'full-width')
      .and('have.class', 'q-btn--unelevated')
      .and('have.class', 'q-btn--rounded')
      .and('have.attr', 'type', 'submit')
      .and('contain', i18n.global.t('register.form.submitResetPassword'));
  });

  testPasswordInputReveal(selectorFormResetPassword);
  testPasswordInputReveal(selectorFormResetPasswordConfirm);
}
