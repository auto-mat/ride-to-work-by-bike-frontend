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
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('formCreateInvoiceTeam').then((team) => {
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
            .and('contain', team.members[index].amount);
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
