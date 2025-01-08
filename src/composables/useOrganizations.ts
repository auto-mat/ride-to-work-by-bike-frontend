// composables
import { i18n } from '../boot/i18n';

// enums
import { OrganizationType } from '../components/types/Organization';

// types
export type OrganizationLabels = {
  titleDialog: string;
  titleDialogAddress: string;
  hintCityChallenge: string;
  label: string;
  labelAddress: string;
  labelCityChallenge: string;
  labelForCoordinator: string;
  labelName: string;
  labelShort: string;
  messageNoResult: string;
  buttonDialog: string;
  sectionTitleSubsidiaryAddress: string;
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
          hintCityChallenge: i18n.global.t('form.company.hintCityChallenge'),
          label: i18n.global.t('form.labelCompany'), // used in register coordinator form
          labelAddress: i18n.global.t('form.company.labelAddress'),
          labelCityChallenge: i18n.global.t('form.company.labelCityChallenge'),
          labelForCoordinator: i18n.global.t('form.labelCompanyForCoordinator'),
          labelName: i18n.global.t('form.company.labelCompany'), // used in SelectTable
          labelShort: i18n.global.t('form.labelCompanyShort'), // used in "add new" dialog
          messageNoResult: i18n.global.t('form.messageNoCompany'),
          buttonDialog: i18n.global.t('form.company.buttonAddCompany'),
          sectionTitleSubsidiaryAddress: i18n.global.t(
            'form.company.titleSubsidiaryAddress',
          ),
        };
      case OrganizationType.school:
        return {
          titleDialog: i18n.global.t('form.company.titleAddSchool'),
          titleDialogAddress: i18n.global.t('form.company.titleAddAddress'),
          hintCityChallenge: i18n.global.t('form.company.hintCityChallenge'),
          label: i18n.global.t('form.labelSchool'), // used in register coordinator form
          labelAddress: i18n.global.t('form.company.labelAddressSchool'),
          labelCityChallenge: i18n.global.t('form.company.labelCityChallenge'),
          labelForCoordinator: i18n.global.t('form.labelSchoolForCoordinator'),
          labelName: i18n.global.t('form.company.labelSchool'), // used in SelectTable
          labelShort: i18n.global.t('form.labelSchoolShort'), // used in "add new" dialog
          messageNoResult: i18n.global.t('form.messageNoSchool'),
          buttonDialog: i18n.global.t('form.company.buttonAddSchool'),
          sectionTitleSubsidiaryAddress: i18n.global.t(
            'form.company.titleSubsidiaryAddress',
          ),
        };
      case OrganizationType.family:
        return {
          titleDialog: i18n.global.t('form.company.titleAddFamily'),
          titleDialogAddress: i18n.global.t(
            'form.company.titleAddAddressFamily',
          ),
          hintCityChallenge: i18n.global.t(
            'form.company.hintCityChallengeFamily',
          ),
          label: i18n.global.t('form.labelFamily'), // used in register coordinator form
          labelAddress: i18n.global.t('form.company.labelAddressFamily'),
          labelCityChallenge: i18n.global.t(
            'form.company.labelCityChallengeFamily',
          ),
          labelForCoordinator: i18n.global.t('form.labelFamilyForCoordinator'),
          labelName: i18n.global.t('form.company.labelFamily'), // used in SelectTable
          labelShort: i18n.global.t('form.labelFamilyShort'), // used in "add new" dialog
          messageNoResult: i18n.global.t('form.messageNoFamily'),
          buttonDialog: i18n.global.t('form.company.buttonAddFamily'),
          sectionTitleSubsidiaryAddress: i18n.global.t('form.labelAddress'),
        };
      default:
        return {
          titleDialog: '',
          titleDialogAddress: '',
          hintCityChallenge: '',
          label: '',
          labelAddress: '',
          labelCityChallenge: '',
          labelForCoordinator: '',
          labelName: '',
          labelShort: '',
          messageNoResult: '',
          buttonDialog: '',
          sectionTitleSubsidiaryAddress: '',
        };
    }
  };

  return {
    getOrganizationLabels,
  };
};
