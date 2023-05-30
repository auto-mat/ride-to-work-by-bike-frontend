import VueHeadingBackground from 'components/VueHeadingBackground.vue';

describe('<VueHeadingBackground>', () => {
  const title = 'Join the Bike to Work community in your city';

  beforeEach(() => {
    cy.mount(VueHeadingBackground, {
      props: {
        title,
      },
    });
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.get('[data-testid="heading-bg-title"]')
        .should('be.visible')
        .should('contain', title)
        .then((titleNode) => {
          expect(titleNode.text()).to.equal(title);
        });
    });
  });

  it('renders image', () => {
    cy.window().then(() => {
      cy.get('.q-img__image').should('be.visible');
    });
  });
});
