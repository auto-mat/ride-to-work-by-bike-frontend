import VueMenuLinks from 'components/VueMenuLinks.vue';

describe('<VueMenuLinks>', () => {
  const title = 'Find us on social media';

  it('renders title with correct styling', () => {
    cy.mount(VueMenuLinks, {
      props: {
        title,
        variant: 'social',
      },
    });

    cy.dataCy('title-menu-links')
      .should('be.visible')
      .should('contain', title)
      .should('have.css', 'font-size', '24px')
      .should('have.css', 'font-weight', '700');
  })

  it('renders social buttons with correct styling', () => {
    cy.mount(VueMenuLinks, {
      props: {
        title,
        variant: 'social',
      },
    });

    cy.dataCy('button-menu-links')
      .should('have.length', 4)
      .should('contain', 'Instagram')
      .should('contain', 'Facebook')
      .should('contain', 'Twitter')
      .should('contain', 'Youtube')
    })

});
