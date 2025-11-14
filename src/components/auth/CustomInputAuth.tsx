import React, { Dispatch, SetStateAction, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

interface InputAuthProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  secure?: boolean;
  label: string;
  hiddenIcon?: boolean;
  onChangeText: Dispatch<SetStateAction<string>>;
}
export default function InputAuth({
  icon,
  placeholder,
  value,
  label,
  hiddenIcon,
  onChangeText,
}: Readonly<InputAuthProps>) {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [secure, setSecure] = useState<boolean>(!!hiddenIcon);

  return (
    <View style={styles.container}>
      <Text className="">{label}</Text>
      <TextInput
        style={styles.textAuth}
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
            size={32}
          />
        </Pressable>
      )}
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
    marginBottom: 10,
  },
  iconWrap: {
    position: 'absolute',
    transform: [{ translateY: 40 }],
    left: 10,
  },
  iconHiddenWrap: {
    position: 'absolute',
    transform: [{ translateY: 40 }],
    right: 10,
  },
});
