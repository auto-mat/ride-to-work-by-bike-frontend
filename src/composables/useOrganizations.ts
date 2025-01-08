// composables
import { i18n } from '../boot/i18n';

// enums
import { OrganizationType } from '../components/types/Organization';

// types
export type OrganizationLabels = {
  titleDialog: string;
  titleDialogAddress: string;
  label: string;
  labelAddress: string;
  labelForCoordinator: string;
  labelName: string;
  labelShort: string;
  messageNoResult: string;
  buttonDialog: string;
};

export const useOrganizations = () => {
  const getOrganizationLabels = (
    organizationType: OrganizationType,
  ): OrganizationLabels => {
    switch (organizationType) {
      case OrganizationType.company:
        return {
          titleDialog: i18n.global.t('form.company.titleAddCompany'),
          titleDialogAddress: i18n.global.t('form.company.titleAddAddress'),
          label: i18n.global.t('form.labelCompany'), // used in register coordinator form
          labelAddress: i18n.global.t('form.company.labelAddress'),
          labelForCoordinator: i18n.global.t('form.labelCompanyForCoordinator'),
          labelName: i18n.global.t('form.company.labelCompany'), // used in SelectTable
          labelShort: i18n.global.t('form.labelCompanyShort'), // used in "add new" dialog
          messageNoResult: i18n.global.t('form.messageNoCompany'),
          buttonDialog: i18n.global.t('form.company.buttonAddCompany'),
        };
      case OrganizationType.school:
        return {
          titleDialog: i18n.global.t('form.company.titleAddSchool'),
          titleDialogAddress: i18n.global.t('form.company.titleAddAddress'),
          label: i18n.global.t('form.labelSchool'), // used in register coordinator form
          labelAddress: i18n.global.t('form.company.labelAddressSchool'),
          labelForCoordinator: i18n.global.t('form.labelSchoolForCoordinator'),
          labelName: i18n.global.t('form.company.labelSchool'), // used in SelectTable
          labelShort: i18n.global.t('form.labelSchoolShort'), // used in "add new" dialog
          messageNoResult: i18n.global.t('form.messageNoSchool'),
          buttonDialog: i18n.global.t('form.company.buttonAddSchool'),
        };
      case OrganizationType.family:
        return {
          titleDialog: i18n.global.t('form.company.titleAddFamily'),
          titleDialogAddress: i18n.global.t(
            'form.company.titleAddAddressFamily',
          ),
          label: i18n.global.t('form.labelFamily'), // used in register coordinator form
          labelAddress: i18n.global.t('form.company.labelAddressFamily'),
          labelForCoordinator: i18n.global.t('form.labelFamilyForCoordinator'),
          labelName: i18n.global.t('form.company.labelFamily'), // used in SelectTable
          labelShort: i18n.global.t('form.labelFamilyShort'), // used in "add new" dialog
          messageNoResult: i18n.global.t('form.messageNoFamily'),
          buttonDialog: i18n.global.t('form.company.buttonAddFamily'),
        };
      default:
        return {
          titleDialog: '',
          titleDialogAddress: '',
          label: '',
          labelAddress: '',
          labelForCoordinator: '',
          labelName: '',
          labelShort: '',
          messageNoResult: '',
          buttonDialog: '',
        };
    }
  };

  return {
    getOrganizationLabels,
  };
};
