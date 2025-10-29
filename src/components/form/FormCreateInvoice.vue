<script lang="ts">
/**
 * FormCreateInvoice Component
 *
 * @description * Use this component to render form for creating an invoice.
 *
 * Note: This component is used in `TabCoordinatorInvoices` on `CompanyCoordinatorPage`.
 *
 * TODO: To trigger submission of the form from the wrapping dialog
 * you can use submit method passed via `slot` or an event bus:
 * see: https://quasar.dev/quasar-utils/event-bus-util#introduction
 *
 * @components
 * - `FormFieldCheckboxTeam`: Use this component to render a widget for
 *   selecting members from a team.
 *
 * @example
 * <form-create-invoice />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106291&t=rChuMkmuOQjQof29-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import FormFieldCheckboxTeam from '../form/FormFieldCheckboxTeam.vue';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type { AdminOrganisation } from '../types/AdminOrganisation';

export default defineComponent({
  name: 'FormCreateInvoice',
  components: {
    FormFieldCheckboxTeam,
  },
  setup() {
    const adminOrganisationStore = useAdminOrganisationStore();
    const organization = computed<AdminOrganisation | null>(() => {
      return adminOrganisationStore.getCurrentAdminOrganisation;
    });

    const teams = computed(() => adminOrganisationStore.getInvoiceTeams);
    const selectedMembers = computed({
      get: () => adminOrganisationStore.invoiceForm.selectedMembers,
      set: (value) => {
        adminOrganisationStore.invoiceForm.selectedMembers = value;
      },
    });
    const orderNumber = computed({
      get: () => adminOrganisationStore.invoiceForm.orderNumber,
      set: (value) => {
        adminOrganisationStore.invoiceForm.orderNumber = value;
      },
    });
    const orderNote = computed({
      get: () => adminOrganisationStore.invoiceForm.orderNote,
      set: (value) => {
        adminOrganisationStore.invoiceForm.orderNote = value;
      },
    });
    const isDonorEntryFee = computed({
      get: () => adminOrganisationStore.invoiceForm.isDonorEntryFee,
      set: (value) => {
        adminOrganisationStore.invoiceForm.isDonorEntryFee = value;
      },
    });
    const isBillingDetailsCorrect = computed({
      get: () => adminOrganisationStore.invoiceForm.isBillingDetailsCorrect,
      set: (value) => {
        adminOrganisationStore.invoiceForm.isBillingDetailsCorrect = value;
      },
    });

    return {
      isBillingDetailsCorrect,
      isDonorEntryFee,
      orderNote,
      orderNumber,
      organization,
      teams,
      selectedMembers,
    };
  },
});
</script>

<template>
  <div data-cy="form-create-invoice">
    <!-- Title: Billing details -->
    <h3
      class="text-body1 text-bold text-black q-my-none"
      data-cy="form-create-invoice-title"
    >
      {{ $t('form.titleOrganizationBillingDetails') }}
    </h3>
    <!-- Section: Billing details -->
    <address
      v-if="organization"
      class="q-my-lg"
      data-cy="form-create-invoice-organization-details"
    >
      <!-- Organization name -->
      <p v-if="organization.name" class="q-mb-xs">
        {{ organization.name }}
      </p>
      <!-- Street + street number -->
      <p
        v-if="organization.street || organization.street_number"
        class="q-mb-xs"
      >
        <span v-if="organization.street"> {{ organization.street }} </span
        >&nbsp;<span v-if="organization.street_number">
          {{ organization.street_number }}
        </span>
      </p>
      <!-- PSC + city -->
      <p v-if="organization.psc || organization.city" class="q-mb-xs">
        <!-- Zip + city -->
        <span v-if="organization.psc">{{ organization.psc }}</span
        >&nbsp;<span v-if="organization.city">{{ organization.city }}</span>
      </p>
      <!-- Business ID -->
      <p
        class="q-mb-xs"
        v-if="organization?.ico"
        data-cy="form-create-invoice-organization-id"
      >
        {{ $t('form.labelBusinessId') }}:
        {{ organization.ico }}
      </p>
      <!-- Tax ID -->
      <p
        class="q-mb-xs"
        v-if="organization?.dic"
        data-cy="form-create-invoice-organization-vat-id"
      >
        {{ $t('form.labelTaxId') }}:
        {{ organization.dic }}
      </p>
    </address>
    <!-- Toggle: Confirm billing details -->
    <q-field
      :model-value="isBillingDetailsCorrect"
      :rules="[
        (val) => val === true || $t('form.messageConfirmBillingDetails'),
      ]"
      bottom-slots
      borderless
      hide-bottom-space
    >
      <q-toggle
        dense
        v-model="isBillingDetailsCorrect"
        :label="$t('form.labelConfirmBillingDetails')"
        name="confirm-billing-details"
        color="primary"
        data-cy="form-create-invoice-confirm-billing-details"
      />
    </q-field>
    <!-- Link: Edit billing details -->
    <p class="q-mt-lg" data-cy="form-create-invoice-edit-billing-details">
      {{ $t('form.textEditBillingDetails') }}
      <!-- TODO: Link to edit screen -->
      <a href="#">
        {{ $t('form.linkEditBillingDetails') }}
      </a>
    </p>
    <!-- Section: Participants -->
    <form-field-checkbox-team
      v-for="team in teams"
      :key="team.id"
      class="q-gutter-col-sm q-my-lg"
      :team="team"
      v-model="selectedMembers[team.id]"
      data-cy="form-create-invoice-team"
    />
    <!-- Section: Additional information -->
    <div class="q-mt-lg" data-cy="form-create-invoice-additional-information">
      <!-- Title -->
      <h3 class="text-body1 text-bold text-black q-mt-none q-mb-sm">
        {{ $t('form.titleAdditionalInformation') }}
      </h3>
      <div class="row q-col-gutter-lg">
        <!-- Input: Order number -->
        <div class="col-12 col-sm-6" data-cy="form-create-invoice-order-number">
          <!-- Label -->
          <label
            for="form-create-invoice-order-number"
            class="text-grey-10 text-caption text-bold"
          >
            {{ $t('form.labelOrderNumber') }}
          </label>
          <!-- Input -->
          <q-input
            dense
            outlined
            hide-bottom-space
            v-model="orderNumber"
            class="q-mt-sm"
            id="form-create-invoice-order-number"
            name="create-invoice-order-number"
            data-cy="form-create-invoice-order-number-input"
          />
        </div>
        <!-- Input: Note -->
        <div class="col-12 col-sm-6" data-cy="form-create-invoice-note">
          <!-- Label -->
          <label
            for="form-create-invoice-note"
            class="text-grey-10 text-caption text-bold"
          >
            {{ $t('form.labelOrderNote') }}
          </label>
          <!-- Input -->
          <q-input
            dense
            outlined
            hide-bottom-space
            v-model="orderNote"
            class="q-mt-sm"
            id="form-create-invoice-note"
            name="create-invoice-note"
            data-cy="form-create-invoice-note-input"
          />
        </div>
      </div>
    </div>
    <!-- Section: Donor entry fee -->
    <div class="q-mt-xl" data-cy="form-create-invoice-donor-entry-fee">
      <!-- Title -->
      <h3 class="text-body1 text-bold text-black q-my-none">
        {{ $t('form.titleDonorEntryFee') }}
      </h3>
      <!-- Text -->
      <div
        v-html="$t('form.textDonorEntryFee')"
        class="q-mt-lg"
        data-cy="form-create-invoice-donor-entry-fee-text"
      />
      <!-- Toggle -->
      <q-toggle
        dense
        v-model="isDonorEntryFee"
        :label="$t('form.labelDonorEntryFee')"
        name="confirm-billing-details"
        color="primary"
        class="q-mt-lg"
        data-cy="form-create-invoice-donor-entry-fee-toggle"
      />
    </div>
  </div>
</template>
