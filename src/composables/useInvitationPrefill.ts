// libraries
import { watch } from 'vue';

// enums
import { PaymentSubject } from '../components/enums/Payment';
import { OrganizationType } from '../components/types/Organization';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Logger } from '../components/types/Logger';

/**
 * Invitation pre-fill orchestration composable
 * Coordinates pre-filling logic at registration checkpoints
 * @param {Logger | null} logger - Logger
 * @returns {Object} - Composable return object
 */
export const useInvitationPrefill = (logger: Logger | null) => {
  const registerChallengeStore = useRegisterChallengeStore();

  /**
   * Pre-fill organization when user selects company/school payment
   * Called when paymentSubject changes to company or school
   */
  const prefillOrganizationForPayment = async (
    paymentSubject: PaymentSubject,
  ): Promise<void> => {
    const invitationOrgId = registerChallengeStore.invitationOrganizationId;
    if (!invitationOrgId) return;
    if (registerChallengeStore.organizationId !== null) return;
    // wait for organizations to load
    if (registerChallengeStore.isLoadingOrganizations) {
      const stopWatch = watch(
        () => registerChallengeStore.isLoadingOrganizations,
        (isLoading) => {
          if (
            !isLoading &&
            registerChallengeStore.organizations.length > 0
          ) {
            stopWatch();
            applyOrganizationPrefillForPayment(paymentSubject, invitationOrgId);
          }
        },
      );
    } else if (registerChallengeStore.organizations.length > 0) {
      applyOrganizationPrefillForPayment(paymentSubject, invitationOrgId);
    }
  };

  const applyOrganizationPrefillForPayment = (
    paymentSubject: PaymentSubject,
    invitationOrgId: number,
  ): void => {
    // find invitation organization
    const invitationOrg = registerChallengeStore.organizations.find(
      (org) => org.id === invitationOrgId,
    );
    if (!invitationOrg) return;
    // check type compatibility
    const isCompatible =
      (paymentSubject === PaymentSubject.company &&
        invitationOrg.type === OrganizationType.company) ||
      (paymentSubject === PaymentSubject.school &&
        invitationOrg.type === OrganizationType.school);
    if (isCompatible) {
      registerChallengeStore.setOrganizationId(invitationOrgId);
      logger?.info(
        `Pre-filled organization ${invitationOrgId} for ${paymentSubject} payment`,
      );
    }
  };

  /**
   * Pre-fill organization type when user reaches participation step
   * Called when step becomes 3
   */
  const prefillOrganizationType = async (): Promise<void> => {
    const invitationOrgId = registerChallengeStore.invitationOrganizationId;
    if (!invitationOrgId) return;
    if (registerChallengeStore.organizationType !== OrganizationType.none)
      return;
    // wait for organizations to load
    if (registerChallengeStore.isLoadingOrganizations) {
      const stopWatch = watch(
        () => registerChallengeStore.isLoadingOrganizations,
        (isLoading) => {
          if (
            !isLoading &&
            registerChallengeStore.organizations.length > 0
          ) {
            stopWatch();
            applyOrganizationTypePrefill(invitationOrgId);
          }
        },
      );
    } else if (registerChallengeStore.organizations.length > 0) {
      applyOrganizationTypePrefill(invitationOrgId);
    }
  };

  const applyOrganizationTypePrefill = (invitationOrgId: number): void => {
    // find invitation organization
    const invitationOrg = registerChallengeStore.organizations.find(
      (org) => org.id === invitationOrgId,
    );
    if (!invitationOrg) return;
    registerChallengeStore.setOrganizationType(invitationOrg.type);
    logger?.info(
      `Pre-filled organization type ${invitationOrg.type} from invitation`,
    );
  };

  /**
   * Pre-fill organization and subsidiary when user reaches org selection step
   * Called when step becomes 4
   */
  const prefillOrganizationAndSubsidiary = async (): Promise<void> => {
    const invitationOrgId = registerChallengeStore.invitationOrganizationId;
    const invitationSubId = registerChallengeStore.invitationSubsidiaryId;
    if (!invitationOrgId || !invitationSubId) return;
    // wait for organizations and subsidiaries to load
    if (
      registerChallengeStore.isLoadingOrganizations ||
      registerChallengeStore.isLoadingSubsidiaries
    ) {
      const stopWatch = watch(
        () => [
          registerChallengeStore.isLoadingOrganizations,
          registerChallengeStore.isLoadingSubsidiaries,
        ],
        ([isLoadingOrgs, isLoadingSubs]) => {
          if (
            !isLoadingOrgs &&
            !isLoadingSubs &&
            registerChallengeStore.organizations.length > 0 &&
            registerChallengeStore.subsidiaries.length > 0
          ) {
            stopWatch();
            applyOrganizationAndSubsidiaryPrefill(
              invitationOrgId,
              invitationSubId,
            );
          }
        },
      );
    } else if (
      registerChallengeStore.organizations.length > 0 &&
      registerChallengeStore.subsidiaries.length > 0
    ) {
      applyOrganizationAndSubsidiaryPrefill(invitationOrgId, invitationSubId);
    }
  };

  const applyOrganizationAndSubsidiaryPrefill = (
    invitationOrgId: number,
    invitationSubId: number,
  ): void => {
    const currentOrgId = registerChallengeStore.organizationId;
    // pre-fill organization if null
    if (currentOrgId === null) {
      const invitationOrg = registerChallengeStore.organizations.find(
        (org) => org.id === invitationOrgId,
      );
      if (invitationOrg) {
        registerChallengeStore.setOrganizationId(invitationOrgId);
        logger?.info(`Pre-filled organization ${invitationOrgId}`);
      }
    } else if (currentOrgId !== invitationOrgId) {
      // organization mismatch - stop pre-filling subsidiary
      logger?.info(
        `Organization mismatch (current: ${currentOrgId}, invitation: ${invitationOrgId}) - skipping subsidiary pre-fill`,
      );
      return;
    }
    // pre-fill subsidiary if null (only if organization matches)
    if (registerChallengeStore.subsidiaryId === null) {
      const invitationSub = registerChallengeStore.subsidiaries.find(
        (sub) => sub.id === invitationSubId,
      );
      if (invitationSub) {
        registerChallengeStore.setSubsidiaryId(invitationSubId);
        logger?.info(`Pre-filled subsidiary ${invitationSubId}`);
      }
    }
  };

  /**
   * Pre-fill team when user reaches team selection step
   * Called when step becomes 5
   */
  const prefillTeam = async (): Promise<void> => {
    const invitationTeamId = registerChallengeStore.invitationTeamId;
    const invitationOrgId = registerChallengeStore.invitationOrganizationId;
    const invitationSubId = registerChallengeStore.invitationSubsidiaryId;
    if (!invitationTeamId) return;
    if (registerChallengeStore.teamId !== null) return;
    // wait for teams to load
    if (registerChallengeStore.isLoadingTeams) {
      const stopWatch = watch(
        () => registerChallengeStore.isLoadingTeams,
        (isLoading) => {
          if (!isLoading && registerChallengeStore.teams.length > 0) {
            stopWatch();
            applyTeamPrefill(
              invitationTeamId,
              invitationOrgId,
              invitationSubId,
            );
          }
        },
      );
    } else if (registerChallengeStore.teams.length > 0) {
      applyTeamPrefill(invitationTeamId, invitationOrgId, invitationSubId);
    }
  };

  const applyTeamPrefill = (
    invitationTeamId: number,
    invitationOrgId: number | null,
    invitationSubId: number | null,
  ): void => {
    const currentOrgId = registerChallengeStore.organizationId;
    const currentSubId = registerChallengeStore.subsidiaryId;
    // validate organization matches (if set)
    if (
      invitationOrgId !== null &&
      currentOrgId !== null &&
      currentOrgId !== invitationOrgId
    ) {
      logger?.info(
        `Organization mismatch (current: ${currentOrgId}, invitation: ${invitationOrgId}) - skipping team pre-fill`,
      );
      return;
    }
    // validate subsidiary matches (if set)
    if (
      invitationSubId !== null &&
      currentSubId !== null &&
      currentSubId !== invitationSubId
    ) {
      logger?.info(
        `Subsidiary mismatch (current: ${currentSubId}, invitation: ${invitationSubId}) - skipping team pre-fill`,
      );
      return;
    }
    // find invitation team
    const invitationTeam = registerChallengeStore.teams.find(
      (team) => team.id === invitationTeamId,
    );
    if (!invitationTeam) return;
    registerChallengeStore.setTeamId(invitationTeamId);
    logger?.info(`Pre-filled team ${invitationTeamId}`);
  };

  return {
    prefillOrganizationForPayment,
    prefillOrganizationType,
    prefillOrganizationAndSubsidiary,
    prefillTeam,
  };
};
