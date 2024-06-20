<script lang="ts">
/**
 * FormCreateInvoice Component
 *
 * @description * Use this component to render form for creating an invoice.
 * It is used within a modal dialog on `CompanyCoordinatorPage`.
 *
 * @props
 * - `organization` (Organization, required): The object with organization
 * details.
 *   It should be of type `Organization`.
 *
 * @slots
 * - `controls`: For triggering the form via dialog buttons.
 *   exposed props and methods:
 *     - `submit`: Method to submit the form inside the slot
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

    // TODO: Update data structure
    const teams = [
      {
        id: '001',
        name: 'Team 1',
        members: [
          {
            id: 'member-1',
            name: 'Petr',
            team: '001',
            payment: { amount: 399 },
          },
          {
            id: 'member-2',
            name: 'Marta',
            team: '001',
            payment: { amount: 399 },
          },
        ],
      },
      {
        id: '002',
        name: 'Team 2',
        members: [
          {
            id: 'member-3',
            name: 'Jan',
            team: '002',
            payment: { amount: 399 },
          },
        ],
      },
    ];

    const selectedMembers = reactive<{ [key: string]: string[] }>({
      'team-1': [] as string[],
      'team-2': [] as string[],
    });

    return {
      formCreateInvoiceRef,
      isBillingDetailsCorrect,
      selectedMembers,
      teams,
    };
  },
});
</script>

<template>
  <q-form ref="formCreateInvoiceRef" data-cy="form-create-invoice">
    <div>
      <!-- Title: Billing details -->
      <h3 class="text-body1 text-bold text-black q-my-none">
        {{ $t('form.titleOrganizationBillingDetails') }}
      </h3>
      <!-- Section: Billing details -->
      <address class="q-my-lg">
        <p v-if="organization.title">{{ organization.title }}</p>
        <template v-if="organization?.address">
          <!-- Street + house number -->
          <p v-if="organization.address?.street">
            {{ organization.address.street }}
          </p>
          <p v-if="organization.address?.zip || organization.address?.city">
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
        <p v-if="organization?.identificationNumber">
          {{ $t('form.labelCompanyId') }}:
          {{ organization.identificationNumber }}
        </p>
        <!-- VAT ID -->
        <p v-if="organization?.identificationNumberVat">
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
      />
      <!-- Link: Edit billing details -->
      <p class="q-mt-lg">
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
      />
    </div>
  </q-form>
</template>
