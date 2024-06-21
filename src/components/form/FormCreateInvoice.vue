<script lang="ts">
/**
 * FormCreateInvoice Component
 *
 * @description * Use this component to render form for creating an invoice.
 *
 * Note: This component is used  on `CompanyCoordinatorPage`.
 *
 * TODO: To trigger submission of the form from the wrapping dialog
 * you can use submit method passed via `slot` or an event bus:
 * see: https://quasar.dev/quasar-utils/event-bus-util#introduction
 *
 * @props
 * - `organization` (Organization, required): The object with organization
 * details.
 *   It should be of type `Organization`.
 *
 * @components
 * - `form-field-checkbox-team`: Use this component to render a widget for
 *   selecting members from a team.
 *
 * @example
 * <form-create-invoice :organization="organization" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106291&t=rChuMkmuOQjQof29-1)
 */

// libraries
import { QForm } from 'quasar';
import { defineComponent, reactive, ref } from 'vue';

// components
import FormFieldCheckboxTeam from '../form/FormFieldCheckboxTeam.vue';

// types
import type { Organization } from '../types/Organization';

// fixtures
import invoiceFixture from '../../../test/cypress/fixtures/formCreateInvoice.json';

export default defineComponent({
  name: 'FormCreateInvoice',
  components: {
    FormFieldCheckboxTeam,
  },
  props: {
    organization: {
      type: Object as () => Organization,
      required: true,
    },
  },
  setup() {
    const formCreateInvoiceRef = ref<typeof QForm | null>(null);
    const isBillingDetailsCorrect = ref<boolean>(false);
    const isDonorEntryFee = ref<boolean>(false);
    const orderNote = ref<string>('');
    const orderNumber = ref<string>('');

    const selectedMembers = reactive<{ [key: string]: string[] }>({
      'team-1': [] as string[],
      'team-2': [] as string[],
    });

    return {
      formCreateInvoiceRef,
      isBillingDetailsCorrect,
      isDonorEntryFee,
      orderNote,
      orderNumber,
      selectedMembers,
      teams: invoiceFixture.teams,
    };
  },
});
</script>

<template>
  <q-form ref="formCreateInvoiceRef" data-cy="form-create-invoice">
    <div>
      <!-- Title: Billing details -->
      <h3
        class="text-body1 text-bold text-black q-my-none"
        data-cy="form-create-invoice-title"
      >
        {{ $t('form.titleOrganizationBillingDetails') }}
      </h3>
      <!-- Section: Billing details -->
      <address
        class="q-my-lg"
        data-cy="form-create-invoice-organization-details"
      >
        <p class="q-mb-xs" v-if="organization.title">
          {{ organization.title }}
        </p>
        <template v-if="organization?.address">
          <!-- Street + house number -->
          <p class="q-mb-xs" v-if="organization.address?.street">
            {{ organization.address.street }}
          </p>
          <p
            class="q-mb-xs"
            v-if="organization.address?.zip || organization.address?.city"
          >
            <!-- Zip + city -->
            <span v-if="organization.address?.zip">{{
              organization.address.zip
            }}</span
            >&nbsp;<span v-if="organization.address?.city">{{
              organization.address.city
            }}</span>
          </p>
        </template>
        <!-- Comapny ID -->
        <p
          class="q-mb-xs"
          v-if="organization?.identificationNumber"
          data-cy="form-create-invoice-organization-id"
        >
          {{ $t('form.labelCompanyId') }}:
          {{ organization.identificationNumber }}
        </p>
        <!-- VAT ID -->
        <p
          class="q-mb-xs"
          v-if="organization?.identificationNumberVat"
          data-cy="form-create-invoice-organization-vat-id"
        >
          {{ $t('form.labelCompanyIdVat') }}:
          {{ organization.identificationNumberVat }}
        </p>
      </address>
      <!-- Toggle: Confirm billing details -->
      <q-toggle
        dense
        v-model="isBillingDetailsCorrect"
        :label="$t('form.labelConfirmBillingDetails')"
        name="confirm-billing-details"
        color="primary"
        data-cy="form-create-invoice-confirm-billing-details"
      />
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
          <div
            class="col-12 col-sm-6"
            data-cy="form-create-invoice-order-number"
          >
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
              :data-cy="`form-create-invoice-order-number-input`"
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
              :data-cy="`form-create-invoice-note-input`"
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
  </q-form>
</template>
