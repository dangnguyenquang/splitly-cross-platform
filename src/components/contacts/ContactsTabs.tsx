import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props<T extends string> = {
  tabs: T[];
  activeTab: T;
  onChangeTab: (t: T) => void;
};

function ContactsTabs<T extends string>(props: Props<T>): React.ReactElement {
  return (
    <View className="mt-3 flex-row rounded-xl bg-neutral-100 p-1">
      {props.tabs.map(tab => {
        const active = tab === props.activeTab;

        return (
          <Pressable
            key={tab}
            onPress={() => props.onChangeTab(tab)}
            className={[
              'flex-1 items-center justify-center rounded-lg py-2',
              active ? 'bg-amber-400' : 'bg-transparent',
            ].join(' ')}
          >
            <Text
              className={[
                'text-[13px]',
                active ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700',
              ].join(' ')}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default ContactsTabs;