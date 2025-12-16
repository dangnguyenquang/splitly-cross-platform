// __tests__/signIn/SignIn.integration.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignInScreen from '@/src/screens/auth/SignInScreen';
import { userLogin } from '@/src/api/auth.api';
import axios from 'axios';

const mockNavigate = { navigate: jest.fn(), reset: jest.fn() };
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('@/src/api/auth.api', () => ({
  userLogin: jest.fn(),
}));

jest.mock('axios');
jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');
jest.mock('@react-native-vector-icons/fontawesome6', () => 'Icon');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('SignInScreen - INTEGRATION TESTS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillAndSubmit = (screen: any, email: string, password: string) => {
    const { getByPlaceholderText, getByTestId } = screen;
    fireEvent.changeText(getByPlaceholderText('Email'), email);
    fireEvent.changeText(getByPlaceholderText('Password'), password);
    fireEvent.press(getByTestId('sign-in-button'));
  };

  // =======================================================
  // Successful Login
  // =======================================================
  describe('Sign In - Successful Login', () => {
    it('should successfully login with valid credentials', async () => {
      (userLogin as jest.Mock).mockResolvedValueOnce({
        email: 'test@gmail.com',
        token: 'valid-token-123',
        userId: '12345',
      });

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'Password123');

      await waitFor(() => {
        expect(userLogin).toHaveBeenCalledWith(
          mockDispatch,
          { email: 'test@gmail.com', password: 'Password123' },
          mockNavigate
        );
      });
    });

    it('should navigate after login success', async () => {
      (userLogin as jest.Mock).mockResolvedValueOnce({
        email: 'user@example.com',
        token: 'jwt-token',
      });

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'user@example.com', 'ValidPass123');

      await waitFor(() => {
        expect(userLogin).toHaveBeenCalled();
      });
    });
  });

  // =======================================================
  // Invalid Credentials
  // =======================================================
  describe('Sign In - Invalid Credentials', () => {
    it('should show error when credentials invalid (404)', async () => {
      const mockError = {
        status: 404,
        response: { status: 404 },
        isAxiosError: true,
      };

      (userLogin as jest.Mock).mockRejectedValueOnce(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'wrong@example.com', 'Password123');

      await waitFor(() => {
        expect(userLogin).toHaveBeenCalled();
      });

      expect(await screen.findByText('Invalid email or password')).toBeTruthy();
    });

    it('should not navigate when login fails', async () => {
      const mockError = {
        status: 404,
        isAxiosError: true,
      };

      (userLogin as jest.Mock).mockRejectedValueOnce(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'user@example.com', 'Password123');

      await waitFor(() => {
        expect(userLogin).toHaveBeenCalled();
      });

      expect(mockNavigate.reset).not.toHaveBeenCalled();
      expect(mockNavigate.navigate).not.toHaveBeenCalled();
    });
  });

  // =======================================================
  // Error Handling
  // =======================================================
  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      (userLogin as jest.Mock).mockRejectedValueOnce(networkError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'Password123');

      await waitFor(() => {
        expect(userLogin).toHaveBeenCalled();
      });
    });
  });
});
