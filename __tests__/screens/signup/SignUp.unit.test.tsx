// __tests__/auth/SignUp.unit.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '@/src/screens/auth/SignUpScreen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

jest.mock('@react-native-vector-icons/fontawesome6', () => 'FontAwesome6');
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');
jest.mock('@react-native-vector-icons/material-design-icons', () => 'MaterialDesignIcons');

describe('Sign Up – UNIT Tests', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  // -------------------------------
  // 🟢 UNIT TEST: empty email
  // -------------------------------
  describe('Empty Email', () => {
    it('should show error when email is empty', async () => {
      const { getByPlaceholderText, getByTestId, findByText } = render(<SignUpScreen />);

      fireEvent.changeText(getByPlaceholderText('Please enter username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Please enter password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');

      fireEvent.press(getByTestId('sign-up-button'));

      expect(await findByText('Please enter your email')).toBeTruthy();
    });
  });

  // -------------------------------
  // 🟢 UNIT TEST: password mismatch
  // -------------------------------
  describe('Password mismatch', () => {
    it('should show error when password and confirm do not match', async () => {
      const { getByPlaceholderText, getByTestId, findByText } = render(<SignUpScreen />);

      fireEvent.changeText(getByPlaceholderText('Please enter username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Please enter email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Please enter password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'different');
      fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');

      fireEvent.press(getByTestId('sign-up-button'));

      expect(await findByText('Your confirmation is not correct')).toBeTruthy();
    });
  });
});
