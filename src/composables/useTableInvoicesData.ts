// libraries
import { computed } from 'vue';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type { Ref } from 'vue';
import type { Invoice, InvoiceResult } from 'src/components/types/Invoice';

export interface TableInvoiceRow {
  exposureDate: string;
  orderNumber: string;
  invoiceUrl: string;
  paymentCount: number;
  totalAmount: number;
  paidDate: string | null;
}

/**
 * Transforms Invoice to TableInvoiceRow
 * @param {Invoice} invoice - Invoice from API
 * @returns {TableInvoiceRow} - Flattened row for table
 */
function transformInvoiceToRow(invoice: Invoice): TableInvoiceRow {
  return {
    exposureDate: invoice.exposure_date,
    orderNumber: invoice.order_number,
    invoiceUrl: invoice.fakturoid_invoice_url,
    paymentCount: invoice.payments.length,
    totalAmount: invoice.total_amount,
    paidDate: invoice.paid_date,
  };
}

/**
 * Build data object for invoices table
 * Transforms InvoiceResult[] from store to flat array of table rows
 * @returns {Ref<TableInvoiceRow[]>} - Array of table rows
 */
export const useTableInvoicesData = (): {
  invoicesData: Ref<TableInvoiceRow[]>;
} => {
  const adminOrganisationStore = useAdminOrganisationStore();

  const invoicesData = computed<TableInvoiceRow[]>(() => {
    const invoiceResults = adminOrganisationStore.getAdminInvoices;

    if (!invoiceResults || invoiceResults.length === 0) {
      return [];
    }

    const allInvoices: TableInvoiceRow[] = [];

    // Loop through each InvoiceResult and extract invoices
    invoiceResults.forEach((result: InvoiceResult) => {
      result.invoices.forEach((invoice: Invoice) => {
        allInvoices.push(transformInvoiceToRow(invoice));
      });
    });

    return allInvoices;
  });

  return {
    invoicesData,
  };
};
