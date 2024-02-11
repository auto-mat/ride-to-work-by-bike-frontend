import { colors } from 'quasar';
import FormFieldCompanyAddress from 'components/form/FormFieldCompanyAddress.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldCompanyAddress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['messageNoResult', 'labelAddress'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'buttonAddAddress',
        'buttonAddSubdivision',
        'hintAddress',
        'labelAddress',
        'titleAddAddress',
      ],
      'form.company',
      i18n,
    );
    cy.testLanguageStringsInContext(['discard'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldCompanyAddress, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-company-address').should('be.visible');
      // label
      cy.dataCy('form-company-address-label')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10)
        .and('have.text', i18n.global.t('form.company.labelAddress'));
      // input
      cy.dataCy('form-company-address').find('.q-select').should('be.visible');
      // hint
      cy.dataCy('form-company-address')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.hintAddress'));
      cy.dataCy('button-add-address').should('be.visible');
    });

    it('allows user to select option', () => {
      cy.dataCy('form-company-address').find('.q-select').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      // test selected option
      cy.dataCy('form-company-address')
        .find('input')
        .invoke('val')
        .should('eq', 'Address 1');
    });

    it('validates address field correctly', () => {
      cy.dataCy('form-company-address').find('input').focus();
      cy.dataCy('form-company-address').find('input').blur();
      cy.dataCy('form-company-address')
        .find('.q-field__messages')
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelAddress'),
          }),
        );
      cy.dataCy('form-company-address').find('input').click();
      // select option
      cy.get('.q-menu')
        .should('be.visible')
        .within(() => {
          cy.get('.q-item').first().click();
        });
      cy.dataCy('form-company-address')
        .find('.q-field__messages')
        .should(
          'not.contain',
          i18n.global.t('form.messageFieldRequired', {
            fieldName: i18n.global.t('form.labelAddress'),
          }),
        );
    });

    it('renders dialog for adding a new address', () => {
      cy.dataCy('button-add-address').click();
      cy.dataCy('dialog-add-address').should('be.visible');
      cy.dataCy('dialog-add-address')
        .find('h3')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('contain', i18n.global.t('form.company.titleAddAddress'));
      cy.dataCy('dialog-button-cancel')
        .should('be.visible')
        .and('have.text', i18n.global.t('navigation.discard'));
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('have.text', i18n.global.t('form.company.buttonAddSubdivision'));
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldCompanyAddress, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('renders input and button in a stacked layout', () => {
      cy.testElementPercentageWidth(cy.dataCy('col-input'), 100);
      cy.testElementPercentageWidth(cy.dataCy('col-button'), 100);
    });
  });
});
