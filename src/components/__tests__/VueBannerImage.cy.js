import VueBannerImage from 'components/VueBannerImage.vue';

describe('<VueBannerImage>', () => {
  const title = 'Fill in our questionnaire and win one of our great prizes!';
  const perex =
    'You can help us decide what to spend more time on next time and what should stay the same.';
  const image = 'https://picsum.photos/600/200';

  beforeEach(() => {
    cy.mount(VueBannerImage, {
      props: {
        banner: {
          title,
          perex,
          image,
        },
      },
    });
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.get('[data-testid="banner-title"]')
        .should('be.visible')
        .should('contain.text', title)
        .then((titleNode) => {
          expect(titleNode.text()).to.equal(title);
        });
    });
  });

  it('renders perex', () => {
    cy.window().then(() => {
      cy.get('[data-testid="banner-perex"]')
        .should('be.visible')
        .should('contain.text', perex)
        .then((perexNode) => {
          expect(perexNode.text()).to.equal(perex);
        });
    });
  });

  it('renders two columns', () => {
    cy.window().then(() => {
      cy.get('[data-testid="banner-half"]')
        .should('have.length', 2)
        .should('be.visible');
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.get('[data-testid="banner"]')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });
});
