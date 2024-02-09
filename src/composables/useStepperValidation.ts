// libraries
import { QForm, QStepper } from 'quasar';

// types
import type { Ref } from 'vue';

/**
 * This function handles the validation and navigation logic for the stepper.
 * It is used in the `RegisterChallengePage`.
 */
export const useStepperValidation = ({
  step,
  stepperRef,
  stepPersonalDetailsRef,
  stepPaymentRef,
  stepParticipationRef,
  stepCompanyRef,
  stepTeamRef,
}: {
  step: Ref<number>;
  stepperRef: Ref<typeof QStepper | null>;
  stepPersonalDetailsRef: Ref<typeof QForm | null>;
  stepPaymentRef: Ref<typeof QForm | null>;
  stepParticipationRef: Ref<typeof QForm | null>;
  stepCompanyRef: Ref<typeof QForm | null>;
  stepTeamRef: Ref<typeof QForm | null>;
}): {
  onBack: () => void;
  onContinue: () => Promise<void>;
} => {
  /**
   * Function to navigate forward in the stepper.
   * For each step, it checks if the appropriate form is valid.
   * If the form is valid, it moves to the next step.
   * If the form is not valid, it scrolls up to show invalid fields.
   * @returns Promise<void>
   */
  const onContinue = async (): Promise<void> => {
    if (!stepperRef.value) return;

    // determine step
    switch (step.value) {
      // validate personal details step
      case 1:
        if (!stepPersonalDetailsRef.value) return;
        const isValidPersonalDetails: boolean =
          await stepPersonalDetailsRef.value.validate();
        if (isValidPersonalDetails) {
          stepperRef.value.next();
        } else {
          stepPersonalDetailsRef.value.$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
        break;
      // validate payment step
      case 2:
        if (!stepPaymentRef.value) return;
        const isValidPayment: boolean = await stepPaymentRef.value.validate();
        if (isValidPayment) {
          stepperRef.value.next();
        } else {
          stepPaymentRef.value.$el.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      // validate participation step
      case 3:
        if (!stepParticipationRef.value) return;
        const isValidParticipation: boolean =
          await stepParticipationRef.value.validate();
        if (isValidParticipation) {
          stepperRef.value.next();
        } else {
          stepParticipationRef.value.$el.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      // validate company step
      case 4:
        if (!stepCompanyRef.value) return;
        const isValidCompany: boolean = await stepCompanyRef.value.validate();
        if (isValidCompany) {
          stepperRef.value.next();
        } else {
          stepCompanyRef.value.$el.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      // validate team step
      case 5:
        if (!stepTeamRef.value) return;
        const isValidTeam: boolean = await stepTeamRef.value.validate();
        if (isValidTeam) {
          stepperRef.value.next();
        } else {
          stepTeamRef.value.$el.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      default:
        break;
    }
  };

  /**
   * Function to navigate back in the stepper.
   * If the current step is not the first step, it moves to the previous step.
   * If the current step is the first step, it does nothing.
   * @returns void
   */
  const onBack = (): void => {
    if (!stepperRef.value || step.value === 1) return;
    stepperRef.value.previous();
  };

  return {
    onBack,
    onContinue,
  };
};
