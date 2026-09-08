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

/**
 * Set merchandise cards value in register challenge store
 * @param {function} useRegisterChallengeStore - `useRegisterChallengeStore` function
 *                                                to initialize register challenge store
 */
Cypress.Commands.add(
  'setMerchandiseCardsStoreState',
  (useRegisterChallengeStore) => {
    cy.fixture('cardMerch.json').then((card) => {
      cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
        const storedMerchandiseCards = computed(
          () => registerChallengeStore.getMerchandiseCards,
        );
        registerChallengeStore.setMerchandiseCards({ [card.gender]: [card] });
        cy.wrap(storedMerchandiseCards)
          .its('value')
          .should('deep.equal', { [card.gender]: [card] });
      });
    });
  },
);

/**
 * Set avatar value in avatar store
 * @param {function} useAvatarStore - `useAvatarStore` function to initialize avatar store
 * @param {number | null} id - avatar ID (or `null` for default/fallback state)
 * @param {string | null} url - avatar image URL to display
 */
Cypress.Commands.add('setAvatarStoreState', (useAvatarStore, id, url) => {
  cy.wrap(useAvatarStore()).then((avatarStore) => {
    const storedId = computed(() => avatarStore.getId);
    avatarStore.setAvatar(id, url);
    cy.wrap(storedId).should((currentStoredId) => {
      expect(currentStoredId.value).to.equal(id);
    });
  });
});
