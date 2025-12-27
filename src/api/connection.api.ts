import { response } from '@/src/service/axios';

export const deleteConnectionUser = async (token: string, id: number) => {
  try {
    const res = await response.delete(`/users/connections?userId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const addContactUser = async (token: string, receiveUserId: number) => {
  try {
    const res = await response.post(
      `/users/connections`,
      { receiveUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (token: string, email: string) => {
  try {
    const res = await response.get(`/users/search?email=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};
