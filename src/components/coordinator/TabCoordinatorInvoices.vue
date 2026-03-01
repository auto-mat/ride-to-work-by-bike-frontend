<script lang="ts">
/**
 * TabCoordinatorInvoices Component
 *
 * @description * Use this component to display a tab with invoices.
 *
 * @components
 * - `BannerInfo`: Component to display a banner with info.
 * - `DialogDefault`: Component to display a dialog.
 * - `FormCreateInvoice`: Component to display a form for creating an invoice.
 * - `TableInvoices`: Component to display a table with invoices.
 *
 * @example
 * <tab-coordinator-invoices />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105324&t=y4MHmNsiRHIiDmVe-1)
 */

// libraries
import { Notify, QForm } from 'quasar';
import { computed, defineComponent, nextTick, ref } from 'vue';

// components
import BannerInfo from '../global/BannerInfo.vue';
import DialogDefault from '../global/DialogDefault.vue';
import FormCreateInvoice from '../form/FormCreateInvoice.vue';
import TableInvoices from './TableInvoices.vue';

// composables
import { i18n } from 'src/boot/i18n';

// enums
import { PhaseType } from '../types/Challenge';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';
import { useChallengeStore } from 'src/stores/challenge';

export default defineComponent({
  name: 'TabCoordinatorInvoices',
  components: {
    BannerInfo,
    DialogDefault,
    FormCreateInvoice,
    TableInvoices,
  },
  setup() {
    const isDialogOpen = ref(false);
    const formCreateInvoiceRef = ref<typeof QForm | null>(null);
    const adminOrganisationStore = useAdminOrganisationStore();

    const closeDialog = (): void => {
      adminOrganisationStore.resetInvoiceForm();
      isDialogOpen.value = false;
    };
    const openDialog = (): void => {
      // Reset and initialize form when opening dialog
      adminOrganisationStore.initializeSelectedMembers();
      isDialogOpen.value = true;
    };

    const scrollToForm = async (): Promise<void> => {
      await nextTick();
      const formElement = formCreateInvoiceRef.value?.$el;
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    // handles invalid form state (organization details confirmation toggle)
    const onValidationError = async (): Promise<void> => {
      await scrollToForm();
    };
    const onSubmit = async (): Promise<void> => {
      // validate organization details via store
      const validation =
        adminOrganisationStore.getOrganizationDetailsValidation;
      if (!validation.isValid) {
        Notify.create({
          message: i18n.global.t('form.messageIncompleteOrganizationDetails'),
          color: 'negative',
        });
        adminOrganisationStore.setBillingFormExpanded(true);
        await scrollToForm();
        return;
      }
      const success = await adminOrganisationStore.createInvoice();
      if (success) {
        closeDialog();
        // Start polling after invoice creation
        adminOrganisationStore.startInvoicePolling();
      }
    };
    const onReset = (): void => {
      closeDialog();
    };

    const hasPaymentsToInvoice = computed<boolean>(() => {
      return adminOrganisationStore.getHasPaymentsToInvoice;
    });

    const hasSelectedPaymentsToInvoice = computed<boolean>(() => {
      return (
        Object.values(
          adminOrganisationStore.invoiceForm.selectedMembers,
        ).reduce((acc, memberIds) => {
          acc.push(...memberIds);
          return acc;
        }, []).length > 0
      );
    });

    const isInvoicesPhaseActive = computed<boolean>(() => {
      const challengeStore = useChallengeStore();
      return challengeStore.getIsChallengeInPhase(PhaseType.invoices);
    });

    return {
      formCreateInvoiceRef,
      hasPaymentsToInvoice,
      hasSelectedPaymentsToInvoice,
      isDialogOpen,
      isInvoicesPhaseActive,
      onReset,
      onSubmit,
      onValidationError,
      openDialog,
    };
  },
});
</script>

<template>
  <div data-cy="tab-coordinator-invoices">
    <!-- Banner: Info -->
    <banner-info class="q-mt-lg" data-cy="banner-info" />
    <div class="row justify-between items-center q-mt-lg">
      <!-- Title -->
      <h3
        class="col-auto text-h6 text-black q-my-none"
        data-cy="table-invoices-title"
      >
        {{ $t('table.titleInvoices') }}
      </h3>
      <!-- Button: Create invoice -->
      <q-btn
        class="col-auto"
        color="primary"
        unelevated
        rounded
        :disabled="!hasPaymentsToInvoice || !isInvoicesPhaseActive"
        @click.prevent="openDialog"
        data-cy="button-create-invoice"
      >
        <q-icon name="add" size="18px" color="white" class="q-mr-xs" />
        {{ $t('coordinator.buttonCreateInvoice') }}
      </q-btn>
    </div>
    <!-- Table: Invoices -->
    <table-invoices class="q-mt-lg" data-cy="table-invoices" />

    <!-- Dialog: Create invoice -->
    <dialog-default v-model="isDialogOpen" data-cy="dialog-create-invoice">
      <template #title>
        {{ $t('coordinator.titleCreateInvoice') }}
      </template>
      <template #content>
        <q-form
          ref="formCreateInvoiceRef"
          @submit="onSubmit"
          @reset="onReset"
          @validation-error="onValidationError"
        >
          <form-create-invoice />
          <!-- Action buttons -->
          <div class="flex justify-end q-mt-lg">
            <div class="flex gap-8">
              <q-btn
                type="reset"
                rounded
                unelevated
                outline
                color="primary"
                data-cy="dialog-button-cancel"
              >
                {{ $t('navigation.discard') }}
              </q-btn>
              <q-btn
                type="submit"
                rounded
                unelevated
                color="primary"
                :disable="!hasSelectedPaymentsToInvoice"
                data-cy="dialog-button-submit"
              >
                {{ $t('coordinator.buttonDialogCreateInvoice') }}
              </q-btn>
            </div>
          </div>
        </q-form>
      </template>
    </dialog-default>
  </div>
</template>
