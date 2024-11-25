import { colors } from 'quasar';
import DeleteAccount from 'components/profile/DeleteAccount.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const negative = getPaletteColor('negative');
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

// selectors
const selectorButton = 'delete-account-button';
const selectorIcon = 'delete-account-icon';
const selectorDialog = 'delete-account-dialog';
const selectorDialogTitle = 'delete-account-dialog-title';
const selectorDialogDescription = 'delete-account-dialog-description';
const selectorDialogCancel = 'delete-account-dialog-cancel';
const selectorDialogDelete = 'delete-account-dialog-delete';
const selectorTitle = 'delete-account-title';

// variables
const iconSize = 18;

describe('<DeleteAccount>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titleDeleteAccount',
        'buttonDeleteAccount',
        'titleDialogDeleteAccount',
        'labelDeleteAccount',
        'labelDeleteAccountDescription',
      ],
      'profile',
      i18n,
    );

    cy.testLanguageStringsInContext(['cancel', 'delete'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(DeleteAccount, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(DeleteAccount, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders delete account section', () => {
    // check title
    cy.dataCy(selectorTitle)
      .should('be.visible')
      .within(() => {
        cy.dataCy('section-heading-title')
          .should('be.visible')
          .and('contain', i18n.global.t('profile.titleDeleteAccount'));
      });
    // check button
    cy.dataCy(selectorButton)
      .should('be.visible')
      .and('contain', i18n.global.t('profile.buttonDeleteAccount'));
    // verify icon
    cy.dataCy(selectorIcon).should('be.visible').and('have.class', 'q-mr-sm');
    cy.dataCy(selectorIcon).invoke('height').should('eq', iconSize);
    cy.dataCy(selectorIcon).invoke('width').should('eq', iconSize);
    // verify button styles
    cy.dataCy(selectorButton)
      .and('have.color', white)
      .and('have.backgroundColor', negative);
  });

  it('shows delete account dialog', () => {
    // click delete button
    cy.dataCy(selectorButton).click();
    // verify dialog appears
    cy.dataCy(selectorDialog).should('be.visible');
    // check dialog title
    cy.dataCy(selectorDialogTitle)
      .should('be.visible')
      .and('contain', i18n.global.t('profile.titleDialogDeleteAccount'));
    // check dialog description
    cy.dataCy(selectorDialogDescription)
      .should('be.visible')
      .and('contain', i18n.global.t('profile.labelDeleteAccountDescription'));
    // verify cancel button
    cy.dataCy(selectorDialogCancel)
      .should('be.visible')
      .and('contain', i18n.global.t('global.cancel'))
      .and('have.color', primary);
    // verify delete button
    cy.dataCy(selectorDialogDelete)
      .should('be.visible')
      .and('contain', i18n.global.t('global.delete'))
      .and('have.color', white)
      .and('have.backgroundColor', negative);
  });

  it('closes dialog on cancel', () => {
    // open dialog
    cy.dataCy(selectorButton).click();
    cy.dataCy(selectorDialog).should('be.visible');
    // click cancel button
    cy.dataCy(selectorDialogCancel).click();
    // verify dialog is closed
    cy.dataCy(selectorDialog).should('not.exist');
  });
}
