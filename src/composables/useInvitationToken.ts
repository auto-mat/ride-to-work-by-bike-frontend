// libraries
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// composables
import { useApiPostValidateTeamMembershipInvitationEmail } from './useApiPostValidateTeamMembershipInvitationEmail';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';

/**
 * Invitation token orchestration composable
 * Coordinates the entire invitation flow: validation, store updates, and backend sync
 * @param {Logger | null} logger - Logger
 * @returns {Object} - Composable return object
 */
export const useInvitationToken = (
  logger: Logger | null,
): {
  isLoading: Ref<boolean>;
  processInvitation: () => Promise<void>;
} => {
  const route = useRoute();
  const router = useRouter();
  const isLoading = ref<boolean>(false);
  const registerChallengeStore = useRegisterChallengeStore();
  const { postValidateTeamMembershipInvitationEmail } =
    useApiPostValidateTeamMembershipInvitationEmail(logger);

  /**
   * Process invitation token from URL
   * Validates token, updates store, syncs to backend, and removes token from URL
   * @returns {Promise<void>}
   */
  const processInvitation = async (): Promise<void> => {
    // delay for Cypress testing to pick up the token
    if (window.Cypress) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // read token from URL query params
    logger?.debug(
      `processInvitation called - route.query: ${JSON.stringify(route.query)}`,
    );
    const invitationToken = route.query.invitationToken as string | undefined;
    if (!invitationToken) {
      logger?.debug('No invitation token found in URL.');
      return;
    }
    logger?.debug(`Processing invitation token: ${invitationToken}`);
    // post invitation token to validate
    isLoading.value = true;
    const validationResponse = await postValidateTeamMembershipInvitationEmail({
      token: invitationToken,
    });
    if (!validationResponse) {
      logger?.info('Invitation token validation failed.');
      isLoading.value = false;
      return;
    }
    // successful validation
    logger?.debug(
      `Invitation token validated. Team ID: ${validationResponse.token.team_id}`,
    );
    // update store with IDs
    registerChallengeStore.setOrganizationId(
      validationResponse.token.company_id,
    );
    registerChallengeStore.setSubsidiaryId(
      validationResponse.token.subsidiary_id,
    );
    registerChallengeStore.setTeamId(validationResponse.token.team_id);
    logger?.debug(
      `Updated store: organizationId=${validationResponse.token.company_id}, ` +
        `subsidiaryId=${validationResponse.token.subsidiary_id}, ` +
        `teamId=${validationResponse.token.team_id}`,
    );
    // post team ID to backend
    const postResponse = await registerChallengeStore.postRegisterChallenge({
      team_id: validationResponse.token.team_id,
    });
    if (!postResponse) {
      logger?.info('Failed to post team ID to backend.');
      isLoading.value = false;
      return;
    }
    logger?.debug('Posted team ID to backend.');
    // remove invitation token from URL
    const query = { ...route.query };
    delete query.invitationToken;
    await router.replace({ query });
    isLoading.value = false;
  };

  return {
    isLoading,
    processInvitation,
  };
};
