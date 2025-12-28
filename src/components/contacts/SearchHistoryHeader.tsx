import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  onClear: () => void;
  disabled?: boolean;
};

function SearchHistoryHeader(props: Readonly<Props>): React.ReactElement {
  return (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
      <Text className="text-[13px] font-semibold text-neutral-700">
        Recent searches
      </Text>

      <Pressable
        onPress={props.onClear}
        disabled={!!props.disabled}
        hitSlop={10}
        style={{ opacity: props.disabled ? 0.35 : 1 }}
      >
        <MaterialIcons name="close" size={18} color="#6B7280" />
      </Pressable>
    </View>
  );
}

export default SearchHistoryHeader;
