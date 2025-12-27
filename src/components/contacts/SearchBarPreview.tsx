import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  onPress: () => void;
};

function SearchBarPreview(props: Readonly<Props>): React.ReactElement {
  return (
    <Pressable
      onPress={props.onPress}
      className="flex-row items-center rounded-xl bg-neutral-100 px-3 py-3"
    >
      <MaterialIcons name="search" size={20} color="#6B7280" />
      <Text className="ml-2 text-[15px] text-neutral-400">Search contact</Text>

      {/* TODO: integrate API search later (debounce + server-side search) */}
    </Pressable>
  );
}

export default SearchBarPreview;
