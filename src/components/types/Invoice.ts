export interface InvoicePayment {
  id: number;
  amount: number;
  userprofile_id: number;
  payment_status: number;
  pay_type: string;
  pay_category: string;
}

export interface Invoice {
  id: number;
  order_number: string;
  total_amount: number;
  fakturoid_invoice_url: string;
  exposure_date: string;
  paid_date: string;
  company_pais_benefitial_fee: boolean;
  client_note: string;
  payments: InvoicePayment[];
}

export interface InvoiceResult {
  payments_to_invoice: InvoicePayment[];
  invoices: Invoice[];
}

export interface GetCoordinatorInvoicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InvoiceResult[];
}
