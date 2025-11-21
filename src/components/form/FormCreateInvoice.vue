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
import FormFieldAddress from './FormFieldAddress.vue';
import FormFieldBusinessId from './FormFieldBusinessId.vue';
import FormFieldBusinessVatId from './FormFieldBusinessVatId.vue';
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type { AdminOrganisation } from '../types/AdminOrganisation';

export default defineComponent({
  name: 'FormCreateInvoice',
  components: {
    FormFieldCheckboxTeam,
    FormFieldAddress,
    FormFieldBusinessId,
    FormFieldBusinessVatId,
    FormFieldTextRequired,
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
    const isBillingFormExpanded = computed({
      get: () => adminOrganisationStore.invoiceForm.isBillingFormExpanded,
      set: (value) => {
        if (value && adminOrganisationStore.getIsBillingAddressEmpty) {
          adminOrganisationStore.initializeBillingAddress();
        }
        adminOrganisationStore.setBillingFormExpanded(value);
      },
    });
    const billingStreet = computed<string>({
      get: () => adminOrganisationStore.getBillingStreet,
      set: (value: string) =>
        adminOrganisationStore.updateBillingAddressField('street', value),
    });
    const billingStreetNumber = computed<string>({
      get: () => adminOrganisationStore.getBillingStreetNumber,
      set: (value: string) =>
        adminOrganisationStore.updateBillingAddressField('streetNumber', value),
    });
    const billingCity = computed<string>({
      get: () => adminOrganisationStore.getBillingCity,
      set: (value: string) =>
        adminOrganisationStore.updateBillingAddressField('city', value),
    });
    const billingPsc = computed<string>({
      get: () => adminOrganisationStore.getBillingPsc,
      set: (value: string) =>
        adminOrganisationStore.updateBillingAddressField('psc', value),
    });
    const billingCompanyName = computed<string>({
      get: () => adminOrganisationStore.getBillingCompanyName,
      set: (value: string) =>
        adminOrganisationStore.updateBillingOrganizationField(
          'companyName',
          value,
        ),
    });
    const billingBusinessId = computed<string>({
      get: () => adminOrganisationStore.getBillingBusinessId,
      set: (value: string) =>
        adminOrganisationStore.updateBillingOrganizationField(
          'businessId',
          value,
        ),
    });
    const billingBusinessVatId = computed<string>({
      get: () => adminOrganisationStore.getBillingBusinessVatId,
      set: (value: string) =>
        adminOrganisationStore.updateBillingOrganizationField(
          'businessVatId',
          value,
        ),
    });

    /**
     * Reset billing form
     * @returns {void}
     */
    const onCancelBillingEdit = (): void => {
      adminOrganisationStore.resetBillingForm();
    };

    return {
      isBillingDetailsCorrect,
      isDonorEntryFee,
      orderNote,
      orderNumber,
      organization,
      teams,
      selectedMembers,
      isBillingFormExpanded,
      billingStreet,
      billingStreetNumber,
      billingCity,
      billingPsc,
      billingCompanyName,
      billingBusinessId,
      billingBusinessVatId,
      onCancelBillingEdit,
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
    <!-- Collapsible: Edit billing details -->
    <q-expansion-item
      dense
      v-model="isBillingFormExpanded"
      :label="$t('form.linkEditBillingDetails')"
      :caption="$t('form.textEditBillingDetails')"
      class="q-mt-lg"
      header-class="q-px-none"
      data-cy="form-create-invoice-billing-expansion"
    >
      <div
        class="q-py-md"
        data-cy="form-create-invoice-billing-expansion-content"
      >
        <!-- Organization fields -->
        <div v-if="isBillingFormExpanded" class="q-mb-lg">
          <h4 class="text-body2 text-bold q-mb-md">
            {{ $t('form.titleOrganizationDetails') }}
          </h4>
          <div class="row q-col-gutter-md">
            <form-field-text-required
              v-model="billingCompanyName"
              name="invoice-billing-company-name"
              :label="$t('form.labelCompany')"
              class="col-12"
              data-cy="form-invoice-billing-company-name"
            />
            <form-field-business-id
              v-model="billingBusinessId"
              data-cy="form-invoice-billing-business-id"
            />
            <form-field-business-vat-id
              v-model="billingBusinessVatId"
              data-cy="form-invoice-billing-business-vat-id"
            />
          </div>
        </div>
        <!-- Address fields -->
        <div v-if="isBillingFormExpanded" class="q-mb-lg">
          <h4 class="text-body2 text-bold q-mb-md">
            {{ $t('form.titleAddressDetails') }}
          </h4>
          <form-field-address
            v-model:street="billingStreet"
            v-model:houseNumber="billingStreetNumber"
            v-model:city="billingCity"
            v-model:zip="billingPsc"
            field-prefix="invoice-billing"
          />
        </div>
        <!-- Button: Discard changes -->
        <div class="row justify-end q-mt-lg">
          <q-btn
            rounded
            unelevated
            outline
            color="negative"
            :label="$t('navigation.discardChanges')"
            @click="onCancelBillingEdit"
            data-cy="form-create-invoice-billing-discard"
          />
        </div>
      </div>
    </q-expansion-item>
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
