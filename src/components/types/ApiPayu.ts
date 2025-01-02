export type PayuCreateOrderPayload = {
  amount: number;
  client_ip: string;
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
