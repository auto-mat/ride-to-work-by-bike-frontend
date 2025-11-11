import { computed } from 'vue';

/**
 * Set a store value and wait for it to register
 */
Cypress.Commands.add(
  'setIsUserOrganizationAdminStoreValue',
  (useRegisterChallengeStore, expectedValue) => {
    cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
      const isUserOrganizationAdmin = computed(
        () => registerChallengeStore.getIsUserOrganizationAdmin,
      );
      registerChallengeStore.setIsUserOrganizationAdmin(expectedValue);
      cy.wrap(isUserOrganizationAdmin)
        .its('value')
        .should('deep.equal', expectedValue);
    });
  },
);
