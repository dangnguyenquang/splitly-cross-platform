import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Countdown } from '@/src/components/auth/CountDown';


jest.useFakeTimers(); // Dùng fake timers để test setTimeout

describe('Countdown', () => {
  it('renders initial seconds correctly', () => {
    const { getByText } = render(<Countdown seconds={5} />);
    expect(getByText('5s')).toBeTruthy();
  });

  it('counts down every second', () => {
    const { getByText } = render(<Countdown seconds={3} />);

    expect(getByText('3s')).toBeTruthy();

    // Move time forward 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByText('2s')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByText('1s')).toBeTruthy();
  });

  it('calls onComplete when countdown ends', () => {
    const onComplete = jest.fn();
    render(<Countdown seconds={2} onComplete={onComplete} />);

    // Advance all timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does not go below 0', () => {
    const { getByText } = render(<Countdown seconds={1} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(getByText('0s')).toBeTruthy();
  });
});
