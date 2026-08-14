// libraries
import { watch } from 'vue';

// enums
import { PaymentSubject } from '../components/enums/Payment';
import { OrganizationType } from '../components/types/Organization';
import { StepVisitState } from '../components/enums/RegisterChallenge';

// stores
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Logger } from '../components/types/Logger';

/**
 * Coordinates pre-filling logic inside registration
 * @param {Logger | null} logger - Logger
 * @returns {Object} - Composable return object
 */
export const useInvitationPrefill = (logger: Logger | null) => {
  const registerChallengeStore = useRegisterChallengeStore();

  /**
   * Pre-fill organization when user selects company/school payment
   * Called when paymentSubject changes to company or school
   * Pre-fill when value is empty or step2 has not been visited
   */
  const prefillOrganizationForPayment = async (): Promise<void> => {
    const invitationOrganizationId =
      registerChallengeStore.getInvitationOrganizationId;
    const invitationOrganizationType =
      registerChallengeStore.getInvitationOrganizationType;
    const organizationId = registerChallengeStore.organizationId;
    const paymentSubject = registerChallengeStore.getPaymentSubject;
    const step2State = registerChallengeStore.getVisitedSteps.step2;
    const isPaymentSubjectMatching =
      (paymentSubject === PaymentSubject.company &&
        invitationOrganizationType === OrganizationType.company) ||
      (paymentSubject === PaymentSubject.school &&
        invitationOrganizationType === OrganizationType.school);
    logger?.debug(
      `Prefill organization for payment step, invitation organization ID is` +
        ` <${invitationOrganizationId}>, invitation organization type is` +
        ` <${invitationOrganizationType}>, payment subject is <${paymentSubject}>,` +
        ` is payment subject matching <${isPaymentSubjectMatching}>, registration step no. 2` +
        ` payment state is <${step2State}>.`,
    );
    // skip if no invitation data
    if (
      !invitationOrganizationId ||
      !invitationOrganizationType ||
      !paymentSubject
    )
      return;
    // value is empty or step2 has not been visited
    const shouldPrefill =
      organizationId === null || step2State !== StepVisitState.dirty;
    if (!shouldPrefill) {
      logger?.debug(
        `Registration step no. 2 payment is already visited <${step2State}>` +
          ` or organization ID was set <${organizationId}>, skipping pre-fill of` +
          ` organization.`,
      );
      return;
    }
    // skip if payment subject does not equal invitation organization type
    if (!isPaymentSubjectMatching) {
      logger?.debug(
        `Invitation organization type <${invitationOrganizationType}> is not equal` +
          ` payment subject <${paymentSubject}>, skipping pre-fill of organization.`,
      );
      return;
    }
    // check if invitation organization exists in the filtered array
    const invitationOrganization = registerChallengeStore.organizations.find(
      (organization) => organization.id === invitationOrganizationId,
    );
    if (!invitationOrganization) {
      logger?.debug(
        `Organization ID <${invitationOrganizationId}> not found,` +
          ` skipping pre-fill of organization.`,
      );
      return;
    }
    registerChallengeStore.setOrganizationId(invitationOrganizationId);
    logger?.debug(`Pre-filled organization ID <${invitationOrganizationId}>.`);
  };

  /**
   * Pre-fill organization type when user reaches participation step
   * Called when step becomes 3
   * Only pre-fill when payment subject is individual or voucher
   * Pre-fill when value is empty or step3 has not been visited
   */
  const prefillOrganizationType = async (): Promise<void> => {
    const invitationOrganizationType =
      registerChallengeStore.getInvitationOrganizationType;
    const paymentSubject = registerChallengeStore.getPaymentSubject;
    const organizationType = registerChallengeStore.organizationType;
    const step3State = registerChallengeStore.getVisitedSteps.step3;
    // skip if no invitation organization type
    if (!invitationOrganizationType) return;
    // check pre-fill condition: none OR step3 not yet left this session
    const shouldPrefill =
      organizationType === OrganizationType.none ||
      step3State !== StepVisitState.dirty;
    if (!shouldPrefill) {
      logger?.debug(
        `Registration step no. 3 participation was already visited` +
          ` <${step3State}> or organization type was set <${organizationType}>,` +
          ` skipping pre-fill of organization.`,
      );
      return;
    }
    // only pre-fill when payment is individual or voucher
    if (
      paymentSubject !== PaymentSubject.individual &&
      paymentSubject !== PaymentSubject.voucher
    ) {
      logger?.debug(
        `Payment subject <${paymentSubject}> type is locked, skipping pre-fill` +
          ` of organization type.`,
      );
      return;
    }
    registerChallengeStore.setOrganizationType(invitationOrganizationType);
    logger?.debug(
      `Pre-filled organization type <${invitationOrganizationType}>.`,
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
    if (registerChallengeStore.organizations.length > 0) {
      await applyOrganizationAndSubsidiaryPrefill(
        invitationOrgId,
        invitationSubId,
      );
    } else {
      // wait for organizations array to have data
      const stopWatch = watch(
        () => registerChallengeStore.organizations.length,
        async (orgsLength) => {
          if (orgsLength > 0) {
            stopWatch();
            await applyOrganizationAndSubsidiaryPrefill(
              invitationOrgId,
              invitationSubId,
            );
          }
        },
      );
    }
  };

  const applyOrganizationAndSubsidiaryPrefill = async (
    invitationOrgId: number,
    invitationSubId: number,
  ): Promise<void> => {
    const currentOrgId = registerChallengeStore.organizationId;
    const currentSubId = registerChallengeStore.subsidiaryId;
    const step4State = registerChallengeStore.getVisitedSteps.step4;
    // pre-fill if value is empty or step4 has not been visited
    const shouldPrefillOrg =
      currentOrgId === null || step4State !== StepVisitState.dirty;
    if (shouldPrefillOrg) {
      // pre-fill if we find organization
      const invitationOrganization = registerChallengeStore.organizations.find(
        (organization) => organization.id === invitationOrgId,
      );
      if (invitationOrganization) {
        registerChallengeStore.setOrganizationId(invitationOrgId);
        logger?.debug(`Pre-filled organization ID <${invitationOrgId}>.`);
        // load subsidiaries for the pre-filled organization
        await registerChallengeStore.loadSubsidiariesToStore(logger);
        logger?.debug(
          `Loaded subsidiaries for pre-filled organization ID` +
            ` <${invitationOrgId}>.`,
        );
      }
    } else if (currentOrgId !== invitationOrgId) {
      // different organization ID filled, exit
      logger?.debug(
        `Organization ID <${currentOrgId}> is not equal` +
          ` invitation organization ID <${invitationOrgId}>,` +
          ` skipping pre-fill of subsidiary.`,
      );
      return;
    } else {
      // correct organization ID filled, ensure subsidiaries are loaded
      if (registerChallengeStore.subsidiaries.length === 0) {
        await registerChallengeStore.loadSubsidiariesToStore(logger);
        logger?.debug(`
          Loaded subsidiaries for pre-filled organization ID <${invitationOrgId}>.`);
      }
    }
    // re-read organizationId after potential update
    const updatedOrgId = registerChallengeStore.organizationId;
    // pre-fill if value is empty or step4 has not been visited
    const shouldPrefillSub =
      currentSubId === null || step4State !== StepVisitState.dirty;
    // check if organization ID matches
    if (shouldPrefillSub && updatedOrgId === invitationOrgId) {
      // pre-fill if we find subsidiary
      const invitationSubsidiary = registerChallengeStore.subsidiaries.find(
        (subsidiary) => subsidiary.id === invitationSubId,
      );
      if (invitationSubsidiary) {
        registerChallengeStore.setSubsidiaryId(invitationSubId);
        logger?.debug(`Pre-filled subsidiary ID <${invitationSubId}>.`);
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
    const currentTeamId = registerChallengeStore.teamId;
    const step5State = registerChallengeStore.getVisitedSteps.step5;
    // pre-fill if value is empty or step5 has not been visited
    const shouldPrefill =
      currentTeamId === null || step5State !== StepVisitState.dirty;
    if (!shouldPrefill) {
      logger?.debug(
        `Registration step no. 5 choose team was already visited <${step5State}>` +
          ` or team was set <${currentTeamId}>, skipping pre-fill of team.`,
      );
      return;
    }
    // validate that organization matches if set
    if (
      invitationOrgId !== null &&
      currentOrgId !== null &&
      currentOrgId !== invitationOrgId
    ) {
      logger?.debug(
        `Organization ID  <${currentOrgId}> is not equal` +
          ` invitation organization ID <${invitationOrgId}>,` +
          ` skipping pre-fill of team.`,
      );
      return;
    }
    // validate that subsidiary matches if set
    if (
      invitationSubId !== null &&
      currentSubId !== null &&
      currentSubId !== invitationSubId
    ) {
      logger?.debug(
        `Subsidiary ID <${currentSubId}> is not equal` +
          ` invitation subsidairy ID <${invitationSubId}>,` +
          ` skipping pre-fill of team.`,
      );
      return;
    }
    // find invitation team
    const invitationTeam = registerChallengeStore.teams.find(
      (team) => team.id === invitationTeamId,
    );
    if (!invitationTeam) return;
    registerChallengeStore.setTeamId(invitationTeamId);
    logger?.debug(`Pre-filled team ID <${invitationTeamId}>.`);
  };

  return {
    prefillOrganizationForPayment,
    prefillOrganizationType,
    prefillOrganizationAndSubsidiary,
    prefillTeam,
  };
};
