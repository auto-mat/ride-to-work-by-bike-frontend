import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import FormFieldCheckboxSubsidiary from '../form/FormFieldCheckboxSubsidiary.vue';
import { vModelAdapter } from '../../../test/cypress/utils';
import invoiceFixture from '../../../test/cypress/fixtures/formCreateInvoice.json';

const model = ref([]);

describe('<FormFieldCheckboxSubsidiary>', () => {
  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      model.value = [];
      cy.mount(FormFieldCheckboxSubsidiary, {
        props: {
          ...vModelAdapter(model),
          subsidiary: invoiceFixture.subsidiaries[0],
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      model.value = [];
      cy.mount(FormFieldCheckboxSubsidiary, {
        props: {
          ...vModelAdapter(model),
          subsidiary: invoiceFixture.subsidiaries[0],
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component with expansion item', () => {
    cy.fixture('formCreateInvoice').then((invoice) => {
      const subsidiary = invoice.subsidiaries[0];
      // component
      cy.dataCy('form-field-checkbox-subsidiary').should('be.visible');
      // expansion item with subsidiary name
      cy.dataCy('form-field-checkbox-subsidiary-title')
        .should('be.visible')
        .and('contain', subsidiary.name);
      // teams within subsidiary
      cy.dataCy('form-field-checkbox-team').should(
        'have.length',
        subsidiary.teams.length,
      );
    });
  });

  it('emits correct model structure when subsidiary checkbox is selected', () => {
    cy.fixture('formCreateInvoice').then((invoice) => {
      const subsidiary = invoice.subsidiaries[0];
      // check subsidiary checkbox
      cy.dataCy('form-field-checkbox-subsidiary-input').click();
      // verify model structure: { [teamId]: number[] }
      cy.wrap(model).should(() => {
        const modelValue = model.value;
        // all teams
        expect(Object.keys(modelValue)).to.have.length(subsidiary.teams.length);
        // each team should contain array of IDs
        subsidiary.teams.forEach((team) => {
          expect(modelValue[team.id]).to.be.an('array');
          expect(modelValue[team.id]).to.have.length(team.members.length);
          // verify IDs match
          const expectedPaymentIds = team.members.map((m) => m.payment.id);
          expect(modelValue[team.id]).to.deep.equal(expectedPaymentIds);
        });
      });
    });
  });

  it('emits correct model structure when subsidiary checkbox is deselected', () => {
    cy.fixture('formCreateInvoice').then((invoice) => {
      const subsidiary = invoice.subsidiaries[0];
      // select then deselect
      cy.dataCy('form-field-checkbox-subsidiary-input').click();
      cy.dataCy('form-field-checkbox-subsidiary-input').click();
      // verify model value
      cy.wrap(model).should(() => {
        const modelValue = model.value;
        expect(Object.keys(modelValue)).to.have.length(subsidiary.teams.length);
        subsidiary.teams.forEach((team) => {
          expect(modelValue[team.id]).to.be.an('array');
          expect(modelValue[team.id]).to.have.length(0);
        });
      });
    });
  });

  it('emits correct model structure when individual team is selected', () => {
    cy.fixture('formCreateInvoice').then((invoice) => {
      const subsidiary = invoice.subsidiaries[0];
      const firstTeam = subsidiary.teams[0];
      // select first team
      cy.dataCy('form-field-checkbox-team')
        .first()
        .find('[data-cy="form-field-checkbox-team-input"]')
        .click();
      // verify model value
      cy.wrap(model).should(() => {
        const modelValue = model.value;
        // first team should have IDs
        expect(modelValue[firstTeam.id]).to.be.an('array');
        expect(modelValue[firstTeam.id]).to.have.length(
          firstTeam.members.length,
        );
        const expectedPaymentIds = firstTeam.members.map((m) => m.payment.id);
        expect(modelValue[firstTeam.id]).to.deep.equal(expectedPaymentIds);
        // other teams should be empty
        subsidiary.teams.slice(1).forEach((team) => {
          expect(modelValue[team.id] || []).to.have.length(0);
        });
      });
    });
  });

  it('is expanded by default', () => {
    // expansion item should show teams
    cy.dataCy('form-field-checkbox-team').should('be.visible');
  });

  it('allows to control selection with "subsidiary" checkbox', () => {
    // check subsidiary checkbox
    cy.dataCy('form-field-checkbox-subsidiary-input').click();
    // all teams should be selected
    cy.dataCy('form-field-checkbox-team').each(($team) => {
      cy.wrap($team)
        .find('[data-cy="form-field-checkbox-team-input"] .q-checkbox__inner')
        .should('have.class', 'q-checkbox__inner--truthy');
    });
    // all members should be selected
    cy.dataCy('form-field-checkbox-team-item').each(($item) => {
      cy.wrap($item)
        .find('.q-checkbox__inner')
        .should('have.class', 'q-checkbox__inner--truthy');
    });
    // uncheck subsidiary checkbox
    cy.dataCy('form-field-checkbox-subsidiary-input').click();
    // all teams should be deselected
    cy.dataCy('form-field-checkbox-team').each(($team) => {
      cy.wrap($team)
        .find('[data-cy="form-field-checkbox-team-input"] .q-checkbox__inner')
        .should('not.have.class', 'q-checkbox__inner--truthy');
    });
    // all members should be deselected
    cy.dataCy('form-field-checkbox-team-item').each(($item) => {
      cy.wrap($item)
        .find('.q-checkbox__inner')
        .should('not.have.class', 'q-checkbox__inner--truthy');
    });
  });

  it('updates subsidiary checkbox when all teams are selected', () => {
    // select all teams individually
    cy.dataCy('form-field-checkbox-team').each(($team) => {
      cy.wrap($team).find('[data-cy="form-field-checkbox-team-input"]').click();
    });
    // subsidiary should be selected
    cy.dataCy('form-field-checkbox-subsidiary-input')
      .find('.q-checkbox__inner')
      .should('have.class', 'q-checkbox__inner--truthy');
    // deselect one team
    cy.dataCy('form-field-checkbox-team')
      .first()
      .find('[data-cy="form-field-checkbox-team-input"]')
      .click();
    // subsidiary should not be fully selected
    cy.dataCy('form-field-checkbox-subsidiary-input')
      .find('.q-checkbox__inner')
      .should('not.have.class', 'q-checkbox__inner--truthy');
  });

  it('allows collapsing and expanding the subsidiary', () => {
    // teams should be visible (expanded by default)
    cy.dataCy('form-field-checkbox-team').should('be.visible');
    // click expansion header to collapse
    cy.dataCy('form-field-checkbox-subsidiary-expansion-header').click();
    // teams should not be visible
    cy.dataCy('form-field-checkbox-team').should('not.be.visible');
    // click expansion header to expand
    cy.dataCy('form-field-checkbox-subsidiary-expansion-header').click();
    // teams should be visible again
    cy.dataCy('form-field-checkbox-team').should('be.visible');
  });

  it('updates subsidiary checkbox when members are selected', () => {
    // reset all members by double clicking the subsidiary checkbox
    cy.dataCy('form-field-checkbox-subsidiary-input').click();
    cy.dataCy('form-field-checkbox-subsidiary-input').click();
    // select all members in all teams
    cy.dataCy('form-field-checkbox-team-item').each(($item) => {
      cy.wrap($item).find('.q-checkbox__inner').click();
    });
    // subsidiary should be selected
    cy.dataCy('form-field-checkbox-subsidiary-input')
      .find('.q-checkbox__inner')
      .should('have.class', 'q-checkbox__inner--truthy');
  });
}
