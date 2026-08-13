// libraries
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';

// boot
import { i18n } from '../boot/i18n';

// composables
import { useApiPostValidateTeamMembershipInvitationEmail } from './useApiPostValidateTeamMembershipInvitationEmail';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';

/**
 * Invitation token orchestration composable
 * Coordinates the invitation flow: validation and store updates
 * Backend sync of the team ID happens later, through the normal
 * team-step submission (see registerChallenge.ts payloadMap)
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
   * Validates token, updates store, and removes token from URL
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
    // warn user if existing team selection will be replaced by the invitation
    if (
      registerChallengeStore.organizationId !== null ||
      registerChallengeStore.subsidiaryId !== null ||
      registerChallengeStore.teamId !== null
    ) {
      Notify.create({
        message: i18n.global.t(
          'validateTeamMembershipInvitationEmail.overwriteWarning',
        ),
        color: 'warning',
      });
    }
    // update store with invitation IDs
    registerChallengeStore.setInvitationOrganizationId(
      validationResponse.token.company_id,
    );
    registerChallengeStore.setInvitationSubsidiaryId(
      validationResponse.token.subsidiary_id,
    );
    registerChallengeStore.setInvitationTeamId(
      validationResponse.token.team_id,
    );
    registerChallengeStore.setInvitationOrganizationType(
      validationResponse.token.company_type,
    );
    logger?.debug(
      `Updated store: invitationOrganizationId=${validationResponse.token.company_id}, ` +
        `invitationSubsidiaryId=${validationResponse.token.subsidiary_id}, ` +
        `invitationTeamId=${validationResponse.token.team_id}, ` +
        `invitationOrganizationType=${validationResponse.token.company_type}`,
    );
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
