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
import { defineComponent, ref } from 'vue';

// components
import BannerInfo from '../global/BannerInfo.vue';
import DialogDefault from '../global/DialogDefault.vue';
import FormCreateInvoice from '../form/FormCreateInvoice.vue';
import TableInvoices from './TableInvoices.vue';

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

    const closeDialog = () => {
      isDialogOpen.value = false;
    };
    const openDialog = () => {
      isDialogOpen.value = true;
    };

    return {
      isDialogOpen,
      closeDialog,
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
        <form-create-invoice data-cy="form-create-invoice" />
        <!-- Action buttons -->
        <div class="flex justify-end q-mt-lg">
          <div class="flex gap-8">
            <q-btn
              rounded
              unelevated
              outline
              color="primary"
              data-cy="dialog-button-cancel"
              @click.prevent="closeDialog"
            >
              {{ $t('navigation.discard') }}
            </q-btn>
            <q-btn
              rounded
              unelevated
              color="primary"
              data-cy="dialog-button-submit"
            >
              {{ $t('coordinator.buttonDialogCreateInvoice') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
