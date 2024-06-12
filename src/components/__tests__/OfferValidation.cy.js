import OfferValidation from 'components/offer/OfferValidation.vue';
import { i18n } from '../../boot/i18n';

describe('<OfferValidation>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelOfferValidationAccount',
        'labelOfferValidationTshirt',
        'titleOfferValidation',
      ],
      'offer',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(OfferValidation, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(OfferValidation, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('offer-validation').should('be.visible');
    // title
    cy.dataCy('offer-validation-title')
      .should('be.visible')
      .and('contain', i18n.global.t('offer.titleOfferValidation'));
    // first item
    cy.dataCy('offer-validation-item')
      .first()
      .should('be.visible')
      .and('contain', i18n.global.t('offer.labelOfferValidationTshirt'));
    // last item
    cy.dataCy('offer-validation-item')
      .last()
      .should('be.visible')
      .and('contain', i18n.global.t('offer.labelOfferValidationAccount'));
    // icon
    cy.dataCy('offer-validation-icon').invoke('height').should('be.equal', 32);
    cy.dataCy('offer-validation-icon').invoke('width').should('be.equal', 32);
  });
}
