import { response } from '../service/axios';

export const getPayDebt = async (token: string) => {
  const res = await response.get(
    `/debt/pay`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000,
    },
  );

  return res.data;
};

export const getReceiveDebt = async (token: string) => {
  const res = await response.get(
    `/debt/receive`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000,
    },
  );

  return res.data;
};
