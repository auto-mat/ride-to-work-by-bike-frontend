import CardOfferSkeleton from 'src/components/skeletons/CardOfferSkeleton.vue';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

describe('<CardOfferSkeleton>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CardOfferSkeleton, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders all skeleton elements', () => {
      // check main container
      cy.dataCy('card-offer-skeleton').should('be.visible');
      // check avatar skeleton
      cy.dataCy('card-offer-skeleton')
        .find('.q-skeleton--type-QAvatar')
        .should('be.visible')
        .and('have.css', 'width', '48px')
        .and('have.css', 'height', '48px');
      // check text skeletons
      cy.dataCy('card-offer-skeleton')
        .find('.q-skeleton--type-text')
        .should('have.length', 2)
        .and('be.visible');
    });

    it('has rounded corners', () => {
      cy.dataCy('card-offer-skeleton').should(
        'have.css',
        'border-radius',
        rideToWorkByBikeConfig.borderRadiusCard,
      );
    });
  });
});
