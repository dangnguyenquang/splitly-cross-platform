import axios from 'axios';
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
response.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export { response };
