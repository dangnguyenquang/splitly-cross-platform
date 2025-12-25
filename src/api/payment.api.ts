import { response } from '../service/axios';
export interface PaymentItem {
  itemName: string;
  quantity: number;
  priceQuotation: number;
  amount: number;
}

export interface PaymentPayload {
  title: string;
  tag: {
    tagId: string;
    tagName: string;
    icon?: string;
  };
  items: PaymentItem[];
  consensusPayments: { userId: number }[];
  estimatedAmount: number;
  imageUrl?: string;
  paymentRequestNote?: string;
  usedFundAmount?: number;
}

export const createPaymentRequest = async (
  payload: PaymentPayload,
  token: string,
  groupId: number,
) => {
  const res = await response.post(`/payment-request/${groupId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const uploadPaymentImage = async (imageUri: string, token: string) => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: `user-${imageUri.split('/').pop()}`,
    type: 'image/png',
  } as any);

  const res = await response.post(`payment-request/1/payment-image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: 15000,
  });

  return res.data;
};
