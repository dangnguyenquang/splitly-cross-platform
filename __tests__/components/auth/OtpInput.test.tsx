import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OtpInputs from '@/src/components/auth/OtpInput';


describe('OtpInputs', () => {
  it('renders correct number of inputs', () => {
    const { getAllByTestId } = render(<OtpInputs length={4} />);
    const inputs = getAllByTestId(/^otp-input-/); // match all inputs by testID prefix
    expect(inputs.length).toBe(4);
  });

  it('calls onChangeCode and onComplete correctly', () => {
    const mockOnChangeCode = jest.fn();
    const mockOnComplete = jest.fn();

    const { getAllByTestId } = render(
      <OtpInputs
        length={4}
        onChangeCode={mockOnChangeCode}
        onComplete={mockOnComplete}
      />
    );

    const inputs = getAllByTestId(/^otp-input-/);

    // Nhập từng số
    fireEvent.changeText(inputs[0], '1');
    expect(mockOnChangeCode).toHaveBeenLastCalledWith('1');

    fireEvent.changeText(inputs[1], '2');
    fireEvent.changeText(inputs[2], '3');
    fireEvent.changeText(inputs[3], '4');

    expect(mockOnChangeCode).toHaveBeenLastCalledWith('1234');
    expect(mockOnComplete).toHaveBeenCalledWith('1234');
  });

  it('handles paste/multi-character input', () => {
    const mockOnChangeCode = jest.fn();
    const mockOnComplete = jest.fn();

    const { getAllByTestId } = render(
      <OtpInputs
        length={4}
        onChangeCode={mockOnChangeCode}
        onComplete={mockOnComplete}
      />
    );

    const inputs = getAllByTestId(/^otp-input-/);

    // Paste nhiều ký tự vào ô đầu
    fireEvent.changeText(inputs[0], '5678');
    expect(mockOnChangeCode).toHaveBeenLastCalledWith('5678');
    expect(mockOnComplete).toHaveBeenCalledWith('5678');
  });

  it('handles backspace correctly', () => {
    const mockOnChangeCode = jest.fn();
    const { getAllByTestId } = render(
      <OtpInputs length={4} onChangeCode={mockOnChangeCode} />
    );

    const inputs = getAllByTestId(/^otp-input-/);

    // Nhập vài số
    fireEvent.changeText(inputs[0], '1');
    fireEvent.changeText(inputs[1], '2');

    // Xóa số đầu tiên bằng backspace
    fireEvent(inputs[1], 'keyPress', { nativeEvent: { key: 'Backspace' } });

    expect(mockOnChangeCode).toHaveBeenLastCalledWith('1');
  });
});
