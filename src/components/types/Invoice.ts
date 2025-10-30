export enum InvoicePaymentStatus {
  paymentAcceptedByOrganization = 1005,
  invoiceCreated = 1006,
  invoicePaid = 1007,
}

export interface InvoicePayment {
  id: number;
  amount: number;
  userprofile_id: number;
  payment_status: InvoicePaymentStatus;
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

export interface InvoiceTeamMember {
  id: number;
  name: string;
  teamId: number;
  payment: {
    id: number;
    amount: number;
  };
}

export interface InvoiceTeam {
  id: number;
  name: string;
  members: InvoiceTeamMember[];
}
