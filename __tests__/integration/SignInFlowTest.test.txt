// __tests__/integration/SignInFlow.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '@/src/screens/auth/SignInScreen';
import * as authApi from '@/src/api/auth.api';

const Stack = createNativeStackNavigator();

// Mock userLogin API
jest.mock('@/src/api/auth.api', () => ({
  userLogin: jest.fn(),
}));

describe('SignInScreen Integration', () => {
  const mockUserLogin = authApi.userLogin as jest.MockedFunction<typeof authApi.userLogin>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow user to sign in successfully', async () => {
    mockUserLogin.mockResolvedValue({ email: 'test@example.com' } as any);

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Fill in form
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'abc12345');

    // Press Sign in
    fireEvent.press(getByText('Sign in'));

    // Wait for API call
    await waitFor(() => expect(mockUserLogin).toHaveBeenCalledTimes(1));

    // Check that it was called with correct params
    expect(mockUserLogin).toHaveBeenCalledWith(
      expect.anything(), // dispatch
      {
        email: 'test@example.com',
        password: 'abc12345',
      },
      expect.anything() // navigation
    );
  });

  it('should show error message on invalid credentials', async () => {
    mockUserLogin.mockRejectedValue({
      isAxiosError: true,
      status: 401,
      response: { data: { message: 'Invalid email or password' } },
    });

    const { getByPlaceholderText, getByText, findByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');

    fireEvent.press(getByText('Sign in'));

    const errorText = await findByText('Invalid email or password');
    expect(errorText).toBeTruthy();
    expect(mockUserLogin).toHaveBeenCalledTimes(1);
  });
});
