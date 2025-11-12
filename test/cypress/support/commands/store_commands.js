import { computed } from 'vue';

/**
 * Set a store value and wait for it to register
 *
 * @param {function} useRegisterChallengeStore - `useRegisterChallengeStore` function
 *                                                to ininitialize register challenge store
 * @param {boolean} expectedValue - `true` for making user organization admin
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
