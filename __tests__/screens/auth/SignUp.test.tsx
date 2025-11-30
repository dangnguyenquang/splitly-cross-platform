import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '@/src/screens/auth/SignUpScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

const mockUserRegister = jest.fn().mockResolvedValue({
  email: 'test@gmail.com',
  token: 'abc123',
});
jest.mock('@/src/api/auth.api', () => ({
  userRegister: (...args: any[]) => mockUserRegister(...args),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inputs and submits registration successfully', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Please enter username'), 'TestUser');
    fireEvent.changeText(getByPlaceholderText('Please enter email'), 'test@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Please enter password'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(mockUserRegister).toHaveBeenCalledWith(
        mockDispatch,
        {
          userName: 'TestUser',
          email: 'test@gmail.com',
          password: 'Password123',
          phoneNumber: '0123456789',
          gender: 'male',
        },
        expect.any(Function)
      );
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('shows error when required fields are empty', async () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Please enter your username')).toBeTruthy();
      expect(getByText('Please enter your email')).toBeTruthy();
      expect(getByText('Please enter your password')).toBeTruthy();
      expect(getByText('Please enter your password confirmation')).toBeTruthy();
      expect(getByText('Please enter your phone number')).toBeTruthy();
      expect(mockUserRegister).not.toHaveBeenCalled();
    });
  });

  it('shows error when password and confirmation do not match', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Please enter password'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'Password321');
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Your confirmation is not correct')).toBeTruthy();
      expect(mockUserRegister).not.toHaveBeenCalled();
    });
  });

  it('shows error for invalid email format', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Please enter email'), 'invalid-email');
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Email is invalid')).toBeTruthy();
      expect(mockUserRegister).not.toHaveBeenCalled();
    });
  });

  it('shows error for invalid phone number', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '12345');
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Phone must be 10 digits and start with 0')).toBeTruthy();
      expect(mockUserRegister).not.toHaveBeenCalled();
    });
  });

  it('handles API failure gracefully', async () => {
    mockUserRegister.mockRejectedValueOnce(new Error('API error'));
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Please enter username'), 'TestUser');
    fireEvent.changeText(getByPlaceholderText('Please enter email'), 'test@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Please enter password'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(mockUserRegister).toHaveBeenCalled();
      // Optional: Check that error is displayed (if you handle API error in UI)
    });
  });
});
