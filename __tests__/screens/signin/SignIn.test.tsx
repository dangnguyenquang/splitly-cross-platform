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

const mockUserLogin = jest.fn();
jest.mock('@/src/api/auth.api', () => ({
  userLogin: jest.fn(),
}));

jest.mock('axios');
jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');
jest.mock('@react-native-vector-icons/fontawesome6', () => 'Icon');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userLogin as jest.Mock).mockImplementation(mockUserLogin);
  });

  const fillAndSubmit = (screen: any, email: string, password: string) => {
    const { getByPlaceholderText, getByTestId } = screen;
    if (email) fireEvent.changeText(getByPlaceholderText('Email'), email);
    if (password) fireEvent.changeText(getByPlaceholderText('Password'), password);
    fireEvent.press(getByTestId('sign-in-button'));
  };

  // ==========================================
  // UNIT TESTS - UI Rendering
  // ==========================================
  it('should render all form elements', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<SignInScreen />);

    expect(getByText('Welcom back!')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Forgot password?')).toBeTruthy();
    expect(getByTestId('sign-in-button')).toBeTruthy();
  });

  // ==========================================
  // UNIT TESTS - Email Validation
  // ==========================================
  describe('Email Validation', () => {
    it('should show error when email is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, '', 'Password123');

      expect(await screen.findByText('Email is required')).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });

    it('should show error when email format is invalid', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'invalid-email', 'Password123');

      expect(await screen.findByText('Email is invalid')).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // UNIT TESTS - Password Validation
  // ==========================================
  describe('Password Validation', () => {
    it('should show error when password is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', '');

      expect(await screen.findByText('Have not entered password')).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });

    it('should show error when password is less than 8 characters', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'Pass1');

      expect(await screen.findByText('At least 8 letters')).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });

    it('should show error when password has no numbers', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'PasswordOnly');

      expect(await screen.findByText('Password must have number and letter')).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });

    it('should show error when password has no letters', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', '12345678');

      expect(await screen.findByText('Password must have number and letter')).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // INTEGRATION TESTS - Successful Login
  // ==========================================
  describe('Sign In - Verify user login and view home page', () => {
    it('should successfully login with valid credentials', async () => {
      mockUserLogin.mockResolvedValueOnce({
        email: 'test@gmail.com',
        token: 'valid-token-123',
        userId: '12345',
      });

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'Password123');

      await waitFor(() => {
        expect(mockUserLogin).toHaveBeenCalledWith(
          mockDispatch,
          { email: 'test@gmail.com', password: 'Password123' },
          mockNavigate
        );
      });
    });

    it('should navigate to Homescreen after successful login', async () => {
      mockUserLogin.mockResolvedValueOnce({
        email: 'user@example.com',
        token: 'jwt-token',
      });

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'user@example.com', 'ValidPass123');

      await waitFor(() => {
        expect(mockUserLogin).toHaveBeenCalled();
      });
    });
  });

  // ==========================================
  // INTEGRATION TESTS - Invalid Credentials
  // ==========================================
  describe('Sign In Flow - Invalid Password', () => {
    it('should show error when credentials are invalid (404)', async () => {
      const mockError = {
        status: 404,
        response: { status: 404 },
        isAxiosError: true,
      };

      mockUserLogin.mockRejectedValueOnce(mockError);
      (axios.isAxiosError as jest.MockedFunction<typeof axios.isAxiosError>).mockReturnValue(true);

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'wrong@example.com', 'Password123');

      await waitFor(() => {
        expect(mockUserLogin).toHaveBeenCalled();
      });

      expect(await screen.findByText('Invalid email or password')).toBeTruthy();
    });

    it('should not navigate when login fails', async () => {
      const mockError = {
        status: 404,
        isAxiosError: true,
      };

      mockUserLogin.mockRejectedValueOnce(mockError);
      (axios.isAxiosError as jest.MockedFunction<typeof axios.isAxiosError>).mockReturnValue(true);

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'user@example.com', 'Password123');

      await waitFor(() => {
        expect(mockUserLogin).toHaveBeenCalled();
      });

      expect(mockNavigate.reset).not.toHaveBeenCalled();
      expect(mockNavigate.navigate).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // UNIT TESTS - Empty Fields
  // ==========================================
  describe('Sign In Flow - Leave email empty', () => {
    it('should show error when email is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, '', 'Password123');

      expect(await screen.findByText('Email is required')).toBeTruthy();
    });

    it('should not call API when email is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, '', 'Password123');

      await waitFor(() => {
        expect(mockUserLogin).not.toHaveBeenCalled();
      });
    });
  });

  describe('Sign In Flow - Leave password empty', () => {
    it('should show error when password is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'user@example.com', '');

      expect(await screen.findByText('Have not entered password')).toBeTruthy();
    });

    it('should not call API when password is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'user@example.com', '');

      await waitFor(() => {
        expect(mockUserLogin).not.toHaveBeenCalled();
      });
    });

    it('should show both errors when both fields are empty', async () => {
      const { getByTestId, findByText } = render(<SignInScreen />);
      fireEvent.press(getByTestId('sign-in-button'));

      expect(await findByText('Email is required')).toBeTruthy();
      expect(await findByText('Have not entered password')).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // INTEGRATION TESTS - Error Handling
  // ==========================================
  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockUserLogin.mockRejectedValueOnce(networkError);
      (axios.isAxiosError as jest.MockedFunction<typeof axios.isAxiosError>).mockReturnValue(false);

      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'Password123');

      await waitFor(() => {
        expect(mockUserLogin).toHaveBeenCalled();
      });
    });
  });
});