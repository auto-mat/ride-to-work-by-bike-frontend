import VueListFaq from 'components/VueListFaq.vue';

describe('<VueListFaq>', () => {
  const title = 'Participants';

  it('renders title with correct styling', () => {
    cy.mount(VueListFaq, {
      props: {
        title,
        variant: 'participant',
      },
    });

    cy.dataCy('list-faq-title')
      .should('be.visible')
      .should('contain', title)
      .should('have.css', 'font-size', '24px')
      .should('have.css', 'font-weight', '700');
  });

  it('renders participant FAQ with working accordion', () => {
    cy.mount(VueListFaq, {
      props: {
        title,
        variant: 'participant',
      },
    });

    cy.dataCy('list-faq-list')
      .find('.q-item__label')
      .first()
      .should('have.css', 'font-size', '14px')
      .should('have.css', 'font-weight', '400');

    cy.dataCy('list-faq-list').find('.q-card').first().should('not.be.visible');

    cy.dataCy('list-faq-list')
      .find('.q-item')
      .first()
      .should('be.visible')
      .click()
      .then(() => {
        cy.dataCy('list-faq-list')
          .find('.q-card')
          .first()
          .should('be.visible')
          .then(($element) => {
            expect($element.height()).to.be.greaterThan(0);
          });
      });
  });

  it('renders coordinator FAQ section with working accordion', () => {
    cy.mount(VueListFaq, {
      props: {
        title,
        variant: 'coordinator',
      },
    });

    cy.dataCy('list-faq-list')
      .find('.q-item__label')
      .first()
      .should('have.css', 'font-size', '14px')
      .should('have.css', 'font-weight', '400');

    cy.dataCy('list-faq-list').find('.q-card').first().should('not.be.visible');

    cy.dataCy('list-faq-list')
      .find('.q-item')
      .first()
      .should('be.visible')
      .click()
      .then(() => {
        cy.dataCy('list-faq-list')
          .find('.q-card')
          .first()
          .should('be.visible')
          .then(($element) => {
            expect($element.height()).to.be.greaterThan(0);
          });
      });
  });
});
