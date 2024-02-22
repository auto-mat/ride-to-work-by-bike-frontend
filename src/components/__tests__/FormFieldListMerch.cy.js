import { colors } from 'quasar';
import FormFieldListMerch from 'components/form/FormFieldListMerch.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey8 = getPaletteColor('grey-8');
const grey10 = getPaletteColor('grey-10');

describe('<FormFieldListMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelNoMerch', 'hintNoMerch'],
      'form.merch',
      i18n,
    );
    cy.testLanguageStringsInContext(['male', 'female'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('no-merch-label')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey10);
      cy.dataCy('no-merch-hint')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .and('have.color', grey8);
      // component is visible
      cy.dataCy('list-merch').should('be.visible');
      // female cards are visible
      cy.dataCy('form-card-merch-female').should('be.visible');
      // tabs are visible
      cy.dataCy('list-merch-tab-female').should('be.visible');
      cy.dataCy('list-merch-tab-male').should('be.visible');
    });

    it('should render 3 cards in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        33,
      );
    });

    it('allows to hide merch options', () => {
      cy.dataCy('no-merch').click();
      cy.dataCy('list-merch').should('not.be.visible');
      cy.dataCy('no-merch').click();
      cy.dataCy('list-merch').should('be.visible');
    });

    it('allows to switch between tabs', () => {
      cy.dataCy('list-merch-tab-male').click();
      cy.dataCy('form-card-merch-female').should('not.exist');
      cy.dataCy('form-card-merch-male').should('be.visible');
      cy.dataCy('list-merch-tab-female').click();
      cy.dataCy('form-card-merch-female').should('be.visible');
      cy.dataCy('form-card-merch-male').should('not.exist');
    });

    it('allows user to select merch option (heading click)', () => {
      cy.fixture('listMerch').then((cards) => {
        // open dialog
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="form-card-merch-link"]')
          .click();
        cy.dataCy('dialog-merch')
          .should('be.visible')
          .and('contain', cards[0].title)
          .and('contain', cards[0].description);
        cy.dataCy('slider-merch').should('be.visible');
        // close dialog
        cy.dataCy('dialog-close').click();
        // first option is selected
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-selected"]')
          .should('be.visible');
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .should('not.be.visible');
      });
    });

    it('allows user to select merch option (button click)', () => {
      cy.fixture('listMerch').then((cards) => {
        // open dialog
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .click();
        cy.dataCy('dialog-merch')
          .should('be.visible')
          .and('contain', cards[0].title)
          .and('contain', cards[0].description);
        cy.dataCy('slider-merch').should('be.visible');
        // close dialog
        cy.dataCy('dialog-close').click();
        // first option is selected
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-selected"]')
          .should('be.visible');
        cy.dataCy('form-card-merch-female')
          .first()
          .find('[data-cy="button-more-info"]')
          .should('not.be.visible');
      });
    });

    it('changes tabs when changing gender radio', () => {
      // open dialog
      cy.dataCy('form-card-merch-female')
        .first()
        .find('[data-cy="button-more-info"]')
        .click();
      cy.dataCy('dialog-merch').should('be.visible');
      // change gender setting
      cy.dataCy('form-field-merch-gender')
        .should('be.visible')
        .find('.q-radio')
        .last()
        .click();
      // close dialog
      cy.dataCy('dialog-close').click();
      cy.dataCy('form-card-merch-male').should('be.visible');
      // we should see male options
      cy.dataCy('form-card-merch-female').should('not.exist');
      // same merch type selected
      cy.dataCy('form-card-merch-male')
        .first()
        .find('[data-cy="button-selected"]')
        .should('be.visible')
        .click();
      // open dialog
      cy.dataCy('dialog-merch').should('be.visible');
      // change gender setting
      cy.dataCy('form-field-merch-gender')
        .should('be.visible')
        .find('.q-radio')
        .first()
        .click();
      // close dialog
      cy.dataCy('dialog-close').click();
      // we should see female options
      cy.dataCy('form-card-merch-male').should('not.exist');
      cy.dataCy('form-card-merch-female').should('be.visible');
    });

    it('validates dialog settings', () => {
      // open dialog
      cy.dataCy('form-card-merch-female')
        .first()
        .find('[data-cy="button-more-info"]')
        .click();
      cy.dataCy('dialog-merch').should('be.visible');
      // invalid settings (size not selected)
      cy.dataCy('dialog-body').scrollTo('bottom');
      cy.dataCy('button-submit-merch').should('be.visible').click();
      // dialog does not close
      cy.dataCy('dialog-merch').should('be.visible');
      // select size
      cy.dataCy('form-field-merch-size')
        .should('be.visible')
        .find('.q-radio')
        .first()
        .click();
      // close dialog
      cy.dataCy('dialog-body').scrollTo('bottom');
      cy.dataCy('button-submit-merch').should('be.visible').click();
      // dialog closes
      cy.dataCy('dialog-merch').should('not.exist');
      // open dialog
      cy.dataCy('form-card-merch-female')
        .first()
        .find('[data-cy="button-selected"]')
        .click();
      cy.dataCy('dialog-merch').should('be.visible');
      // select package tracking
      cy.dataCy('form-merch-tracking-input').click();
      // close dialog
      cy.dataCy('button-submit-merch').should('be.visible').click();
      // dialog does not close (number not valid)
      cy.dataCy('dialog-merch').should('be.visible');
      cy.dataCy('form-merch-phone-input')
        .should('be.visible')
        .find('input')
        .type('736 123 456');
      // close dialog
      cy.dataCy('button-submit-merch').should('be.visible').click();
      // dialog closes
      cy.dataCy('dialog-merch').should('not.exist');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldListMerch, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    it('should render 1 card in a row', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('list-merch-option-group').children(),
        100,
      );
    });
  });
});
