// types
import type {
  RegisterChallengePersonalDetailsForm,
  RegisterChallengeCoordinatorForm,
} from '../components/types/RegisterChallenge';

// enums
import { Gender } from '../components/types/Profile';
import { PaymentState } from '../components/enums/Payment';
import { PaymentSubject } from '../components/enums/Payment';
import { OrganizationType } from '../components/types/Organization';
import { PaymentCategory } from '../components/types/ApiPayu';
import { NewsletterType } from '../components/types/Newsletter';

// utils
import { deepObjectWithSimplePropsCopy } from './index';

export const emptyFormPersonalDetails: RegisterChallengePersonalDetailsForm = {
  firstName: '',
  lastName: '',
  newsletter: [] as NewsletterType[],
  nickname: '',
  gender: null as Gender | null,
  terms: false,
};

export const emptyFormRegisterCoordinator: RegisterChallengeCoordinatorForm = {
  jobTitle: '',
  phone: '',
  responsibility: false,
  terms: false,
};

export const getRegisterChallengeEmptyPersistentState = () => ({
  personalDetails: deepObjectWithSimplePropsCopy(emptyFormPersonalDetails),
  paymentAmount: null,
  paymentState: PaymentState.none,
  paymentSubject: PaymentSubject.individual,
  organizationType: OrganizationType.none,
  organizationId: null,
  subsidiaryId: null,
  teamId: null,
  merchId: null,
  voucher: null,
  formRegisterCoordinator: deepObjectWithSimplePropsCopy(
    emptyFormRegisterCoordinator,
  ),
  telephone: '',
  telephoneOptIn: false,
  isPayuTransactionInitiated: false,
  isSelectedRegisterCoordinator: false,
  isUserOrganizationAdmin: null,
  hasOrganizationAdmin: null,
  paymentCategory: PaymentCategory.none,
});
