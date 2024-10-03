import { colors } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import EmailConfirmation from 'components/register/EmailConfirmation.vue';
import { i18n } from '../../boot/i18n';
import { useRegisterStore } from '../../stores/register';
import { routesConf } from '../../router/routes_conf';

// colors
const { getPaletteColor, changeAlpha } = colors;
const white = getPaletteColor('white');
const whiteOpacity20 = changeAlpha(white, 0.2);

// selectors
const selectorEmailConfirmation = 'email-confirmation';
const selectorEmailConfirmationTitle = 'email-confirmation-title';
const selectorEmailConfirmationText = 'email-confirmation-text';
const selectorEmailConfirmationWrongEmailHint =
  'email-confirmation-wrong-email-hint';
const selectorEmailConfirmationRegisterLink =
  'email-confirmation-register-link';
const selectorEmailConfirmationGraphics = 'email-confirmation-graphics';
const selectorEmailConfirmationAvatar = 'email-confirmation-avatar';
const selectorEmailConfirmationIcon = 'email-confirmation-icon';

// variables
const fontSizeTitle = 24;
const fontWeightTitle = 700;
const fontSizeText = 14;
const fontWeightText = 400;
const avatarSize = 64;
const iconSize = 40;
const testEmail = 'test@test.cz';

describe('<EmailConfirmation>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'linkRegister',
        'hintWrongEmail',
        'textEmailConfirmation',
        'titleEmailConfirmation',
      ],
      'register.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(EmailConfirmation, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.mount(EmailConfirmation, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorEmailConfirmation).should('be.visible');
    // title
    cy.dataCy(selectorEmailConfirmationTitle)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeTitle}px`)
      .and('have.css', 'font-weight', `${fontWeightTitle}`)
      .and('have.color', white)
      .and('contain', i18n.global.t('register.form.titleEmailConfirmation'));
    // text
    const store = useRegisterStore();
    store.setEmail(testEmail);
    cy.dataCy(selectorEmailConfirmationText)
      .should('be.visible')
      .and('contain', testEmail);
    // check inner html
    cy.dataCy(selectorEmailConfirmationText)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeText}px`)
      .and('have.css', 'font-weight', `${fontWeightText}`)
      .then(($el) => {
        const content = $el.text();
        cy.stripHtmlTags(
          i18n.global.t('register.form.textEmailConfirmation', {
            email: testEmail,
          }),
        ).then((text) => {
          expect(content).to.equal(text);
        });
      });
    // wrong email hint
    cy.dataCy(selectorEmailConfirmationWrongEmailHint)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeText}px`)
      .and('have.css', 'font-weight', `${fontWeightText}`)
      .and('have.color', white)
      .and('contain', i18n.global.t('register.form.hintWrongEmail'));
    // register link
    cy.dataCy(selectorEmailConfirmationRegisterLink)
      .should('be.visible')
      .and('have.css', 'font-size', `${fontSizeText}px`)
      .and('have.css', 'font-weight', `${fontWeightText}`)
      .and('have.color', white)
      .and('contain', i18n.global.t('register.form.linkRegister'))
      .invoke('attr', 'href')
      .should('contain', routesConf['register']['path']);
    // graphics
    cy.dataCy(selectorEmailConfirmationGraphics).should('be.visible');
    // avatar
    cy.dataCy(selectorEmailConfirmationAvatar)
      .should('be.visible')
      .and('have.backgroundColor', whiteOpacity20)
      .invoke('height')
      .should('eq', avatarSize);
    cy.dataCy(selectorEmailConfirmationAvatar)
      .invoke('width')
      .should('eq', avatarSize);
    // icon
    cy.dataCy(selectorEmailConfirmationIcon)
      .should('be.visible')
      .and('have.color', white)
      .invoke('height')
      .should('eq', iconSize);
    cy.dataCy(selectorEmailConfirmationIcon)
      .invoke('width')
      .should('eq', iconSize);
  });
}
