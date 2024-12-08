// composables
import { i18n } from '../boot/i18n';

import { FormSelectTableLabels } from '../components/types/Form';

// enums
import { OrganizationLevel } from '../components/types/Organization';

export const useSelectTable = () => {
  const getSelectTableLabels = (
    organizationLevel: OrganizationLevel,
  ): FormSelectTableLabels => {
    switch (organizationLevel) {
      case OrganizationLevel.team:
        return {
          label: i18n.global.t('form.team.labelTeam'),
          buttonAddNew: i18n.global.t('form.team.buttonAddTeam'),
          buttonDialog: i18n.global.t('form.team.buttonAddTeam'),
          titleDialog: i18n.global.t('form.team.titleAddTeam'),
        };
      case OrganizationLevel.subsidiary:
        return {
          label: i18n.global.t('form.subsidiary.labelSubsidiary'),
          buttonAddNew: i18n.global.t('form.subsidiary.buttonAddSubsidiary'),
          buttonDialog: i18n.global.t('form.subsidiary.buttonAddSubsidiary'),
          titleDialog: i18n.global.t('form.subsidiary.titleAddSubsidiary'),
        };
      case OrganizationLevel.organization:
        return {
          label: i18n.global.t('form.company.labelCompany'),
          buttonAddNew: i18n.global.t('register.challenge.buttonAddCompany'),
          buttonDialog: i18n.global.t('form.company.buttonAddCompany'),
          titleDialog: i18n.global.t('form.company.titleAddCompany'),
        };
      default:
        return {
          label: '',
          buttonAddNew: '',
          buttonDialog: '',
          titleDialog: '',
        };
    }
  };

  return {
    getSelectTableLabels,
  };
};
