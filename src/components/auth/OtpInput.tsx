import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

type OtpInputProps = {
  length?: number;
  value?: string; // <-- thêm: controlled từ parent (string)
  defaultValue?: string; // <-- thêm: giá trị khởi tạo nếu không controlled
  onComplete?: (code: string) => void;
  onChangeCode?: (code: string) => void; // gọi mỗi lần đổi
  autoFocus?: boolean;
};

const onlyDigits = (s: string) => (s ?? '').replace(/\D/g, '');

export default function OtpInputs({
  length = 4,
  value, // <-- string từ parent nếu controlled
  defaultValue = '',
  onComplete,
  onChangeCode,
  autoFocus = true,
}: Readonly<OtpInputProps>) {
  const isControlled = value !== undefined;

  // state nội bộ chỉ dùng khi không controlled
  const [inner, setInner] = useState<string>(
    onlyDigits(defaultValue).slice(0, length),
  );

  // code hiện tại (string) và mảng ký tự
  const code = isControlled ? onlyDigits(value!).slice(0, length) : inner;
  const digits = useMemo(
    () => Array.from({ length }, (_, i) => code[i] ?? ''),
    [code, length],
  );

  const inputsRef = useRef<(TextInput | null)[]>(
    Array.from({ length }, () => null),
  );

  useEffect(() => {
    inputsRef.current = Array.from(
      { length },
      (_, i) => inputsRef.current[i] ?? null,
    );
  }, [length]);

  const focusIndex = (i: number) => {
    if (i >= 0 && i < length) inputsRef.current[i]?.focus();
  };

  useEffect(() => {
    if (autoFocus) focusIndex(0);
  }, [autoFocus]);

  // cập nhật code tổng (string) -> cập nhật state (nếu uncontrolled) + notify
  const setCode = (next: string) => {
    const clipped = onlyDigits(next).slice(0, length);
    if (!isControlled) setInner(clipped);
    onChangeCode?.(clipped);

    // gọi onComplete khi đủ ký tự
    if (clipped.length === length && clipped.split('').every(c => c !== '')) {
      onComplete?.(clipped);
    }
  };

  // tạo bản digits mới với thay đổi tại vị trí i
  const setAt = (i: number, val: string, base = digits) => {
    const next = base.slice();
    next[i] = val;
    return next;
  };

  const handleChangeText = (text: string, i: number) => {
    const sanitized = onlyDigits(text);

    if (sanitized.length === 0) {
      // xóa/backspace
      if (digits[i] !== '') {
        const nextArr = setAt(i, '');
        setCode(nextArr.join(''));
        focusIndex(Math.max(i - 1, 0));
      } else {
        const prev = i - 1;
        if (prev >= 0) {
          const nextArr = setAt(prev, '');
          setCode(nextArr.join(''));
          focusIndex(prev);
        }
      }
      return;
    }

    if (sanitized.length === 1) {
      const nextArr = setAt(i, sanitized);
      setCode(nextArr.join(''));
      const nextEmpty = nextArr.findIndex((d, idx) => idx > i && d === '');
      focusIndex(nextEmpty !== -1 ? nextEmpty : Math.min(i + 1, length - 1));
      return;
    }

    // (tùy thiết bị) nếu nhận được nhiều ký tự (paste)
    let nextArr = digits.slice();
    let idx = i;
    for (const ch of sanitized) {
      if (idx >= length) break;
      nextArr = setAt(idx, ch, nextArr);
      idx++;
    }
    setCode(nextArr.join(''));
    focusIndex(Math.min(idx, length - 1));
  };

  const handleKeyPress = (e: any, i: number) => {
    if (e.nativeEvent.key === 'Backspace' && digits[i] === '') {
      const prev = i - 1;
      if (prev >= 0) {
        const nextArr = setAt(prev, '');
        setCode(nextArr.join(''));
        focusIndex(prev);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => (
          <TextInput
            key={i}
            ref={(el: TextInput | null) => {
              inputsRef.current[i] = el;
            }}
            value={digits[i]}
            onChangeText={t => handleChangeText(t, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            style={[styles.box, digits[i] ? styles.boxFilled : null]}
            keyboardType="number-pad"
            maxLength={1} // lưu ý: có thể hạn chế paste nhiều ký tự trên iOS
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            returnKeyType="next"
            selectTextOnFocus
          />
        ))}
      </View>
    </View>
  );
}

const BOX_SIZE = 64;
const styles = StyleSheet.create({
  container: { gap: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 40,
  },
  box: {
    width: BOX_SIZE/1.5,
    height: BOX_SIZE,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    backgroundColor: '#D9D9D9',
  },
  boxFilled: { borderColor: '#333' },
});
