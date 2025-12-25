import { colors } from '@/src/constant/theme';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  title: string;
  desc: string;
  onPress?: () => void;
};

export default function UpgradeCard({ title, desc, onPress }: Readonly<Props>) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-4 bg-primary-10 rounded-2xl px-4 py-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <MaterialIcons name="star" size={20} color={colors.primary} />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-lg font-semibold text-black" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-xs text-black/70 mt-0.5" numberOfLines={1}>
            {desc}
          </Text>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={22} color="#111" />
    </Pressable>
  );
}
