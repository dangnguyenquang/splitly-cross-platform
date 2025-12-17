// components/auth/count-down.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {Text} from 'react-native';

function msUntil(deadline: number) {
  return Math.max(0, deadline - Date.now());
}

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const Countdown = React.memo(function Countdown({
  seconds,
  onComplete,
}: { seconds: number; onComplete?: () => void }) {
  const deadline = useMemo(() => Date.now() + seconds * 1000, [seconds]);
  const [secLeft, setSecLeft] = useState(
    () => Math.ceil(msUntil(deadline) / 1000)
  );

  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      const leftMs = msUntil(deadline);
      const next = Math.ceil(leftMs / 1000);
      setSecLeft(prev => (prev !== next ? next : prev));
      if (leftMs <= 0) {
        onComplete?.();
        return;
      }
      const delay = leftMs % 1000 || 1000;
      id = setTimeout(tick, delay);
    };

    id = setTimeout(tick, msUntil(deadline) % 1000 || 1000);
    return () => { if (id) { clearTimeout(id); id = null; } };
  }, [deadline, onComplete]);

  return <Text className='text-primary-10'>{formatMMSS(secLeft)}</Text>;
});
