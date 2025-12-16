import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Mock API trước khi import screen
jest.mock('@/src/api/auth.api', () => ({
  userRegister: jest.fn(),
  verifyOTP: jest.fn(),
}));

import SignUpScreen from '@/src/screens/auth/SignUpScreen';
import OTPScreen from '@/src/screens/auth/OTPScreen';
import * as authApi from '@/src/api/auth.api';

const Stack = createNativeStackNavigator();

describe('SignUp → OTP integration flow', () => {
  const mockUserRegister = authApi.userRegister as jest.MockedFunction<typeof authApi.userRegister>;
  const mockVerifyOTP = authApi.verifyOTP as jest.MockedFunction<typeof authApi.verifyOTP>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows user to sign up and verify OTP', async () => {
    // --- Mock API responses ---
    // mockUserRegister.mockResolvedValue({ success: true });
    // mockVerifyOTP.mockResolvedValue({ verified: true });

    const { getByPlaceholderText, getByText, getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignUp">
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // --- Fill SignUp form ---
    fireEvent.changeText(getByPlaceholderText('Please enter username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Please enter email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Please enter password'), 'abc12345');
    fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'abc12345');
    fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');

    // --- Submit SignUp ---
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => expect(mockUserRegister).toHaveBeenCalledTimes(1));
    expect(mockUserRegister).toHaveBeenCalledWith(
      expect.anything(), // dispatch
      expect.objectContaining({
        userName: 'testuser',
        email: 'test@example.com',
        password: 'abc12345',
        phoneNumber: '0123456789',
      }),
      expect.anything() // navigation
    );

    // --- Wait for OTP screen ---
    await waitFor(() => expect(getByText('Verify')).toBeTruthy());

    // --- Enter OTP code ---
    const otpValues = ['1', '2', '3', '4', '5', '6'];
    otpValues.forEach((val, index) => {
      const input = getByTestId(`otp-input-${index}`);
      fireEvent.changeText(input, val);
    });

    // --- Press Verify ---
    fireEvent.press(getByText('Verify'));

    await waitFor(() => expect(mockVerifyOTP).toHaveBeenCalledTimes(1));
    expect(mockVerifyOTP).toHaveBeenCalledWith(
      '123456',
      'test@example.com',
      expect.anything() // navigation
    );
  });
});
