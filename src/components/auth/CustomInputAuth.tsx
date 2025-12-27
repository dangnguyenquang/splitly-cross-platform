import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface InputAuthProps {
  icon?: React.ReactNode;
  placeholder: string;
  value: string;
  secure?: boolean;
  label: string;
  hiddenIcon?: boolean;
  onChangeText: Dispatch<SetStateAction<string>>;
  error?: string
}
export default function InputAuth({
  icon,
  placeholder,
  value,
  label,
  hiddenIcon,
  error,
  onChangeText,
}: Readonly<InputAuthProps>) {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [secure, setSecure] = useState<boolean>(!!hiddenIcon);
  // calculate padding when has icon
  const inputPadding = useMemo(() => {
    const left = icon ? 46 : 12;
    const right = hiddenIcon ? 46 : 12;
    return { paddingLeft: left, paddingRight: right };
  }, [icon, hiddenIcon]);
  return (
    <View style={styles.container}>
      <Text className="">{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={[styles.textAuth, inputPadding, Boolean(error) && { borderColor: 'red' }]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
        />
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        {hiddenIcon && (
          <Pressable
            style={styles.iconHiddenWrap}
            onPress={() => {
              setIsHidden(prev => !prev);
              setSecure?.(prev => !prev);
            }}
            hitSlop={8}
          >
            <MaterialDesignIcons
              name={isHidden ? 'eye-outline' : 'eye-off-outline'}
              size={24}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textAuth: {
    height: 50,
    margin: 12,
    marginHorizontal: 0,
    borderWidth: 1,
    paddingLeft: 50,
    paddingRight: 10,
    borderRadius: 10,
    position: 'relative',
  },
  container: {
    marginTop: 6,
  },
  iconWrap: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  iconHiddenWrap: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  inputWrap: {
    position: 'relative',
    marginTop: -6,
  },
});
