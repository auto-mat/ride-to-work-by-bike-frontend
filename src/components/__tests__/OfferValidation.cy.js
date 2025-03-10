import { colors } from 'quasar';
import OfferValidation from 'components/offer/OfferValidation.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// colors
const { changeAlpha, getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const primaryOpacity = changeAlpha(
  primary,
  rideToWorkByBikeConfig.colorPrimaryOpacity,
);

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

    it('shows validation items side-by-side', () => {
      cy.testElementsSideBySide(
        'offer-validation-item-tshirt',
        'offer-validation-item-app',
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(OfferValidation, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('shows validation items stacked', () => {
      cy.testElementsStacked(
        'offer-validation-item-tshirt',
        'offer-validation-item-app',
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('offer-validation')
      .should('be.visible')
      .and('have.backgroundColor', primaryOpacity);
    // title
    cy.dataCy('offer-validation-title')
      .should('be.visible')
      .and('contain', i18n.global.t('offer.titleOfferValidation'));
    // first item
    cy.dataCy('offer-validation-item-tshirt')
      .should('be.visible')
      .and('contain', i18n.global.t('offer.labelOfferValidationTshirt'));
    // last item
    cy.dataCy('offer-validation-item-app')
      .should('be.visible')
      .and('contain', i18n.global.t('offer.labelOfferValidationAccount'));
    // icon
    cy.dataCy('offer-validation-icon').invoke('height').should('be.equal', 32);
    cy.dataCy('offer-validation-icon').invoke('width').should('be.equal', 32);
  });
}
