import { response } from '@/src/service/axios';
import { Connection } from '@/src/types';

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
    const res = await response.get(`/users/by-email?email=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllUserConnections = async (
  token: string,
): Promise<Connection[]> => {
  try {
    const res = await response.get<Connection[]>(
      '/users/connections',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const acceptedUserContact = async (
  requestUserId: number,
): Promise<Connection> => {
  try {
    const res = await response.patch<Connection>(
      `/users/connections/accept?requestUserId=${requestUserId}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const rejectedUserContact = async (
  requestUserId: number,
): Promise<Connection> => {
  try {
    const res = await response.patch<Connection>(
      `/users/connections/reject?requestUserId=${requestUserId}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
