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
      `prefillOrganizationForPayment: orgId=<${invitationOrganizationId}>, type=<${invitationOrganizationType}>, payment=<${paymentSubject}>, match=<${isPaymentSubjectMatching}>, step2=<${step2State}>`,
    );
    // skip if no invitation data
    if (
      !invitationOrganizationId ||
      !invitationOrganizationType ||
      !paymentSubject
    )
      return;
    // check pre-fill condition: null OR step2 not yet left this session
    const shouldPrefill =
      organizationId === null || step2State !== StepVisitState.dirty;
    if (!shouldPrefill) {
      logger?.info(
        `Step2 already visited or org set, skipping pre-fill (orgId=<${organizationId}>, step2=<${step2State}>)`,
      );
      return;
    }
    // skip if payment subject does not equal invitation organization type
    if (!isPaymentSubjectMatching) {
      logger?.info(
        `Type mismatch: <${invitationOrganizationType}> vs <${paymentSubject}>, skipping org pre-fill`,
      );
      return;
    }
    // check if invitation organization exists in the filtered array
    const invitationOrganization = registerChallengeStore.organizations.find(
      (organization) => organization.id === invitationOrganizationId,
    );
    if (!invitationOrganization) {
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
   * Prefill when value is empty or step3 has not been visited
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
      logger?.info(
        `Step3 already visited or type set, skipping pre-fill (type=<${organizationType}>, step3=<${step3State}>)`,
      );
      return;
    }
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
      // pre-fill organization
      const invitationOrganization = registerChallengeStore.organizations.find(
        (organization) => organization.id === invitationOrgId,
      );
      if (invitationOrganization) {
        registerChallengeStore.setOrganizationId(invitationOrgId);
        logger?.info(`Pre-filled organization <${invitationOrgId}>`);
        // load subsidiaries for the pre-filled organization
        await registerChallengeStore.loadSubsidiariesToStore(logger);
        logger?.info('Loaded subsidiaries for pre-filled organization');
      }
    } else if (currentOrgId !== invitationOrgId) {
      // different organization ID filled, exit
      logger?.info(
        `Org mismatch <${currentOrgId}> vs <${invitationOrgId}>, skipping subsidiary`,
      );
      return;
    } else {
      // correct organization ID filled, ensure subsidiaries are loaded
      if (registerChallengeStore.subsidiaries.length === 0) {
        await registerChallengeStore.loadSubsidiariesToStore(logger);
        logger?.info('Loaded subsidiaries for pre-filled organization');
      }
    }
    // re-read organizationId after potential update
    const updatedOrgId = registerChallengeStore.organizationId;
    // pre-fill if value is empty or step4 has not been visited
    const shouldPrefillSub =
      currentSubId === null || step4State !== StepVisitState.dirty;
    // pre-fill if subsidiary ID matches
    if (shouldPrefillSub && updatedOrgId === invitationOrgId) {
      const invitationSubsidiary = registerChallengeStore.subsidiaries.find(
        (subsidiary) => subsidiary.id === invitationSubId,
      );
      if (invitationSubsidiary) {
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
    // check pre-fill condition: null OR step5 not yet left this session
    const shouldPrefill =
      currentTeamId === null || step5State !== StepVisitState.dirty;
    if (!shouldPrefill) {
      logger?.info(
        `Step5 already visited or team set, skipping pre-fill (teamId=<${currentTeamId}>, step5=<${step5State}>)`,
      );
      return;
    }
    // validate that organization matches if set
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
    // validate that subsidiary matches if set
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
