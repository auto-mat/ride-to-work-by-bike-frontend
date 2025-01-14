import { PaymentSubject } from '../enums/Payment';

export enum PaymentCategory {
  none = '',
  donation = 'donation',
  entryFee = 'entry_fee',
  entryFeeDonation = 'entry_fee-donation',
}

export type PayuProduct = {
  name: string;
  unitPrice: number;
  quantity: number;
};

export type PayuCreateOrderPayload = {
  amount: number;
  client_ip: string;
  payment_subject: PaymentSubject;
  payment_category: PaymentCategory;
  products: PayuProduct[];
};

export type PayuCreateOrderResponse = {
  status: {
    statusCode: string;
    code: string;
    codeLiteral: string;
    statusDesc: string;
  };
  redirectUri: string;
  orderId: string;
  extOrderId: string;
};
