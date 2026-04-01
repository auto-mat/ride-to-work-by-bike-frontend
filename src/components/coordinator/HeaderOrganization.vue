<script lang="ts">
/**
 * HeaderOrganization Component
 *
 * @description * Use this component to display information about an
 * organization.
 * Note: This component is commonly used on `CompanyCoordinatorPage`.
 *
 * @emits
 * - `export`: Emitted when the user clicks on the export button.
 *   It should have no payload and be handled in the parent component.
 *
 * @example
 * <header-organization />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104524&t=imgBE8Jw7Jgty90T-1)
 */

// libraries
import { computed, defineComponent, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormFieldAddress from '../form/FormFieldAddress.vue';
import FormFieldBusinessId from '../form/FormFieldBusinessId.vue';
import FormFieldBusinessVatId from '../form/FormFieldBusinessVatId.vue';

// stores
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// enums
import { ExportFileType } from '../enums/Coordinator';

// utils
import { deepObjectWithSimplePropsCopy } from '../../utils';
import { getEmptyFormAddress } from '../../utils/get_empty_form_address';

// types
import type {
  AdminOrganisation,
  AdminSubsidiary,
} from '../types/AdminOrganisation';
import type { FormCompanyAddressFields } from '../types/Form';

export default defineComponent({
  name: 'HeaderOrganization',
  components: {
    DialogDefault,
    FormFieldAddress,
    FormFieldBusinessId,
    FormFieldBusinessVatId,
  },
  emits: {
    export: (fileType: ExportFileType) => !!fileType,
  },
  setup() {
    const adminOrganisationStore = useAdminOrganisationStore();

    const currentAdminOrganisation = computed((): AdminOrganisation => {
      return adminOrganisationStore.getCurrentAdminOrganisation ?? {};
    });

    const organizationTitle = computed((): string => {
      return currentAdminOrganisation.value.name ?? '';
    });

    const organizationId = computed((): string => {
      return currentAdminOrganisation.value.ico ?? '';
    });

    const subsidiaries = computed((): AdminSubsidiary[] => {
      return currentAdminOrganisation.value.subsidiaries ?? [];
    });

    const subsidiariesCount = computed((): number => {
      return subsidiaries.value.length;
    });

    // provides total count of members of all teams in all subsidiaries
    const membersCount = computed((): number => {
      if (!subsidiaries.value.length) {
        return 0;
      }
      return subsidiaries.value.reduce((totalMembers, subsidiary): number => {
        const subsidiaryMembers = subsidiary.teams.reduce(
          (teamTotal, team): number => {
            const teamMemberCount =
              team.members_without_paid_entry_fee_by_org_coord.length +
              team.members_with_paid_entry_fee_by_org_coord.length +
              team.other_members.length;
            return teamTotal + teamMemberCount;
          },
          0,
        );
        return totalMembers + subsidiaryMembers;
      }, 0);
    });

    // organization dialog
    const isEditOrganizationDialogOpen = ref<boolean>(false);
    const organizationEditFormRef = ref<QForm | null>(null);
    const organizationEditIco = ref<string>('');
    const organizationEditDic = ref<string>('');
    const organizationEditAddress = ref<FormCompanyAddressFields>(
      deepObjectWithSimplePropsCopy(
        getEmptyFormAddress(),
      ) as FormCompanyAddressFields,
    );

    const isLoadingUpdateOrganization = computed<boolean>(
      () => adminOrganisationStore.getIsLoadingUpdateOrganization,
    );

    const onOpenEditOrganizationDialog = (): void => {
      const org = currentAdminOrganisation.value;
      // init values
      organizationEditIco.value = org.ico ?? '';
      organizationEditDic.value = org.dic ?? '';
      // build address with existing values if available
      organizationEditAddress.value = deepObjectWithSimplePropsCopy({
        ...getEmptyFormAddress(),
        street: org.street ?? '',
        houseNumber: org.street_number ?? '',
        city: org.city ?? '',
        zip: org.psc ?? '',
      }) as FormCompanyAddressFields;
      // open dialog
      isEditOrganizationDialogOpen.value = true;
    };

    const onCloseEditOrganizationDialog = (): void => {
      if (organizationEditFormRef.value) {
        organizationEditFormRef.value.reset();
      }
      // reset values
      organizationEditIco.value = '';
      organizationEditDic.value = '';
      organizationEditAddress.value = deepObjectWithSimplePropsCopy(
        getEmptyFormAddress(),
      ) as FormCompanyAddressFields;
      // close dialog
      isEditOrganizationDialogOpen.value = false;
    };

    const onSubmitEditOrganization = async (): Promise<void> => {
      if (organizationEditFormRef.value && currentAdminOrganisation.value.id) {
        const isFormValid = await organizationEditFormRef.value.validate();
        if (isFormValid) {
          await adminOrganisationStore.updateOrganization(
            currentAdminOrganisation.value.id,
            {
              ico: organizationEditIco.value,
              dic: organizationEditDic.value,
              address: organizationEditAddress.value,
            },
          );
          onCloseEditOrganizationDialog();
        } else {
          organizationEditFormRef.value.$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };

    // check for edit organization dialog request on mount (from invoice form)
    onMounted(() => {
      if (adminOrganisationStore.isEditOrganizationDialogRequested) {
        onOpenEditOrganizationDialog();
        adminOrganisationStore.clearEditOrganizationDialogRequest();
      }
    });

    return {
      ExportFileType,
      organizationId,
      organizationTitle,
      subsidiariesCount,
      membersCount,
      isEditOrganizationDialogOpen,
      organizationEditFormRef,
      organizationEditIco,
      organizationEditDic,
      organizationEditAddress,
      isLoadingUpdateOrganization,
      onOpenEditOrganizationDialog,
      onCloseEditOrganizationDialog,
      onSubmitEditOrganization,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-y-md items-center" data-cy="header-organization">
    <!-- Organization data -->
    <div class="col-12 col-sm">
      <div class="row q-col-gutter-x-md">
        <div class="col-auto q-mr-md">
          <q-avatar square size="96px" data-cy="header-organization-image">
            <q-icon
              color="secondary"
              name="svguse:icons/drawer_menu/icons.svg#lucide-building"
              size="96px"
              data-cy="header-organization-image-icon"
            />
          </q-avatar>
        </div>
        <div class="col">
          <div class="q-pt-sm" data-cy="header-organization-data">
            <!-- Title -->
            <h3
              class="text-h5 text-weight-bold q-my-none"
              data-cy="header-organization-title"
            >
              {{ organizationTitle }}
            </h3>
            <!-- Metadata -->
            <div class="row text-subtitle2 q-col-gutter-x-lg q-mt-xs">
              <!-- Organization ID -->
              <div v-if="organizationId" class="col-auto q-py-sm">
                {{ $t('coordinator.labelOrganizationId') }}:
                {{ organizationId }}
              </div>
              <!-- Subsidiaries -->
              <q-chip
                color="transparent"
                icon="mdi-office-building"
                data-cy="header-organization-branch-count"
              >
                {{ subsidiariesCount }}
                {{ $t('coordinator.labelBranches', subsidiariesCount) }}
              </q-chip>
              <!-- Members -->
              <q-chip
                color="transparent"
                icon="mdi-account"
                data-cy="header-organization-member-count"
              >
                {{ membersCount }}
                {{ $t('coordinator.labelMembers', membersCount) }}
              </q-chip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Button: Export -->
    <div class="col-12 col-sm-auto">
      <div class="column q-gutter-x-md q-gutter-y-sm">
        <!-- Button: Edit Organization -->
        <q-btn
          unelevated
          rounded
          outline
          color="primary"
          class="q-ml-auto flex items-center"
          data-cy="header-organization-button-edit"
          @click.prevent="onOpenEditOrganizationDialog"
        >
          <q-icon name="mdi-pencil" size="18px" class="q-mr-sm" />
          {{ $t('coordinator.buttonEditOrganization') }}
        </q-btn>
        <!-- Button: Export dropdown -->
        <q-btn-dropdown
          unelevated
          rounded
          outline
          color="primary"
          class="q-ml-auto"
          data-cy="header-organization-button-export"
        >
          <template #label>
            <q-icon name="mdi-download" size="18px" class="q-mr-sm" />
            {{ $t('coordinator.buttonExportMembers') }}
          </template>
          <q-list>
            <q-item
              v-close-popup
              clickable
              data-cy="header-organization-button-export-xls"
              @click="$emit('export', ExportFileType.xls)"
            >
              <q-item-section class="text-uppercase">{{
                ExportFileType.xls
              }}</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              data-cy="header-organization-button-export-ods"
              @click="$emit('export', ExportFileType.ods)"
            >
              <q-item-section class="text-uppercase">{{
                ExportFileType.ods
              }}</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              data-cy="header-organization-button-export-csv"
              @click="$emit('export', ExportFileType.csv)"
            >
              <q-item-section class="text-uppercase">{{
                ExportFileType.csv
              }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <!-- Dialog: Edit Organization -->
    <dialog-default
      v-model="isEditOrganizationDialogOpen"
      data-cy="dialog-edit-organization"
    >
      <template #title>{{ $t('coordinator.editOrganization') }}</template>
      <template #content>
        <q-form
          ref="organizationEditFormRef"
          @submit.prevent="onSubmitEditOrganization"
        >
          <form-field-business-id
            v-model="organizationEditIco"
            data-cy="form-edit-organization-ico"
          />
          <form-field-business-vat-id
            v-model="organizationEditDic"
            data-cy="form-edit-organization-dic"
          />
          <form-field-address
            v-model:street="organizationEditAddress.street"
            v-model:house-number="organizationEditAddress.houseNumber"
            v-model:city="organizationEditAddress.city"
            v-model:zip="organizationEditAddress.zip"
            field-prefix="edit-organization"
          />
          <!-- Hidden submit button enables Enter key to submit -->
          <q-btn type="submit" class="hidden" />
        </q-form>
        <!-- Action buttons -->
        <div class="flex justify-end q-mt-lg">
          <div class="flex gap-8">
            <q-btn
              rounded
              unelevated
              outline
              color="primary"
              :disable="isLoadingUpdateOrganization"
              data-cy="dialog-button-cancel"
              @click="onCloseEditOrganizationDialog"
            >
              {{ $t('navigation.discard') }}
            </q-btn>
            <q-btn
              rounded
              unelevated
              color="primary"
              :loading="isLoadingUpdateOrganization"
              :disable="isLoadingUpdateOrganization"
              data-cy="dialog-button-submit"
              @click="onSubmitEditOrganization"
            >
              {{ $t('coordinator.editOrganization') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
