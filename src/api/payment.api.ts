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
export const markConsensusSuccess = async (
  paymentRequestId: number,
  token?: string
) => {
  console.log('[markConsensusSuccess] full URL:', response.defaults.baseURL + `/payment-request/${paymentRequestId}/consensus/success`);

  try {
    console.log('[markConsensusSuccess] paymentRequestId:', paymentRequestId);
    console.log('[markConsensusSuccess] token:', token);

    const res = await response.put(
      `/payment-request/${paymentRequestId}/consensus/success`,
      {
       "successAccepted": true
      }, // payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('[markConsensusSuccess] response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('[markConsensusSuccess] error:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const markConsensusDecline = async (
  paymentRequestId: number,
  token?: string
) => {
  console.log('[markConsensusSuccess] full URL:', response.defaults.baseURL + `/payment-request/${paymentRequestId}/fail`);

  try {
    console.log('[markConsensusDecline] paymentRequestId:', paymentRequestId);
    console.log('[markConsensusDecline] token:', token);

    const res = await response.put(
      `/payment-request/${paymentRequestId}/fail`,
      {
        // "successAccepted": false
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('[markConsensusDecline] response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('[markConsensusDecline] error:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const splitBill = async (
  paymentRequestId: number,
  token?: string
) => {
  try {
    console.log('[markConsensusDecline] paymentRequestId:', paymentRequestId);
    console.log('[markConsensusDecline] token:', token);

    const res = await response.put(
      `/payment-request/${paymentRequestId}/ready-to-split`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log('[markConsensusDecline] response:', res.data);

    return res.data;
  } catch (error: any) {
    console.error('[markConsensusDecline] error:', error.response?.status, error.response?.data);
    throw error;
  }
};
