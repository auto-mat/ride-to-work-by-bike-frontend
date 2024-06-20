import FormFieldTestWrapper from '../global/FormFieldTestWrapper.vue';

describe('<FormFieldCheckboxTeam>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldCheckboxTeam',
          array: true,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders items in 2 column layout', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('form-field-checkbox-team-item'),
        50,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'FormFieldCheckboxTeam',
          array: true,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders items in 2 column layout', () => {
      cy.testElementPercentageWidth(
        cy.dataCy('form-field-checkbox-team-item'),
        100,
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('formCreateInvoice').then((invoice) => {
      const team = invoice.teams[0];
      // component
      cy.dataCy('form-field-checkbox-team').should('be.visible');
      // input team
      cy.dataCy('form-field-checkbox-team-title')
        .should('be.visible')
        .and('contain', team.name);
      // items
      cy.dataCy('form-field-checkbox-team-item')
        .should('be.visible')
        .each(($item, index) => {
          cy.wrap($item)
            .should('contain', team.members[index].name)
            .and('contain', team.members[index].payment.amount);
        });
    });
  });

  it('allows to control selection with "team" checkbox', () => {
    // check team checkbox
    cy.dataCy('form-field-checkbox-team-input').click();
    // all members should be selected
    cy.dataCy('form-field-checkbox-team-item').each(($item) => {
      cy.wrap($item)
        .find('.q-checkbox__inner')
        .should('have.class', 'q-checkbox__inner--truthy');
    });
    // uncheck team checkbox
    cy.dataCy('form-field-checkbox-team-input').click();
    // all members should be deselected
    cy.dataCy('form-field-checkbox-team-item').each(($item) => {
      cy.wrap($item)
        .find('.q-checkbox__inner')
        .should('not.have.class', 'q-checkbox__inner--truthy');
    });
    // select each member
    cy.dataCy('form-field-checkbox-team-item').each(($item) => {
      cy.wrap($item).find('.q-checkbox__inner').click();
    });
    // team should be selected
    cy.dataCy('form-field-checkbox-team-input')
      .find('.q-checkbox__inner')
      .should('have.class', 'q-checkbox__inner--truthy');
    // unselect one member
    cy.dataCy('form-field-checkbox-team-item')
      .first()
      .find('.q-checkbox__inner')
      .click();
    // team should be deselected
    cy.dataCy('form-field-checkbox-team-input')
      .find('.q-checkbox__inner')
      .should('not.have.class', 'q-checkbox__inner--truthy');
  });
}
