import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const baseURL = Config.BE_URL;
console.log('urL', baseURL);
const PORT = 8080;
export const BE_BASE_URL = Platform.select({
  android: `http://192.168.31.171:${PORT}/api/v1`, // emulator Android
  ios: `http://localhost:${PORT}/api/v1`, // simulator iOS
});
const response = axios.create({
  baseURL: BE_BASE_URL,
});

// ---- Token getter injection ----
let getAccessToken: () => string | null = () => null;
export const setAccessTokenGetter = (fn: () => string | null) => {
  getAccessToken = fn;
};

// ---- Request: auto attach Bearer token ----
response.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  // check expired token....

  if (token) {
    (config.headers as any) = {
      ...(config.headers as any),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

response.interceptors.response.use(
  (res) => res.data,
  (err: AxiosError) => {
    if (err.response) {
      console.log("Err data: ", err.response.data);
      console.log("Err status: ", err.response.status);
      console.log("Err header: ", err.response.headers);
    }
    return Promise.reject(err);
  },
);

export { response };
