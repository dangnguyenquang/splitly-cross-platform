import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  fullName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  onPress: () => void;
  onPressQR: () => void;
};

export default function UserInfoRow({
  fullName,
  email,
  avatarUrl,
  onPress,
  onPressQR,
}: Readonly<Props>) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center bg-white rounded-2xl px-3 py-3">
      <Image
        source={{
          uri: avatarUrl || 'https://ui-avatars.com/api/?background=EEE&color=111&name=User',
        }}
        className="w-12 h-12 rounded-full"
      />

      <View className="flex-1 ml-3">
        <Text className="text-[15px] font-semibold text-black" numberOfLines={1}>
          {fullName ?? 'User'}
        </Text>
        <Text className="text-[12px] text-gray-500 mt-0.5" numberOfLines={1}>
          {email ?? 'user@email.com'}
        </Text>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation(); // bấm QR không trigger onPress row
          onPressQR();
        }}
        hitSlop={10}
        className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
      >
        <MaterialIcons name="qr-code-2" size={20} color="#111" />
      </Pressable>
    </Pressable>
  );
}
