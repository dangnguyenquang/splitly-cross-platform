import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignInScreen from '@/src/screens/auth/SignInScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

const mockUserLogin = jest.fn().mockResolvedValue({
  email: 'test@gmail.com',
  token: 'abc123',
});
jest.mock('@/src/api/auth.api', () => ({
  userLogin: (...args: any[]) => mockUserLogin(...args),
}));

jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');
jest.mock('@react-native-vector-icons/fontawesome6', () => 'Icon');

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inputs and logs in successfully', async () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123');
    fireEvent.press(getByText('Sign in'));

    await waitFor(() => {
      expect(mockUserLogin).toHaveBeenCalledWith(
        mockDispatch,
        { email: 'test@gmail.com', password: 'Password123' },
        expect.any(Function)
      );
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('shows validation error when email is empty', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SignInScreen />);

    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123');
    fireEvent.press(getByText('Sign in'));

    await waitFor(() => {
      expect(queryByText(/Please enter your email/i)).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });
  });

  it('shows validation error when password is empty', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SignInScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@gmail.com');
    fireEvent.press(getByText('Sign in'));

    await waitFor(() => {
      expect(queryByText(/Please enter your password/i)).toBeTruthy();
      expect(mockUserLogin).not.toHaveBeenCalled();
    });
  });

  it('handles login API failure', async () => {
    mockUserLogin.mockRejectedValueOnce(new Error('Login failed'));
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123');
    fireEvent.press(getByText('Sign in'));

    await waitFor(() => {
      expect(mockUserLogin).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled(); // Assuming dispatch only runs on success
    });
  });

  it('navigates to Forgot Password screen', async () => {
    const { getByText } = render(<SignInScreen />);
    const forgotBtn = getByText(/Forgot password\?/i);

    fireEvent.press(forgotBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword'); // Replace with your actual route
    });
  });
});
