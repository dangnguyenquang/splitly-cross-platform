import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputAuth from '@/src/components/auth/CustomInputAuth';

jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');

describe('InputAuth', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('toggles secureTextEntry when hiddenIcon pressed', () => {
    const { getByPlaceholderText, getByRole } = render(
      <InputAuth
        label="Password"
        placeholder="Enter password"
        value=""
        icon={null}
        hiddenIcon
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Enter password'); // ✅ Đây mới đúng
    const pressable = getByRole('button');

    // Ban đầu secureTextEntry = true
    expect(input.props.secureTextEntry).toBe(true);

    // Nhấn toggle
    fireEvent.press(pressable);
    expect(input.props.secureTextEntry).toBe(false);

    fireEvent.press(pressable);
    expect(input.props.secureTextEntry).toBe(true);
  });
});
