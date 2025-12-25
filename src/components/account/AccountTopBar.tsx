import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  title: string;
  left?: React.ReactNode;   // logo
  right?: React.ReactNode;  // spacer / action
};

export default function AccountTopBar({ title, left, right }: Readonly<Props>) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-2 pb-3 bg-white">
      <View className="w-9 h-9 items-center justify-center">{left}</View>
      <Text className="text-2xl font-semibold text-black">{title}</Text>
      <View className="w-9 h-9 items-center justify-center">{right}</View>
    </View>
  );
}
