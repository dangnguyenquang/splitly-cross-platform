// src/api/group.api.ts
import { response } from '../service/axios';
import {
  createGroupStart,
  createGroupSuccess,
  createGroupFail,
} from '../store/groupSlice';
import { AppDispatch } from '../store/store';
import { Connection, CreateGroupRequest } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types';

export const createGroup = async (
  dispatch: AppDispatch,
  payload: CreateGroupRequest,
  token: string,
  navigate: NativeStackNavigationProp<RootStackParamList>,
) => {
  dispatch(createGroupStart());

  try {
    console.log('[API] Sending POST request to /groups/create-group');
    console.log('[API] Payload:', JSON.stringify(payload, null, 2));

    const res = await response.post('/groups/create-group', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch(createGroupSuccess(res.data.data));
    return res.data;
  } catch (err: any) {
    console.error('[API] Create group failed');

    if (err.response) {
      console.error('[API] Error response:', {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers,
      });
    } else if (err.request) {
      console.error('[API] No response received:', err.request);
    } else {
      console.error('[API] Error:', err.message);
    }

    dispatch(createGroupFail());
    throw err;
  }
};

export const getAllGroupsByUser = async (token: string) => {
  try {
    console.log('[API] Fetching all groups for user');

    const res = await response.get('/management/user/groups', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('[API] Fetched Groups:', res.data);
    return res.data; // Return the groups array directly
  } catch (err: any) {
    console.error('[API] Fetch groups failed');

    if (err.response) {
      console.error('[API] Error response:', {
        status: err.response.status,
        data: err.response.data,
      });
    } else if (err.request) {
      console.error('[API] No response received:', err.request);
    } else {
      console.error('[API] Error:', err.message);
    }

    throw err;
  }
};

export const getAllConnectionsOfCurrentUsers = async (
  token: string,
): Promise<Connection[]> => {
  const res = await response.get<Connection[]>('/users/connections', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getPaymentsByGroupId = async (groupId: number, token: string) => {
  const res = await response.get(`/payment-request/${groupId}/group`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 15000,
  });
  console.log('Payments by Group ID response:', res.data);
  return res.data;
};
export const getGroupUsers = async (groupId?: number, token?: string) => {
  const res = await response.get(`/management/groups/${groupId}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data ?? [];
};

