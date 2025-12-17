import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, TextInput, View, StyleSheet, Platform } from "react-native";

type OtpInputProps = {
  length?: number;
  value?: string;
  defaultValue?: string;
  onComplete?: (code: string) => void;
  onChangeCode?: (code: string) => void;
  autoFocus?: boolean;

  errorMessage?: string; // ✅ thêm
};

const onlyDigits = (s: string) => (s ?? "").replace(/\D/g, "");

export default function OtpInputs({
  length = 6,
  value,
  defaultValue = "",
  onComplete,
  onChangeCode,
  autoFocus = true,
  errorMessage,
}: Readonly<OtpInputProps>) {
  const isControlled = value !== undefined;

  const [inner, setInner] = useState<string>(
    onlyDigits(defaultValue).slice(0, length)
  );

  const code = isControlled ? onlyDigits(value!).slice(0, length) : inner;

  const digits = useMemo(
    () => Array.from({ length }, (_, i) => code[i] ?? ""),
    [code, length]
  );

  const inputRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);

  const setCode = (next: string) => {
    const clipped = onlyDigits(next).slice(0, length);
    if (!isControlled) setInner(clipped);
    onChangeCode?.(clipped);

    if (clipped.length === length) onComplete?.(clipped);
  };

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const activeIndex = Math.min(code.length, length - 1);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {digits.map((d, i) => (
          <View
            key={i}
            style={[
              styles.box,
              focused && i === activeIndex ? styles.boxFocused : null,
              errorMessage ? styles.boxError : null,
            ]}
          >
            <Text style={styles.digit}>{d}</Text>
          </View>
        ))}
      </View>

      {/* ✅ Input thật: nhận typing / backspace / paste / autofill */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={setCode}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
        maxLength={length}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        importantForAutofill="yes"
        style={styles.overlayInput}
      />

      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const BOX_W = 48;
const BOX_H = 64;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 20,
  },
  box: {
    width: BOX_W,
    height: BOX_H,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  digit: {
    fontSize: 22,
    fontWeight: "600",
  },
  boxFocused: {
    borderColor: "#333",
  },
  boxError: {
    borderColor: "#DC2626",
  },
  errorText: {
    marginTop: 6,
    color: "#DC2626",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },

  // ✅ overlay phủ lên dãy ô => tap/long-press để paste, OS autofill cũng ổn
  overlayInput: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
  },
});
