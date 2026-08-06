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
  const prefillOrganizationForPayment = async (): Promise<void> => {
    const invitationOrganizationId =
      registerChallengeStore.getInvitationOrganizationId;
    const invitationOrganizationType =
      registerChallengeStore.getInvitationOrganizationType;
    const organizationId = registerChallengeStore.organizationId;
    const paymentSubject = registerChallengeStore.getPaymentSubject;
    const isPaymentSubjectMatching =
      (paymentSubject === PaymentSubject.company &&
        invitationOrganizationType === OrganizationType.company) ||
      (paymentSubject === PaymentSubject.school &&
        invitationOrganizationType === OrganizationType.school);
    logger?.debug(
      `prefillOrganizationForPayment: orgId=<${invitationOrganizationId}>, type=<${invitationOrganizationType}>, payment=<${paymentSubject}>, match=<${isPaymentSubjectMatching}>`,
    );
    // skip if no invitation data or organization already selected
    if (
      !invitationOrganizationId ||
      !invitationOrganizationType ||
      organizationId ||
      !paymentSubject
    )
      return;
    // skip if payment subject does not equal invitation organization type
    if (!isPaymentSubjectMatching) {
      logger?.info(
        `Type mismatch: <${invitationOrganizationType}> vs <${paymentSubject}>, skipping org pre-fill`,
      );
      return;
    }
    // check if invitation organization exists in the filtered array
    const invitationOrg = registerChallengeStore.organizations.find(
      (org) => org.id === invitationOrganizationId,
    );
    if (!invitationOrg) {
      logger?.info(
        `Organization <${invitationOrganizationId}> not found, skipping pre-fill`,
      );
      return;
    }
    registerChallengeStore.setOrganizationId(invitationOrganizationId);
    logger?.info(`Pre-filled organization <${invitationOrganizationId}>`);
  };

  /**
   * Pre-fill organization type when user reaches participation step
   * Called when step becomes 3
   * Only pre-fill when payment subject is individual or voucher
   */
  const prefillOrganizationType = async (): Promise<void> => {
    const invitationOrganizationType =
      registerChallengeStore.getInvitationOrganizationType;
    const paymentSubject = registerChallengeStore.getPaymentSubject;
    // skip if no invitation organization type
    if (!invitationOrganizationType) return;
    // skip if organization type already selected
    if (registerChallengeStore.organizationType !== OrganizationType.none)
      return;
    // only pre-fill when payment is individual or voucher
    if (
      paymentSubject !== PaymentSubject.individual &&
      paymentSubject !== PaymentSubject.voucher
    ) {
      logger?.info(
        `Payment subject <${paymentSubject}> type locked, skipping pre-fill`,
      );
      return;
    }
    registerChallengeStore.setOrganizationType(invitationOrganizationType);
    logger?.info(
      `Pre-filled organization type <${invitationOrganizationType}>`,
    );
  };

  /**
   * Pre-fill organization and subsidiary when user reaches org selection step
   * Called when step becomes 4
   */
  const prefillOrganizationAndSubsidiary = async (): Promise<void> => {
    const invitationOrgId = registerChallengeStore.getInvitationOrganizationId;
    const invitationSubId = registerChallengeStore.getInvitationSubsidiaryId;
    if (!invitationOrgId || !invitationSubId) return;
    // check if we can pre-fill immediately
    if (
      registerChallengeStore.organizations.length > 0 &&
      registerChallengeStore.subsidiaries.length > 0
    ) {
      applyOrganizationAndSubsidiaryPrefill(invitationOrgId, invitationSubId);
    } else {
      // wait for both arrays to have data
      const stopWatch = watch(
        () => [
          registerChallengeStore.organizations.length,
          registerChallengeStore.subsidiaries.length,
        ],
        ([orgsLength, subsLength]) => {
          if (orgsLength > 0 && subsLength > 0) {
            stopWatch();
            applyOrganizationAndSubsidiaryPrefill(
              invitationOrgId,
              invitationSubId,
            );
          }
        },
      );
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
        logger?.info(`Pre-filled organization <${invitationOrgId}>`);
      }
    } else if (currentOrgId !== invitationOrgId) {
      // organization mismatch - stop pre-filling subsidiary
      logger?.info(
        `Org mismatch <${currentOrgId}> vs <${invitationOrgId}>, skipping subsidiary`,
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
        logger?.info(`Pre-filled subsidiary <${invitationSubId}>`);
      }
    }
  };

  /**
   * Pre-fill team when user reaches team selection step
   * Called when step becomes 5
   */
  const prefillTeam = async (): Promise<void> => {
    const invitationTeamId = registerChallengeStore.getInvitationTeamId;
    const invitationOrgId = registerChallengeStore.getInvitationOrganizationId;
    const invitationSubId = registerChallengeStore.getInvitationSubsidiaryId;
    if (!invitationTeamId) return;
    if (registerChallengeStore.teamId !== null) return;
    // check if we can pre-fill immediately
    if (registerChallengeStore.teams.length > 0) {
      applyTeamPrefill(invitationTeamId, invitationOrgId, invitationSubId);
    } else {
      // wait for teams array to populate
      const stopWatch = watch(
        () => registerChallengeStore.teams.length,
        (teamsLength) => {
          if (teamsLength > 0) {
            stopWatch();
            applyTeamPrefill(
              invitationTeamId,
              invitationOrgId,
              invitationSubId,
            );
          }
        },
      );
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
        `Org mismatch <${currentOrgId}> vs <${invitationOrgId}>, skipping team`,
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
        `Subsidiary mismatch <${currentSubId}> vs <${invitationSubId}>, skipping team`,
      );
      return;
    }
    // find invitation team
    const invitationTeam = registerChallengeStore.teams.find(
      (team) => team.id === invitationTeamId,
    );
    if (!invitationTeam) return;
    registerChallengeStore.setTeamId(invitationTeamId);
    logger?.info(`Pre-filled team <${invitationTeamId}>`);
  };

  return {
    prefillOrganizationForPayment,
    prefillOrganizationType,
    prefillOrganizationAndSubsidiary,
    prefillTeam,
  };
};
