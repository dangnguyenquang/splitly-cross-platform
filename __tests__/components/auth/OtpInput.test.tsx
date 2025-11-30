import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OtpInputs from '@/src/components/auth/OtpInput';

describe('OtpInputs', () => {
  // ==========================================
  // UNIT TESTS - Rendering
  // ==========================================
  describe('Rendering', () => {
    it('should render correct number of inputs', () => {
      const { getAllByTestId } = render(<OtpInputs length={6} />);
      const inputs = getAllByTestId(/^otp-input-/);
      
      expect(inputs).toHaveLength(6);
    });

    it('should render with different lengths', () => {
      const lengths = [4, 5, 6, 8];
      
      lengths.forEach(length => {
        const { getAllByTestId, unmount } = render(<OtpInputs length={length} />);
        const inputs = getAllByTestId(/^otp-input-/);
        
        expect(inputs).toHaveLength(length);
        unmount();
      });
    });

    it('should have all inputs empty initially', () => {
      const { getAllByTestId } = render(<OtpInputs length={6} />);
      const inputs = getAllByTestId(/^otp-input-/);
      
      inputs.forEach(input => {
        expect(input.props.value).toBe('');
      });
    });
  });

  // ==========================================
  // UNIT TESTS - Single Character Input
  // ==========================================
  describe('Single Character Input', () => {
    it('should accept single digit input', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1');

      expect(mockOnChangeCode).toHaveBeenCalledWith('1');
    });

    it('should only accept numeric characters', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], 'a');
      fireEvent.changeText(inputs[1], '1');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('1');
    });

    it('should reject special characters', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '@');
      fireEvent.changeText(inputs[1], '#');
      fireEvent.changeText(inputs[2], '5');
      fireEvent.changeText(inputs[3], '#');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('5');
    });
  });

  // ==========================================
  // INTEGRATION TESTS - Complete OTP Flow
  // ==========================================
  describe('Complete OTP Flow', () => {
    it('should call onChangeCode for each digit entry', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');

      expect(mockOnChangeCode).toHaveBeenCalledWith('1');
      expect(mockOnChangeCode).toHaveBeenCalledWith('12');
      expect(mockOnChangeCode).toHaveBeenCalledWith('123');
    });

    it('should call onComplete when all digits are entered', () => {
      const mockOnChangeCode = jest.fn();
      const mockOnComplete = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} onComplete={mockOnComplete} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');
      fireEvent.changeText(inputs[3], '4');
      fireEvent.changeText(inputs[4], '5');
      fireEvent.changeText(inputs[5], '6');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('123456');
      expect(mockOnComplete).toHaveBeenCalledWith('123456');
    });

    it('should not call onComplete for incomplete OTP', () => {
      const mockOnComplete = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onComplete={mockOnComplete} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');

      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // INTEGRATION TESTS - Paste/Multi-Character
  // ==========================================
  describe('Paste Multiple Characters', () => {
    it('should handle paste of complete OTP', () => {
      const mockOnChangeCode = jest.fn();
      const mockOnComplete = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} onComplete={mockOnComplete} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '123456');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('123456');
      expect(mockOnComplete).toHaveBeenCalledWith('123456');
    });

    it('should handle paste of partial OTP', () => {
      const mockOnChangeCode = jest.fn();
      const mockOnComplete = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} onComplete={mockOnComplete} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '123');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('123');
      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    it('should truncate paste exceeding length', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1234567890');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('123456');
    });

    it('should filter non-numeric characters from paste', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1a2b3c');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('123');
    });
  });

  // ==========================================
  // UNIT TESTS - Backspace Handling
  // ==========================================
  describe('Backspace Handling', () => {
    it('should delete current digit and move to previous input', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent(inputs[1], 'keyPress', { nativeEvent: { key: 'Backspace' } });

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('1');
    });

    it('should handle backspace at first input without error', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent(inputs[0], 'keyPress', { nativeEvent: { key: 'Backspace' } });

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('');
    });

    it('should delete all digits using backspace', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      // Fill OTP
      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');

      // Delete backwards
      fireEvent(inputs[2], 'keyPress', { nativeEvent: { key: 'Backspace' } });
      fireEvent(inputs[1], 'keyPress', { nativeEvent: { key: 'Backspace' } });
      fireEvent(inputs[0], 'keyPress', { nativeEvent: { key: 'Backspace' } });

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('');
    });
  });

  // ==========================================
  // UNIT TESTS - Clear/Reset
  // ==========================================
  describe('Clear and Reset', () => {
    it('should clear all inputs on rerender', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId, rerender } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      let inputs = getAllByTestId(/^otp-input-/);

      // Fill OTP
      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');
      fireEvent.changeText(inputs[3], '4');
      fireEvent.changeText(inputs[4], '5');
      fireEvent.changeText(inputs[5], '6');

      // Clear and rerender
      rerender(<OtpInputs length={6} onChangeCode={mockOnChangeCode} />);
      inputs = getAllByTestId(/^otp-input-/);

      inputs.forEach(input => {
        expect(input.props.value).toBe('');
      });
    });
  });

  // ==========================================
  // INTEGRATION TESTS - Edge Cases
  // ==========================================
  describe('Edge Cases', () => {
    it('should handle rapid consecutive inputs', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');
      fireEvent.changeText(inputs[3], '4');
      fireEvent.changeText(inputs[4], '5');
      fireEvent.changeText(inputs[5], '6');

      expect(mockOnChangeCode).toHaveBeenCalled();
      expect(mockOnChangeCode.mock.calls.length).toBeGreaterThan(0);
    });

    it('should handle mixed valid and invalid characters', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], 'a'); // invalid
      fireEvent.changeText(inputs[2], '2');
      fireEvent.changeText(inputs[3], '@'); // invalid
      fireEvent.changeText(inputs[4], '3');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('123');
    });

    it('should handle zero as valid input', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '0');
      fireEvent.changeText(inputs[1], '0');
      fireEvent.changeText(inputs[2], '0');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('000');
    });

    it('should handle replacement of existing digits', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      // Initial input
      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');

      // Replace digit
      fireEvent.changeText(inputs[1], '9');

      expect(mockOnChangeCode).toHaveBeenLastCalledWith('193');
    });
  });

  // ==========================================
  // UNIT TESTS - Callback Tests
  // ==========================================
  describe('Callback Functions', () => {
    it('should work without onChangeCode callback', () => {
      const { getAllByTestId } = render(<OtpInputs length={6} />);
      const inputs = getAllByTestId(/^otp-input-/);

      expect(() => {
        fireEvent.changeText(inputs[0], '1');
        fireEvent.changeText(inputs[1], '2');
      }).not.toThrow();
    });

    it('should work without onComplete callback', () => {
      const mockOnChangeCode = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={6} onChangeCode={mockOnChangeCode} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      expect(() => {
        fireEvent.changeText(inputs[0], '1');
        fireEvent.changeText(inputs[1], '2');
        fireEvent.changeText(inputs[2], '3');
        fireEvent.changeText(inputs[3], '4');
        fireEvent.changeText(inputs[4], '5');
        fireEvent.changeText(inputs[5], '6');
      }).not.toThrow();
    });

    it('should call callbacks with correct values', () => {
      const mockOnChangeCode = jest.fn();
      const mockOnComplete = jest.fn();
      const { getAllByTestId } = render(
        <OtpInputs length={4} onChangeCode={mockOnChangeCode} onComplete={mockOnComplete} />
      );
      const inputs = getAllByTestId(/^otp-input-/);

      fireEvent.changeText(inputs[0], '5');
      fireEvent.changeText(inputs[1], '6');
      fireEvent.changeText(inputs[2], '7');
      fireEvent.changeText(inputs[3], '8');

      expect(mockOnChangeCode).toHaveBeenCalledWith('5678');
      expect(mockOnComplete).toHaveBeenCalledWith('5678');
    });
  });
});