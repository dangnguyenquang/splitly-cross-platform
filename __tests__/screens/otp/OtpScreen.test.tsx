// __tests__/screens/otp/OtpScreen.test.tsx

// --- Disable console.log in tests ---
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterAll(() => {
  (console.log as jest.Mock).mockRestore();
});

// --- Mocks ---
jest.mock('@/src/api/auth.api', () => ({
  verifyOTP: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/src/components/auth/OtpInput', () => {
  const { TextInput } = require('react-native');
  return function OtpInputs({ value, onChangeCode }: any) {
    return <TextInput testID="otp-inputs" value={value} onChangeText={onChangeCode} />;
  };
});

jest.mock('@/src/components/CustomButton', () => {
  const { Pressable, Text } = require('react-native');
  return function CustomButton({ title, onPress, testID }: any) {
    return (
      <Pressable testID={testID} onPress={onPress}>
        <Text>{title}</Text>
      </Pressable>
    );
  };
});

jest.mock('@/src/components/auth/CountDown', () => ({
  Countdown: ({ seconds, onComplete }: any) => {
    const { Text } = require('react-native');
    const React = require('react');
    React.useEffect(() => {
      const timer = setTimeout(onComplete, seconds * 1000);
      return () => clearTimeout(timer);
    }, [seconds, onComplete]);
    return <Text testID="countdown">{seconds}s</Text>;
  },
}));

// --- Imports ---
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import OTPScreen from '@/src/screens/auth/OTPScreen';
import { verifyOTP } from '@/src/api/auth.api';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.useFakeTimers();

// --- Helper: setup mocks ---
const setupNavigationMocks = () => {
  const mockNav = { navigate: jest.fn(), goBack: jest.fn(), reset: jest.fn() };
  const mockRt = { params: { email: 'test@example.com' } };
  (useNavigation as jest.Mock).mockReturnValue(mockNav);
  (useRoute as jest.Mock).mockReturnValue(mockRt);
  return { mockNav, mockRt };
};

// --- Unit Tests ---
describe('OTPScreen - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupNavigationMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('renders main UI elements', () => {
    const { getByText } = render(<OTPScreen />);
    expect(getByText('OTP code verification')).toBeTruthy();
    expect(getByText(/didn.?t receive email\?/i)).toBeTruthy(); // regex avoids apostrophe issues
    expect(getByText('Verify')).toBeTruthy();
  });

  it('displays email from route params', () => {
    const { getByText } = render(<OTPScreen />);
    expect(getByText(/test@example\.com/i)).toBeTruthy();
  });

  it('updates OTP input correctly', () => {
    const { getByTestId } = render(<OTPScreen />);
    const input = getByTestId('otp-inputs');

    act(() => fireEvent.changeText(input, '123456'));
    expect(input.props.value).toBe('123456');
  });

  it('does NOT call API with incomplete OTP', async () => {
    const { getByText, getByTestId } = render(<OTPScreen />);
    const input = getByTestId('otp-inputs');
    act(() => fireEvent.changeText(input, '123'));

    await act(async () => fireEvent.press(getByText('Verify')));
    expect(verifyOTP).not.toHaveBeenCalled();
  });

  it('calls API with complete OTP', async () => {
    (verifyOTP as jest.Mock).mockResolvedValue(undefined);
    const { getByText, getByTestId } = render(<OTPScreen />);
    const input = getByTestId('otp-inputs');
    act(() => fireEvent.changeText(input, '123456'));

    await act(async () => fireEvent.press(getByText('Verify')));

    await waitFor(() => {
      expect(verifyOTP).toHaveBeenCalledWith(
        '123456',
        'test@example.com',
        expect.any(Object)
      );
    });
  });
});

// --- Integration Tests ---
describe('OTPScreen - Integration Tests', () => {
  let mockNav: any;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ mockNav } = setupNavigationMocks());
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('completes full verification flow', async () => {
    (verifyOTP as jest.Mock).mockResolvedValue(undefined);
    const { getByText, getByTestId } = render(<OTPScreen />);
    const input = getByTestId('otp-inputs');

    act(() => fireEvent.changeText(input, '123456'));
    await act(async () => fireEvent.press(getByText('Verify')));

    await waitFor(() => {
      expect(verifyOTP).toHaveBeenCalledWith(
        '123456',
        'test@example.com',
        expect.any(Object)
      );
    });
  });

  it('handles resend countdown and button correctly', async () => {
    const { getByText, queryByText } = render(<OTPScreen />);
    await act(async () => jest.advanceTimersByTime(30000));

    await waitFor(() => expect(getByText('Resend')).toBeTruthy());

    await act(async () => fireEvent.press(getByText('Resend')));
    await waitFor(() => {
      expect(queryByText('Resend')).toBeNull();
      expect(getByText(/You can resend code in/)).toBeTruthy();
    });
  });

  it('preserves OTP value after resend', async () => {
    const { getByText, getByTestId } = render(<OTPScreen />);
    const input = getByTestId('otp-inputs');
    act(() => fireEvent.changeText(input, '654321'));

    await act(async () => jest.advanceTimersByTime(30000));
    await act(async () => fireEvent.press(getByText('Resend')));

    expect(input.props.value).toBe('654321');
  });
});
