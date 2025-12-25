import axios from 'axios';
import { response } from '../service/axios';
import {
  loginFail,
  loginStart,
  loginSuccess,
  registerStart,
  registerSuccess,
} from '../store/authSlice';
import { AppDispatch } from '../store/store';
import { LoginForm, RegisterForm, RootStackParamList } from '@/src/types';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const userLogin = async (
  dispatch: AppDispatch,
  loginForm: LoginForm,
  navigate: NativeStackNavigationProp<RootStackParamList>,
) => {
  dispatch(loginStart());
  try {
    const res = await response.post('/auth/login', loginForm);
    if (res) {
      dispatch(loginSuccess(res.data));
      // navigate.reset({
      //   index: 0,
      //   routes: [{ name: 'MainApp' }],
      // });
    }
    return res.data;
  } catch (err: unknown) {
    dispatch(loginFail());
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export const userRegister = async (
  dispatch: AppDispatch,
  registerForm: RegisterForm,
  navigate: NativeStackNavigationProp<RootStackParamList>,
) => {
  dispatch(registerStart());
  try {
    const res = await response.post('/auth/register', registerForm);
    console.log(res);
    if (res) {
      dispatch(registerSuccess());
      navigate.reset({
        index: 0,
        routes: [{ name: 'OTP', params: { email: registerForm.email } }],
      });
    }
  } catch (err: unknown) {
    console.log('Err api: ', err);
    dispatch(loginFail());
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export const verifyOTP = async (
  otp: string,
  email: string,
  navigate: NativeStackNavigationProp<RootStackParamList>,
) => {
  try {
    const res = await response.post('/auth/verify', { otp, email });
    console.log(res);
    if (res.status === 200) {
      navigate.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export const resendOTP = async (email: string) => {
  try {
    const res = await response.post(`/auth/resend-otp/${email}`);
    console.log(res);
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export const verifyResetPassword = async (
  otp: string,
  email: string,
  navigate: NativeStackNavigationProp<RootStackParamList>,
) => {
  try {
    const res = await response.post('/auth/verify-reset', { otp, email });
    console.log(res);
    if (res.status === 200) {
      navigate.reset({
        index: 0,
        routes: [{ name: 'NewPassword', params: { token: res.data } }],
      });
    }
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export const requestNewPassword = async (
  password: string,
  token: string,
  navigate: NativeStackNavigationProp<RootStackParamList>,
) => {
  try {
    const res = await response.post('/auth/reset-password', {
      resetToken: token,
      password,
    });
    console.log(res);
    if (res.status === 200) {
      navigate.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};
