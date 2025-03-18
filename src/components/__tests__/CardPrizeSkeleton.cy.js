import CardPrizeSkeleton from 'src/components/skeletons/CardPrizeSkeleton.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

describe('<CardPrizeSkeleton>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardPrizeSkeleton, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders all skeleton elements', () => {
      // check main container
      cy.dataCy('card-prize-skeleton').should('be.visible');
      // check image skeleton
      cy.dataCy('card-prize-skeleton')
        .find('.q-skeleton--type-rect')
        .should('be.visible')
        .and('have.css', 'height', '280px');
      // check text skeletons
      cy.dataCy('card-prize-skeleton')
        .find('.q-skeleton--type-text')
        .should('have.length', 2)
        .and('be.visible');
    });

    it('has rounded corners', () => {
      cy.dataCy('card-prize-skeleton').should(
        'have.css',
        'border-radius',
        rideToWorkByBikeConfig.borderRadiusCard,
      );
    });
  });
});
