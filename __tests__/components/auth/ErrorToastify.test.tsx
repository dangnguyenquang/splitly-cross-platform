import React from 'react';
import { render } from '@testing-library/react-native';
import ErrorToastify from '@/src/components/auth/ErrorToastify';
import { FieldErrors, FieldError } from 'react-hook-form';
import { LoginForm } from '@/src/screens/auth/SignInScreen';

// Mock icon
// jest.mock('@react-native-vector-icons/ionicons', () => 'Icon');

describe('ErrorToastify', () => {
  it('renders error message when errors.root.message exists', () => {
    const errors: FieldErrors<LoginForm> = {
      root: { type: 'manual', message: 'This is an error' } as Partial<FieldError>,
    };

    const { getByText } = render(<ErrorToastify errors={errors} />);

    expect(getByText('This is an error')).toBeTruthy();
    expect(getByText('x')).toBeTruthy();
  });

  it('does not render error message when errors.root.message is undefined', () => {
    const errors: FieldErrors<LoginForm> = {
      root: {} as Partial<FieldError>,
    };

    const { queryByText } = render(<ErrorToastify errors={errors} />);
    expect(queryByText('x')).toBeNull();
  });
});
