import { response } from '../service/axios';
import { PersonalInfo } from '../types';

export const updateUser = async (personalInfo: PersonalInfo, token: string) => {
  const res = await response.put(
    `/users/${personalInfo.userId}`,
    personalInfo,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000,
    },
  );

  return res.data;
};
