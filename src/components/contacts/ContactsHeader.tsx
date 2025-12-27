import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  title: string;
  onPressMore: () => void;
};

function ContactsHeader(props: Readonly<Props>): React.ReactElement {
  return (
    <View className="px-4 pt-2 pb-3">
      <View className="flex-row items-center justify-between">
        {/* Logo app */}
        <View className="w-10 items-start">
          <Image source={require("@/assets/logo.png")} className="size-10 rounded-full" />
        </View>

        <View className="flex-1 items-center">
          <Text className="text-[18px] font-semibold text-neutral-900">{props.title}</Text>
        </View>

        <Pressable className="w-10 items-end" onPress={props.onPressMore} hitSlop={10}>
          <MaterialIcons name="more-vert" size={22} color="#111827" />
        </Pressable>
      </View>
    </View>
  );
}

export default ContactsHeader;
