import { ref } from 'vue';
import FormFieldAddress from '../form/FormFieldAddress.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from '../../../test/cypress/utils';

// Test data
const mockAddressData = {
  street: 'Main Street',
  houseNumber: '123',
  city: 'Prague',
  zip: '12345',
};

const emptyAddressData = {
  street: '',
  houseNumber: '',
  city: '',
  zip: '',
};

const streetModel = ref('');
const houseNumberModel = ref('');
const cityModel = ref('');
const zipModel = ref('');

describe('FormFieldAddress', () => {
  it('renders elements with default field prefix', () => {
    cy.mount(FormFieldAddress, {
      props: emptyAddressData,
    });

    cy.dataCy('form-address-street').should('be.visible');
    cy.dataCy('form-address-house-number').should('be.visible');
    cy.dataCy('form-address-city').should('be.visible');
    cy.dataCy('form-address-zip').should('be.visible');
  });

  it('renders elements with custom field prefix', () => {
    cy.mount(FormFieldAddress, {
      props: {
        ...emptyAddressData,
        fieldPrefix: 'subsidiary',
      },
    });

    cy.dataCy('form-subsidiary-street').should('be.visible');
    cy.dataCy('form-subsidiary-house-number').should('be.visible');
    cy.dataCy('form-subsidiary-city').should('be.visible');
    cy.dataCy('form-subsidiary-zip').should('be.visible');
  });

  it('displays correct field values', () => {
    cy.mount(FormFieldAddress, {
      props: mockAddressData,
    });

    cy.dataCy('form-address-street-input').should(
      'have.value',
      mockAddressData.street,
    );
    cy.dataCy('form-address-houseNumber-input').should(
      'have.value',
      mockAddressData.houseNumber,
    );
    cy.dataCy('form-address-city-input').should(
      'have.value',
      mockAddressData.city,
    );
    cy.dataCy('form-address-zip-input')
      .should('have.attr', 'value')
      .then((value) => {
        expect(value.replace(/\s/g, '')).to.equal(mockAddressData.zip);
      });
  });

  it('applies zip code mask correctly', () => {
    cy.mount(FormFieldAddress, {
      props: {
        modelValue: emptyAddressData,
      },
    });

    // masking zip code
    cy.dataCy('form-address-zip-input').type('12345');
    cy.dataCy('form-address-zip-input').should('have.value', '123 45');
  });

  it('validates street field', () => {
    cy.mount(FormFieldAddress, {
      props: {
        ...vModelAdapter(streetModel, 'street'),
      },
    });

    cy.dataCy('form-address-street-input').clear();
    cy.dataCy('form-address-street-input').blur();
    cy.contains(
      i18n.global.t('form.messageFieldRequired', {
        fieldName: i18n.global.t('form.labelStreet'),
      }),
    ).should('be.visible');
    cy.dataCy('form-address-street-input').clear();
    cy.dataCy('form-address-street-input').type('123');
    cy.dataCy('form-address-street-input').blur();
    cy.contains(
      i18n.global.t('form.messageFieldRequired', {
        fieldName: i18n.global.t('form.labelStreet'),
      }),
    ).should('not.exist');
  });

  it('validates house number field', () => {
    cy.mount(FormFieldAddress, {
      props: {
        ...vModelAdapter(houseNumberModel, 'houseNumber'),
      },
    });
    cy.dataCy('form-address-houseNumber-input').clear();
    cy.dataCy('form-address-houseNumber-input').blur();
    cy.contains(
      i18n.global.t('form.messageFieldRequired', {
        fieldName: i18n.global.t('form.labelHouseNumber'),
      }),
    ).should('be.visible');
    cy.dataCy('form-address-houseNumber-input').clear();
    cy.dataCy('form-address-houseNumber-input').type('123');
    cy.dataCy('form-address-houseNumber-input').blur();
    cy.contains(
      i18n.global.t('form.messageFieldRequired', {
        fieldName: i18n.global.t('form.labelHouseNumber'),
      }),
    ).should('not.exist');
  });

  it('validates city field', () => {
    cy.mount(FormFieldAddress, {
      props: {
        ...vModelAdapter(cityModel, 'city'),
      },
    });
    cy.dataCy('form-address-city-input').clear();
    cy.dataCy('form-address-city-input').blur();
    cy.contains(
      i18n.global.t('form.messageFieldRequired', {
        fieldName: i18n.global.t('form.labelCity'),
      }),
    ).should('be.visible');
    cy.dataCy('form-address-city-input').clear();
    cy.dataCy('form-address-city-input').type('123');
    cy.dataCy('form-address-city-input').blur();
    cy.contains(
      i18n.global.t('form.messageFieldRequired', {
        fieldName: i18n.global.t('form.labelCity'),
      }),
    ).should('not.exist');
  });

  it('validates zip code', () => {
    cy.mount(FormFieldAddress, {
      props: {
        ...vModelAdapter(zipModel, 'zip'),
      },
    });

    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type('01234');
    cy.dataCy('form-address-zip-input').blur();
    cy.contains(i18n.global.t('form.messageZipInvalid')).should('be.visible');
    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type('a2345');
    cy.dataCy('form-address-zip-input').blur();
    cy.contains(i18n.global.t('form.messageZipInvalid')).should('be.visible');
    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type('9999');
    cy.dataCy('form-address-zip-input').blur();
    cy.contains(i18n.global.t('form.messageZipInvalid')).should('be.visible');
    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type('11000%');
    cy.dataCy('form-address-zip-input').should('have.value', '110 00');
    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type('9999');
    cy.dataCy('form-address-zip-input').blur();
    cy.contains(i18n.global.t('form.messageZipInvalid')).should('be.visible');
    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type('10000');
    cy.dataCy('form-address-zip-input').blur();
    cy.contains(i18n.global.t('form.messageZipInvalid')).should('not.exist');
    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type('500 02');
    cy.dataCy('form-address-zip-input').blur();
    cy.contains(i18n.global.t('form.messageZipInvalid')).should('not.exist');
    cy.dataCy('form-address-zip-input').clear();
    cy.dataCy('form-address-zip-input').type(' 999 99');
    cy.dataCy('form-address-zip-input').blur();
    cy.contains(i18n.global.t('form.messageZipInvalid')).should('not.exist');
  });

  it('renders some fields side by side on desktop', () => {
    cy.viewport('macbook-16');
    cy.mount(FormFieldAddress, {
      props: emptyAddressData,
    });
    cy.testElementsSideBySide(
      'form-address-street',
      'form-address-house-number',
    );
    cy.testElementsSideBySide('form-address-city', 'form-address-zip');
  });

  it('renders some fields stacked on mobile', () => {
    cy.viewport('iphone-6');
    cy.mount(FormFieldAddress, {
      props: emptyAddressData,
    });
    cy.testElementsStacked('form-address-street', 'form-address-house-number');
    cy.testElementsStacked('form-address-city', 'form-address-zip');
  });
});
