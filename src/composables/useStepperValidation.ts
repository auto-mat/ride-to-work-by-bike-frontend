// libraries
import { QStep, QStepper } from 'quasar';

// types
import type { Ref } from 'vue';

export const useStepperValidation = ({
  step,
  stepperRef,
  stepPersonalDetailsRef,
  stepPaymentRef,
  stepParticipationRef,
  stepCompanyRef,
}: {
  step: Ref<number>;
  stepperRef: Ref<typeof QStepper | null>;
  stepPersonalDetailsRef: Ref<typeof QStep | null>;
  stepPaymentRef: Ref<typeof QStep | null>;
  stepParticipationRef: Ref<typeof QStep | null>;
  stepCompanyRef: Ref<typeof QStep | null>;
}) => {
  const onContinue = async () => {
    if (!stepperRef.value) return;
    switch (step.value) {
      case 1:
        if (!stepPersonalDetailsRef.value) return;
        const valid: boolean = await stepPersonalDetailsRef.value.validate();
        if (valid) {
          stepperRef.value.next();
        }
        break;
      case 2:
        if (!stepPaymentRef.value) return;
        stepPaymentRef.value.validate();
        if (!stepPaymentRef.value.hasError) {
          stepperRef.value.next();
        }
        break;
      case 3:
        if (!stepParticipationRef.value) return;
        stepParticipationRef.value.validate();
        if (!stepParticipationRef.value.hasError) {
          stepperRef.value.next();
        }
        break;
      case 3:
        if (!stepCompanyRef.value) return;
        stepCompanyRef.value.validate();
        if (!stepCompanyRef.value.hasError) {
          stepperRef.value.next();
        }
        break;
      default:
        break;
    }
  };

  const onBack = () => {
    if (!stepperRef.value) return;
    stepperRef.value.previous();
  };

  return {
    onBack,
    onContinue,
  };
};
