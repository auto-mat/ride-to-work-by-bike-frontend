import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import EmailVerification from 'components/register/EmailVerification.vue';
import { i18n } from '../../boot/i18n';
import { useRegisterStore } from '../../stores/register';
import { routesConf } from '../../router/routes_conf';

// colors
const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const whiteOpacity20 = changeAlpha(white, 0.2);

// selectors
const selectorEmailVerification = 'email-verification';
const selectorEmailVerificationTitle = 'email-verification-title';
const selectorEmailVerificationText = 'email-verification-text';
const selectorEmailVerificationWrongEmailHint =
  'email-verification-wrong-email-hint';
const selectorEmailVerificationRegisterLink =
  'email-verification-register-link';
const selectorEmailVerificationGraphics = 'email-verification-graphics';
const selectorEmailVerificationAvatar = 'email-verification-avatar';
const selectorEmailVerificationIcon = 'email-verification-icon';

// variables
const fontSizeTitle = 24;
const fontWeightTitle = 700;
const fontSizeText = 14;
const fontWeightText = 400;
const avatarSize = 64;
const iconSize = 40;
const testEmail = 'test@test.cz';

describe('<EmailVerification>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'linkRegister',
        'hintWrongEmail',
        'textEmailVerification',
        'titleEmailVerification',
      ],
      'register.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(EmailVerification, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(EmailVerification, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorEmailVerification).should('be.visible');
    // title
    cy.dataCy(selectorEmailVerificationTitle)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeTitle}px`)
      .and('have.css', 'font-weight', `${fontWeightTitle}`)
      .and('have.color', white)
      .and('contain', i18n.global.t('register.form.titleEmailVerification'));
    // text
    const store = useRegisterStore();
    store.setEmail(testEmail);
    cy.dataCy(selectorEmailVerificationText)
      .should('be.visible')
      .and('contain', testEmail);
    // check inner html
    cy.dataCy(selectorEmailVerificationText)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeText}px`)
      .and('have.css', 'font-weight', `${fontWeightText}`)
      .then(($el) => {
        const content = $el.text();
        cy.stripHtmlTags(
          i18n.global.t('register.form.textEmailVerification', {
            email: testEmail,
          }),
        ).then((text) => {
          expect(content).to.equal(text);
        });
      });
    // wrong email hint
    cy.dataCy(selectorEmailVerificationWrongEmailHint)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeText}px`)
      .and('have.css', 'font-weight', `${fontWeightText}`)
      .and('have.color', white)
      .and('contain', i18n.global.t('register.form.hintWrongEmail'));
    // register link
    cy.dataCy(selectorEmailVerificationRegisterLink)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeText}px`)
      .and('have.css', 'font-weight', `${fontWeightText}`)
      .and('have.color', white)
      .and('contain', i18n.global.t('register.form.linkRegister'))
      .invoke('attr', 'href')
      .should('contain', routesConf['register']['path']);
    // graphics
    cy.dataCy(selectorEmailVerificationGraphics).should('be.visible');
    // avatar
    cy.dataCy(selectorEmailVerificationAvatar)
      .should('be.visible')
      .and('have.backgroundColor', whiteOpacity20)
      .invoke('height')
      .should('eq', avatarSize);
    cy.dataCy(selectorEmailVerificationAvatar)
      .invoke('width')
      .should('eq', avatarSize);
    // icon
    cy.dataCy(selectorEmailVerificationIcon)
      .should('be.visible')
      .and('have.color', white)
      .invoke('height')
      .should('eq', iconSize);
    cy.dataCy(selectorEmailVerificationIcon)
      .invoke('width')
      .should('eq', iconSize);
  });
}
