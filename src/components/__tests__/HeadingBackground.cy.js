import HeadingBackground from 'components/HeadingBackground.vue';

describe('<HeadingBackground>', () => {
  const title = 'Join the Bike to Work community in your city';

  beforeEach(() => {
    cy.mount(HeadingBackground, {
      props: {
        title,
      },
    });
  });

  it('renders title with correct styling', () => {
    cy.window().then(() => {
      cy.dataCy('heading-wrapper').should('be.visible');

      cy.dataCy('heading')
        .should('be.visible')
        .should('contain', title)
        .then(($title) => {
          expect($title.text()).to.equal(title);
        });

      cy.dataCy('heading')
        .should('have.css', 'font-size', '24px')
        .should('have.css', 'font-weight', '700');
    });
  });

  it('renders svg background', () => {
    cy.window().then(() => {
      cy.dataCy('svg').should('be.visible');

      cy.viewport('iphone-6');

      cy.dataCy('svg')
        .should('be.visible')
        .then(($element) => {
          expect($element.width()).to.be.closeTo(375, 0.5);
          expect($element.height()).to.be.closeTo(73, 1);
        });

      cy.viewport('macbook-13');

      cy.dataCy('svg')
        .should('be.visible')
        .then(($element) => {
          expect($element.width()).to.be.closeTo(1280, 0.5);
          expect($element.height()).to.be.closeTo(250, 5);
        });
    });
  });
});
