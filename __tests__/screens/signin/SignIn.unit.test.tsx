// __tests__/signIn/SignIn.unit.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignInScreen from '@/src/screens/auth/SignInScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), reset: jest.fn() }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock('@/src/api/auth.api', () => ({
  userLogin: jest.fn(),
}));

jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');
jest.mock('@react-native-vector-icons/fontawesome6', () => 'Icon');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

describe('SignInScreen - UNIT TESTS', () => {
  const fillAndSubmit = (screen: any, email: string, password: string) => {
    const { getByPlaceholderText, getByTestId } = screen;
    if (email) fireEvent.changeText(getByPlaceholderText('Email'), email);
    if (password) fireEvent.changeText(getByPlaceholderText('Password'), password);
    fireEvent.press(getByTestId('sign-in-button'));
  };

  // ==========================================
  // UI Rendering
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
  // Email Validation
  // ==========================================
  describe('Email Validation', () => {
    it('should show error when email is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, '', 'Password123');

      expect(await screen.findByText('Email is required')).toBeTruthy();
    });

    it('should show error when email format is invalid', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'invalid-email', 'Password123');

      expect(await screen.findByText('Email is invalid')).toBeTruthy();
    });
  });

  // ==========================================
  // Password Validation
  // ==========================================
  describe('Password Validation', () => {
    it('should show error when password is empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', '');

      expect(await screen.findByText('Have not entered password')).toBeTruthy();
    });

    it('should show error when password is less than 8 chars', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'Pass1');

      expect(await screen.findByText('At least 8 letters')).toBeTruthy();
    });

    it('should show error when password has no numbers', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', 'PasswordOnly');

      expect(await screen.findByText('Password must have number and letter')).toBeTruthy();
    });

    it('should show error when password has no letters', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'test@gmail.com', '12345678');

      expect(await screen.findByText('Password must have number and letter')).toBeTruthy();
    });
  });

  // ==========================================
  // Empty Field Cases
  // ==========================================
  describe('Empty Field Cases', () => {
    it('should show error when email empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, '', 'Password123');

      expect(await screen.findByText('Email is required')).toBeTruthy();
    });

    it('should show error when password empty', async () => {
      const screen = render(<SignInScreen />);
      fillAndSubmit(screen, 'user@example.com', '');

      expect(await screen.findByText('Have not entered password')).toBeTruthy();
    });

    it('should show both errors when fields are empty', async () => {
      const { getByTestId, findByText } = render(<SignInScreen />);
      fireEvent.press(getByTestId('sign-in-button'));

      expect(await findByText('Email is required')).toBeTruthy();
      expect(await findByText('Have not entered password')).toBeTruthy();
    });
  });
});
