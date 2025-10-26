<script lang="ts">
/**
 * TabCoordinatorInvoices Component
 *
 * @description * Use this component to display a tab with invoices.
 *
 * @components
 * - `DialogDefault`: Component to display a dialog.
 * - `FormCreateInvoice`: Component to display a form for creating an invoice.
 *
 * @example
 * <tab-coordinator-invoices />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105324&t=y4MHmNsiRHIiDmVe-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormCreateInvoice from '../form/FormCreateInvoice.vue';

export default defineComponent({
  name: 'TabCoordinatorInvoices',
  components: {
    DialogDefault,
    FormCreateInvoice,
  },
  setup() {
    const isDialogOpen = ref(true);
    return {
      isDialogOpen,
    };
  },
});
</script>

<template>
  <div data-cy="tab-coordinator-invoices">
    <!-- Dialog: Create invoice -->
    <dialog-default v-model="isDialogOpen" data-cy="dialog-create-invoice">
      <template #title>
        {{ $t('coordinator.buttonCreateInvoice') }}
      </template>
      <template #content>
        <form-create-invoice />
      </template>
    </dialog-default>
  </div>
</template>
