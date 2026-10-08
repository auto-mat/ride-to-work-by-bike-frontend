import AddressDisplay from '@/components/global/AddressDisplay.vue';
import { i18n } from '../../boot/i18n';

// selectors
const addressDisplay = 'address-display';
const addressDisplayDepartment = 'address-display-department';
const addressDisplayStreetHouseNumber = 'address-display-street-house-number';
const addressDisplayZipCityChallenge = 'address-display-zip-city-challenge';

describe('<AddressDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('formAddress').then((address) => {
        cy.wrap(address).as('address');
        cy.mount(AddressDisplay, {
          props: { address },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('formAddress').then((address) => {
        cy.wrap(address).as('address');
        cy.mount(AddressDisplay, {
          props: { address },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(addressDisplay).should('be.visible');

    cy.get('@address').then((address) => {
      if (address.department) {
        cy.dataCy(addressDisplayDepartment).should(
          'contain',
          address.department,
        );
      }
      if (address.street) {
        cy.dataCy(addressDisplayStreetHouseNumber).should(
          'contain',
          address.street,
        );
      }
      if (address.houseNumber) {
        cy.dataCy(addressDisplayStreetHouseNumber).should(
          'contain',
          address.houseNumber,
        );
      }
      if (address.street && address.houseNumber) {
        cy.dataCy(addressDisplayStreetHouseNumber).should(
          'contain',
          `${address.street}, ${address.houseNumber}`,
        );
      }
      if (address.zip) {
        cy.dataCy(addressDisplayZipCityChallenge).should(
          'contain',
          address.zip,
        );
      }
      if (address.city) {
        cy.dataCy(addressDisplayZipCityChallenge).should(
          'contain',
          address.city,
        );
      }
      if (address.cityChallenge) {
        cy.dataCy(addressDisplayZipCityChallenge).should(
          'contain',
          address.cityChallenge,
        );
      }
      if (address.zip && address.city) {
        cy.dataCy(addressDisplayZipCityChallenge).should(
          'contain',
          `${address.zip}, ${address.city}`,
        );
      }
      if (address.city && address.cityChallenge) {
        cy.dataCy(addressDisplayZipCityChallenge).should(
          'contain',
          `${address.city} - ${address.cityChallenge}`,
        );
      }
      if (address.zip && address.city && address.cityChallenge) {
        cy.dataCy(addressDisplayZipCityChallenge).should(
          'contain',
          `${address.zip}, ${address.city} - ${address.cityChallenge}`,
        );
      }
    });
  });
}
