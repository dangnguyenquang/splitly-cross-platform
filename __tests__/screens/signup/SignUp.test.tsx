import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '@/src/screens/auth/SignUpScreen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { userRegister } from '@/src/api/auth.api';
import axios from 'axios';
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@/src/api/auth.api', () => ({
  userRegister: jest.fn(),
}));

jest.mock('axios');

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock icon components
jest.mock('@react-native-vector-icons/fontawesome6', () => 'FontAwesome6');
jest.mock('@react-native-vector-icons/fontawesome', () => 'FontAwesome');
jest.mock('@react-native-vector-icons/material-design-icons', () => 'MaterialDesignIcons');

describe('Sign Up', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  // -------------------------------
  // INTEGRATION TESTS: kiểm tra flow đầy đủ
  // -------------------------------
  describe('User sign up valid', () => {
    it('should successfully register user with valid credentials', async () => {
      (userRegister as jest.Mock).mockResolvedValue({ 
        success: true,
        data: { id: '123', userName: 'testuser', email: 'test@example.com' }
      });

      const { getByPlaceholderText, getByTestId } = render(<SignUpScreen />);
      
      fireEvent.changeText(getByPlaceholderText('Please enter username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Please enter email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Please enter password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');
      
      fireEvent.press(getByTestId('sign-up-button'));

      await waitFor(() => {
        expect(userRegister).toHaveBeenCalledTimes(1);
      });
    });
  });

  // -------------------------------
  // INTEGRATION TEST: test form + API call với email hợp lệ
  // -------------------------------
  describe('Email format validation', () => {
    it('should register with different valid email formats', async () => {
      (userRegister as jest.Mock).mockResolvedValue({ success: true });

      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.com',
      ];

      for (const email of validEmails) {
        jest.clearAllMocks();
        
        const { getByPlaceholderText, getByTestId, unmount } = render(<SignUpScreen />);
        
        fireEvent.changeText(getByPlaceholderText('Please enter username'), 'testuser');
        fireEvent.changeText(getByPlaceholderText('Please enter email'), email);
        fireEvent.changeText(getByPlaceholderText('Please enter password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');
        
        fireEvent.press(getByTestId('sign-up-button'));

        await waitFor(() => {
          expect(userRegister).toHaveBeenCalled();
        });
        
        unmount();
      }
    });
  });

  // -------------------------------
  // INTEGRATION TEST: API error (email trùng)
  // -------------------------------
  describe('Existing Email', () => {
    it('should show error when email already exists', async () => {
      const mockError = {
        response: { data: { message: 'Email already taken.' } },
        isAxiosError: true,
      };

      //
      (userRegister as jest.Mock).mockRejectedValue(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const { getByPlaceholderText, getByTestId, findByText } = render(<SignUpScreen />);

      fireEvent.changeText(getByPlaceholderText('Please enter username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Please enter email'), 'existing@example.com');
      fireEvent.changeText(getByPlaceholderText('Please enter password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');

      fireEvent.press(getByTestId('sign-up-button'));

      const errorMessage = await findByText('Email has already exitsted');
      expect(errorMessage).toBeTruthy();
    });
  });

  // -------------------------------
  // UNIT TEST: chỉ test validation email rỗng
  // -------------------------------
  describe('Empty Email', () => {
    it('should show error when email is empty', async () => {
      // Unit test vì chỉ test validation trong component (không gọi API)
      const { getByPlaceholderText, getByTestId, findByText } = render(<SignUpScreen />);

      fireEvent.changeText(getByPlaceholderText('Please enter username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Please enter password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please confirm password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Please enter your phone'), '0123456789');

      fireEvent.press(getByTestId('sign-up-button'));

      const msg = await findByText('Please enter your email');
      expect(msg).toBeTruthy();
    });
  });

  // -------------------------------
  // UNIT TEST: kiểm tra validation password mismatch
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

      const msg = await findByText('Your confirmation is not correct');
      expect(msg).toBeTruthy();
    });
  });
});
