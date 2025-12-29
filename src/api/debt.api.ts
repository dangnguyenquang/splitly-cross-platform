import { response } from '@/src/service/axios';

export const getPayDebt = async (status?: boolean) => {
  const res = await response.get(`/debt/pay`, {
    params: {
      status,
    },
  });

  return res.data;
};

export const getReceiveDebt = async (status?: boolean) => {
  const res = await response.get(
    `/debt/receive`, {
    params: {
      status,
    },
  }
  );

  return res.data;
};

export const sendPaymentRemindMessage = async (userDebtId: number, message: string) => {
  const res = await response.post(
    `/debt/remind-payment`,
    {
      userDebtId,
      message
    }
  );

  return res.data;
};

export const sendCheckPaymentRemindMessage = async (userDebtId: number, message: string) => {
  const res = await response.post(
    `/debt/remind-verification`,
    {
      userDebtId,
      message
    }
  );

  return res.data;
};

export const confirmDebt = async (userDebtId: number) => {
  const res = await response.patch(
    `/debt/${userDebtId}/confirm`,
  );

  return res.data;
};
