import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputAuth from '@/src/components/auth/CustomInputAuth';

jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');

describe('InputAuth', () => {
  const mockOnChangeText = jest.fn();
  const defaultProps = {
    label: 'Email',
    placeholder: 'Enter your email',
    value: '',
    icon: null,
    hiddenIcon: false,
    onChangeText: mockOnChangeText,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      const { getByPlaceholderText, getByText } = render(
        <InputAuth {...defaultProps} />
      );

      expect(getByText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    it('renders with initial value', () => {
      const { getByDisplayValue } = render(
        <InputAuth {...defaultProps} value="test@email.com" />
      );

      expect(getByDisplayValue('test@email.com')).toBeTruthy();
    });

    it('does not render toggle button when hiddenIcon is false', () => {
      const { queryByRole } = render(
        <InputAuth {...defaultProps} hiddenIcon={false} />
      );

      expect(queryByRole('button')).toBeNull();
    });

    it('renders toggle button when hiddenIcon is true', () => {
      const { getByRole } = render(
        <InputAuth {...defaultProps} hiddenIcon={true} />
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('starts with secureTextEntry enabled when hiddenIcon is true', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} hiddenIcon={true} />
      );

      const input = getByPlaceholderText('Enter your email');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('toggles secureTextEntry when toggle button is pressed', () => {
      const { getByPlaceholderText, getByRole } = render(
        <InputAuth {...defaultProps} hiddenIcon={true} />
      );

      const input = getByPlaceholderText('Enter your email');
      const toggleButton = getByRole('button');

      expect(input.props.secureTextEntry).toBe(true);

      fireEvent.press(toggleButton);
      expect(input.props.secureTextEntry).toBe(false);

      fireEvent.press(toggleButton);
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('toggles multiple times correctly', () => {
      const { getByPlaceholderText, getByRole } = render(
        <InputAuth {...defaultProps} hiddenIcon={true} />
      );

      const input = getByPlaceholderText('Enter your email');
      const toggleButton = getByRole('button');

      // Toggle 5 lần
      for (let i = 0; i < 5; i++) {
        const expectedValue = i % 2 === 0;
        expect(input.props.secureTextEntry).toBe(expectedValue);
        fireEvent.press(toggleButton);
      }
    });
  });

  describe('Text Input Interaction', () => {
    it('calls onChangeText when text is entered', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} />
      );

      const input = getByPlaceholderText('Enter your email');
      fireEvent.changeText(input, 'test@example.com');

      expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    });

    it('calls onChangeText multiple times for multiple inputs', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} />
      );

      const input = getByPlaceholderText('Enter your email');
      
      fireEvent.changeText(input, 't');
      fireEvent.changeText(input, 'te');
      fireEvent.changeText(input, 'test');

      expect(mockOnChangeText).toHaveBeenCalledTimes(3);
      expect(mockOnChangeText).toHaveBeenLastCalledWith('test');
    });

    it('handles empty string input', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} value="test" />
      );

      const input = getByPlaceholderText('Enter your email');
      fireEvent.changeText(input, '');

      expect(mockOnChangeText).toHaveBeenCalledWith('');
    });

    it('preserves text when toggling password visibility', () => {
      const { getByPlaceholderText, getByRole, rerender } = render(
        <InputAuth {...defaultProps} hiddenIcon={true} value="password123" />
      );

      const input = getByPlaceholderText('Enter your email');
      const toggleButton = getByRole('button');

      expect(input.props.value).toBe('password123');

      fireEvent.press(toggleButton);
      
      rerender(
        <InputAuth {...defaultProps} hiddenIcon={true} value="password123" />
      );

      expect(input.props.value).toBe('password123');
    });
  });

  describe('Accessibility', () => {
    it('has accessible button role for toggle', () => {
      const { getByRole } = render(
        <InputAuth {...defaultProps} hiddenIcon={true} />
      );

      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('input is accessible by placeholder', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} placeholder="Custom placeholder" />
      );

      expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined value prop', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} value={undefined as any} />
      );

      const input = getByPlaceholderText('Enter your email');
      expect(input).toBeTruthy();
    });

    it('handles special characters in input', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} />
      );

      const input = getByPlaceholderText('Enter your email');
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      fireEvent.changeText(input, specialChars);

      expect(mockOnChangeText).toHaveBeenCalledWith(specialChars);
    });

    it('handles very long text input', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} />
      );

      const input = getByPlaceholderText('Enter your email');
      const longText = 'a'.repeat(1000);
      
      fireEvent.changeText(input, longText);

      expect(mockOnChangeText).toHaveBeenCalledWith(longText);
    });
  });

  describe('Component Props Variations', () => {
    it('works with different label text', () => {
      const { getByText } = render(
        <InputAuth {...defaultProps} label="Password" />
      );

      expect(getByText('Password')).toBeTruthy();
    });

    it('works with different placeholder text', () => {
      const { getByPlaceholderText } = render(
        <InputAuth {...defaultProps} placeholder="Type here..." />
      );

      expect(getByPlaceholderText('Type here...')).toBeTruthy();
    });

    it('handles password field correctly', () => {
      const { getByPlaceholderText, getByRole } = render(
        <InputAuth
          label="Password"
          placeholder="Enter password"
          value=""
          icon={null}
          hiddenIcon={true}
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByPlaceholderText('Enter password');
      const toggleButton = getByRole('button');

      // Kiểm tra ban đầu là password field
      expect(input.props.secureTextEntry).toBe(true);

      // Nhập password
      fireEvent.changeText(input, 'mySecretPassword');
      expect(mockOnChangeText).toHaveBeenCalledWith('mySecretPassword');

      // Toggle để show password
      fireEvent.press(toggleButton);
      expect(input.props.secureTextEntry).toBe(false);
    });
  });
});