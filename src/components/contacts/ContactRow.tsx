import type { Contact } from '@/src/types';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useMemo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type Props = {
  contact: Contact;
  onPress?: () => void;
  variant?: 'default' | 'search';
  showAcceptAction?: boolean; 
  onAccept?: () => void;
};

function ContactRow(props: Readonly<Props>): React.ReactElement {
  const c = props.contact;

  const initials = useMemo(() => {
    const parts = (c.name || '').trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? '';
    const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    const s = (a + b).toUpperCase();
    return s || '?';
  }, [c.name]);

  return (
    <Pressable
      onPress={props.onPress}
      className="flex-row items-center px-4 py-3 pr-10"
    >
      {c.avatar ? (
        <Image
          source={{ uri: c.avatar }}
          className="h-11 w-11 rounded-full bg-neutral-200"
        />
      ) : (
        <View className="h-11 w-11 items-center justify-center rounded-full bg-neutral-200">
          <Text className="text-[14px] font-semibold text-neutral-700">
            {initials}
          </Text>
        </View>
      )}

      <View className="ml-3 flex-1">
        <Text className="text-[15px] font-semibold text-neutral-900">
          {c.name}
        </Text>
        {!!c.email && (
          <Text className="mt-0.5 text-[12px] text-neutral-500">{c.email}</Text>
        )}
      </View>

      {props.variant === 'search' ? (
        <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
      ) : props.showAcceptAction ? (
        <Pressable
          onPress={(e: any) => {
            e?.stopPropagation?.();
            props.onAccept?.();
          }}
          hitSlop={10}
          className="p-1"
        >
          <MaterialIcons
            name='check-circle'
            size={22}
            color='#10B981'
          />
        </Pressable>
      ): null}
    </Pressable>
  );
}

export default ContactRow;
