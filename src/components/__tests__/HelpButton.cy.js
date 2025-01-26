import { colors } from 'quasar';
import HelpButton from '../global/HelpButton.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');

// selectors
const classSelectorQCard = '.q-card';
const classSelectorQCardSection = '.q-card__section';
const classSelectorQExpansionItem = '.q-expansion-item';
const classSelectorQFieldControl = '.q-field__control';
const classSelectorQFieldMessages = '.q-field__messages';
const selectorButtonBackToHelp = 'button-back-to-help';
const selectorButtonContact = 'button-contact';
const selectorButtonGuide = 'button-guide';
const selectorButtonHelp = 'button-help';
const selectorContactFormEmail = 'contact-form-email';
const selectorContactFormMessageInput = 'contact-form-message-input';
const selectorContactFormMessage = 'contact-form-message';
const selectorContactFormSubject = 'contact-form-subject';
const selectorContactFormSubmit = 'contact-form-submit';
const selectorCustomHelpButton = 'custom-help-button';
const selectorDialogBody = 'dialog-body';
const selectorDialogHeader = 'dialog-header';
const selectorDialogHelp = 'dialog-help';
const selectorIconHelp = 'icon-help';
const selectorListFaqList = 'list-faq-list';
const selectorTitleGuide = 'title-guide';
const selectorTitleSent = 'title-sent';
const selectorTextSent = 'text-sent';

// variables
const customButtonText = 'Custom help';
const formContactEmail = 'test.user@example.com';
const formContactMessage = 'what is the minimum distance to ride to work?';
const helpButtonFontSize = '15px';
const helpButtonSize = 45;
const iconHelpSize = 38;
const modalDialogWidth = 560;
const paddingZero = '0px';

describe('<HelpButton>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.help', i18n);
  });

  context.skip('button grey', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    defaultButtonTests();
    modalTests();
  });

  context.skip('mobile', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    defaultButtonTests();
    modalTests();
  });

  // Add this new context after the existing contexts
  context.skip('custom button slot', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        slots: {
          button: `
            <button @click.prevent="openDialog" data-cy="${selectorCustomHelpButton}">${customButtonText}</button>
          `,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders and functions with a custom button in the slot', () => {
      // custom button
      cy.dataCy(selectorCustomHelpButton)
        .should('be.visible')
        .and('contain.text', customButtonText);
      // default button not rendered
      cy.dataCy(selectorButtonHelp).should('not.exist');
      // opens dialog
      cy.dataCy(selectorCustomHelpButton).click();
      cy.dataCy(selectorDialogHelp).should('be.visible');
      // dialog content
      cy.dataCy(selectorDialogHeader)
        .find('h3')
        .should('be.visible')
        .and('contain', i18n.global.t('index.help.titleStateDefault'));
    });
  });
});

function defaultButtonTests() {
  it('renders help button', () => {
    cy.window().then(() => {
      cy.dataCy(selectorButtonHelp)
        .should('be.visible')
        .and('have.css', 'font-size', helpButtonFontSize)
        .and('have.css', 'font-weight', '500')
        .and('have.backgroundColor', white)
        .and('have.css', 'border-radius', '50%');
      cy.dataCy(selectorButtonHelp)
        .invoke('height')
        .should('be.equal', helpButtonSize);
      cy.dataCy(selectorButtonHelp)
        .invoke('width')
        .should('be.equal', helpButtonSize);
    });
  });

  it('renders help icon', () => {
    cy.dataCy(selectorIconHelp).and('have.color', primary);
    cy.dataCy(selectorIconHelp).invoke('height').should('be.eq', iconHelpSize);
    cy.dataCy(selectorIconHelp).invoke('width').should('be.eq', iconHelpSize);
  });
}

function modalTests() {
  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.dataCy(selectorButtonHelp).should('be.visible');
      cy.dataCy(selectorButtonHelp).click();
      cy.dataCy(selectorDialogHelp).should('be.visible');
      cy.dataCy(selectorDialogBody)
        .should('be.visible')
        .and('have.css', 'padding-left', paddingZero)
        .and('have.css', 'padding-right', paddingZero)
        .invoke('width')
        .should('be.lte', modalDialogWidth);
    });
  });

  it('renders modal title', () => {
    cy.window().then(() => {
      cy.dataCy(selectorButtonHelp).should('be.visible');
      cy.dataCy(selectorButtonHelp).click();
      cy.dataCy(selectorDialogHeader)
        .find('h3')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('contain', i18n.global.t('index.help.titleStateDefault'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('index.help.titleStateDefault'),
          );
        });
    });
  });

  it('renders guide section with title and button', () => {
    cy.window().then(() => {
      cy.dataCy(selectorButtonHelp).should('be.visible');
      cy.dataCy(selectorButtonHelp).click();
      // TODO: Find if you can calculate height exact height of the sections
      cy.dataCy(selectorDialogBody).scrollTo(0, 1060);
      cy.dataCy(selectorTitleGuide)
        .should('be.visible')
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('contain', i18n.global.t('index.help.titleGuide'))
        .then(($title) => {
          expect($title.text()).to.equal(
            i18n.global.t('index.help.titleGuide'),
          );
        });
      cy.dataCy(selectorButtonGuide)
        .should('be.visible')
        .and('contain.text', i18n.global.t('index.help.buttonGuide'))
        .then(($button) => {
          expect($button.text()).to.equal(
            i18n.global.t('index.help.buttonGuide'),
          );
        });
    });
  });

  it('allows user to display help dialog and read all FAQ items', () => {
    cy.dataCy(selectorButtonHelp).should('be.visible').click();
    cy.dataCy(selectorDialogHelp).should('be.visible');
    cy.dataCy(selectorListFaqList)
      .find(classSelectorQCard)
      .each(($element) => {
        cy.wrap($element).should('not.be.visible');
      });
    cy.dataCy(selectorListFaqList)
      .find(classSelectorQExpansionItem)
      .each(($element) => {
        cy.wrap($element).should('be.visible');
        cy.wrap($element).click();
        cy.wrap($element)
          .find(classSelectorQCardSection)
          .should('be.visible')
          .and('not.be.empty');
      });
  });

  it('allows user to display and submit contact form', () => {
    cy.dataCy(selectorButtonHelp).should('be.visible').click();
    cy.dataCy(selectorDialogHelp).should('be.visible');
    cy.dataCy(selectorDialogBody).scrollTo(0, 1200);
    cy.dataCy(selectorButtonContact).should('be.visible').click();
    // test width for contact form state
    cy.dataCy(selectorDialogBody)
      .should('be.visible')
      .and('have.css', 'padding-left', paddingZero)
      .and('have.css', 'padding-right', paddingZero)
      .invoke('width')
      .should('be.lte', modalDialogWidth);
    cy.dataCy(selectorDialogHelp).find('h3').should('be.visible');
    cy.dataCy(selectorContactFormSubject)
      .find('input')
      .should('be.visible')
      .type('question');
    cy.dataCy(selectorContactFormMessageInput)
      .should('be.visible')
      .type(formContactMessage);
    cy.dataCy(selectorContactFormEmail)
      .find('input')
      .should('be.visible')
      .type(formContactEmail);
    cy.dataCy(selectorContactFormEmail).find('input').blur();
    cy.dataCy(selectorContactFormSubmit).should('be.visible').click();
    // should show success screen
    cy.dataCy(selectorTitleSent)
      .should('be.visible')
      .and('have.css', 'font-size', '24px')
      .and('have.css', 'font-weight', '700')
      .and('contain', i18n.global.t('index.help.titleSent'));
    cy.dataCy(selectorTextSent)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(
          i18n.global.t('index.help.textSent', {
            email: formContactEmail,
          }),
        ).then((text) => {
          expect(textContent).to.contain(text);
        });
      });
    cy.dataCy(selectorButtonBackToHelp)
      .should('be.visible')
      .and('contain', i18n.global.t('index.help.buttonBackToHelp'));
  });

  it('validates contact form if there are errors', () => {
    cy.dataCy(selectorButtonHelp).last().should('be.visible').click();
    cy.dataCy(selectorDialogHeader).should('be.visible');
    cy.dataCy(selectorDialogBody).scrollTo(0, 1200);
    cy.dataCy(selectorButtonContact).should('be.visible').click();
    cy.dataCy(selectorDialogHeader).find('h3').should('be.visible');
    cy.dataCy(selectorDialogBody).scrollTo('bottom', {
      ensureScrollable: false,
    });
    cy.dataCy(selectorContactFormSubmit).should('be.visible').click();
    cy.dataCy(selectorContactFormSubject)
      .find(classSelectorQFieldMessages)
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('index.contact.subject'),
        }),
      );
    cy.dataCy(selectorContactFormSubject)
      .find(classSelectorQFieldControl)
      .should('have.class', 'text-negative');
    cy.dataCy(selectorDialogBody).scrollTo('top', { ensureScrollable: false });
    cy.dataCy(selectorContactFormSubject)
      .find('input')
      .should('be.visible')
      .type('question');
    cy.dataCy(selectorContactFormSubject).find('input').blur();
    cy.dataCy(selectorContactFormSubject)
      .find(classSelectorQFieldMessages)
      .should('be.empty');
    cy.dataCy(selectorContactFormSubject)
      .find(classSelectorQFieldControl)
      .should('not.have.class', 'text-negative');
    cy.dataCy(selectorDialogBody).scrollTo('bottom', {
      ensureScrollable: false,
    });
    cy.dataCy(selectorContactFormSubmit).should('be.visible').click();
    cy.dataCy(selectorDialogBody).scrollTo('top', { ensureScrollable: false });
    cy.dataCy(selectorContactFormMessage)
      .find(classSelectorQFieldMessages)
      .should('be.visible')
      .and('contain', i18n.global.t('index.contact.messageRequired'));
    cy.dataCy(selectorContactFormMessage)
      .find(classSelectorQFieldControl)
      .should('have.class', 'text-negative');
    cy.dataCy(selectorContactFormMessageInput)
      .should('be.visible')
      .type(formContactMessage);
    cy.dataCy(selectorDialogBody).scrollTo('bottom', {
      ensureScrollable: false,
    });
    cy.dataCy(selectorContactFormSubmit).should('be.visible').click();
    cy.dataCy(selectorContactFormEmail)
      .find(classSelectorQFieldMessages)
      .should('be.visible')
      .and(
        'contain',
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('form.labelEmail'),
        }),
      );
    cy.dataCy(selectorContactFormEmail)
      .find(classSelectorQFieldControl)
      .should('have.class', 'text-negative');
  });
}
