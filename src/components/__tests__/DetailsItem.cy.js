import { colors } from 'quasar';
import DetailsItem from '@/components/profile/DetailsItem.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const grey7 = getPaletteColor('grey-7');

// selectors
const selectorDetailsItem = 'details-item';
const selectorDetailsItemDescription = 'details-item-description';
const selectorDetailsItemLabel = 'details-item-label';
const selectorDetailsItemValue = 'details-item-value';
const selectorDetailsItemEdit = 'details-item-edit';
const selectorDetailsItemEmpty = 'details-item-empty';
const selectorDetailsSectionEdit = 'details-section-edit';
const selectorDialogEdit = 'dialog-edit';

// variables
const maxWidthLabel = 140;
const slotButton = 'Slot Button';
const slotForm = 'Slot Form';
const slotLabel = 'Slot Label';
const slotValue = 'Slot Value';
const props = {
  description: 'Description',
  editable: true,
  label: 'Label',
  value: 'Value',
  emptyLabel: 'Empty Label',
  dialogTitle: 'Dialog Title',
};

describe('<DetailsItem>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['edit'], 'navigation', i18n);
    cy.testLanguageStringsInContext(['labelNoValue'], 'profile', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          form: `<div>${slotForm}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    propLabelTests();
    propValueTests();
    propDescriptionTests();
    editableTests();
  });

  context('desktop - slot label', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          label: `<div>${slotLabel}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    slotLabelTests();
    propValueTests();
    propDescriptionTests();
  });

  context('desktop - slot value', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          value: `<div>${slotValue}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    propLabelTests();
    slotValueTests();
  });

  context('desktop - slot button', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          button: `<span>${slotButton}</span>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    propLabelTests();
    propValueTests();
    propDescriptionTests();
    slotButtonTests();
  });

  context('desktop - empty', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props: {
          description: props.description,
          editable: true,
          label: props.label,
          value: '',
          emptyLabel: props.emptyLabel,
          dialogTitle: props.dialogTitle,
        },
        slots: {
          form: `<div>${slotForm}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    emptyTests();
    editableTests();

    it('renders custom empty label', () => {
      cy.dataCy(selectorDetailsItemEmpty).should('contain', props.emptyLabel);
    });
  });

  context('desktop - empty (no label)', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props: {
          description: props.description,
          editable: true,
          label: props.label,
          value: '',
          dialogTitle: props.dialogTitle,
        },
        slots: {
          form: `<div>${slotForm}</div>`,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    emptyTests();
    editableTests();

    it('renders default empty label', () => {
      cy.dataCy(selectorDetailsItemEmpty).should(
        'contain',
        i18n.global.t('profile.labelNoValue'),
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(DetailsItem, {
        props,
        slots: {
          form: `<div>${slotForm}</div>`,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    propLabelTests();
    propValueTests();
    propDescriptionTests();
    editableTests();
    mobileTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorDetailsItem).should('be.visible');
  });
}

function mobileTests() {
  it('renders full-width button section', () => {
    cy.testElementPercentageWidth(cy.dataCy(selectorDetailsSectionEdit), 100);
  });
}

function emptyTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorDetailsItem).should('be.visible');
    // label
    cy.dataCy(selectorDetailsItemLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10);
    // empty label
    cy.dataCy(selectorDetailsItemEmpty)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.css', 'font-style', 'italic')
      .and('have.color', grey7);
    // description
    cy.dataCy(selectorDetailsItemDescription)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey7);
  });
}

function propDescriptionTests() {
  it('renders description', () => {
    cy.dataCy(selectorDetailsItemDescription)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey7);
  });
}

function editableTests() {
  it('renders edit button and dialog', () => {
    // click edit button
    cy.dataCy(selectorDetailsItemEdit).should('be.visible').click();
    // dialog
    cy.dataCy(selectorDialogEdit).should('be.visible');
    cy.dataCy(selectorDialogEdit).should('contain', props.dialogTitle);
    cy.dataCy(selectorDialogEdit).should('contain', slotForm);
  });
}

function slotButtonTests() {
  it('renders slot button', () => {
    cy.dataCy(selectorDetailsItemEdit).should('contain', slotButton);
  });
}

function propLabelTests() {
  it('renders prop label', () => {
    cy.dataCy(selectorDetailsItemLabel)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', props.label)
      // max width
      .invoke('width')
      .then((width) => {
        expect(width).to.be.lessThan(maxWidthLabel + 1);
      });
  });
}

function slotLabelTests() {
  it('renders slot label', () => {
    cy.dataCy(selectorDetailsItemLabel).should('contain', slotLabel);
  });
}

function propValueTests() {
  it('renders prop value', () => {
    cy.dataCy(selectorDetailsItemValue)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', props.value);
  });
}

function slotValueTests() {
  it('renders slot value', () => {
    cy.dataCy(selectorDetailsItemValue).should('contain', slotValue);
  });
}
