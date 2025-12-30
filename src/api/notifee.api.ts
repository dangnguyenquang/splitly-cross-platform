import { response } from "@/src/service/axios";
import axios from "axios";
export const registerTokenDevice = async (
  deviceId: string,
  token: string,
  platform: string,
) => {
  try {
    const res = await response.post('/device-tokens/register', { token, deviceId, platform });
    console.log(res);
    return res
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};


export const getAllNotifications = async (
) => {
  try {
    const res = await response.get('/notifications');
    console.log(res);
    return res
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};

