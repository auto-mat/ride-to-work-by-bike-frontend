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
 * Set photo value in register challenge store
 * @param {function} useRegisterChallengeStore - `useRegisterChallengeStore` function
 *                                                to initialize register challenge store
 * @param {object | null} photo - photo object to set (or `null` to clear it)
 */
Cypress.Commands.add(
  'setPhotoStoreState',
  (useRegisterChallengeStore, photo) => {
    cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
      const storedPhoto = computed(() => registerChallengeStore.getPhoto);
      registerChallengeStore.setPhoto(photo);
      cy.wrap(storedPhoto).should((currentStoredPhoto) => {
        expect(currentStoredPhoto.value).to.deep.equal(photo);
      });
    });
  },
);
