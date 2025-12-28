import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
export type AccountMenuKey =
  | 'personal'
  | 'noti'
  | 'security'
  | 'payment'
  | 'billing'
  | 'linked'
  | 'appearance'
  | 'data'
  | 'help';

export type MenuItem = {
  key: AccountMenuKey;
  title: string;
  icon: string; // MaterialIcons name
};

export const ACCOUNT_MENU: MenuItem[] = [
  { key: 'personal', title: 'Personal Info', icon: 'person-outline' },
  { key: 'noti', title: 'Notification', icon: 'notifications-none' },
  { key: 'security', title: 'Account & Security', icon: 'lock-outline' },
  { key: 'payment', title: 'Payment Methods', icon: 'credit-card' },
  { key: 'billing', title: 'Billing & Subscriptions', icon: 'receipt-long' },
  { key: 'linked', title: 'Linked Accounts', icon: 'link' },
  { key: 'appearance', title: 'App Appearance', icon: 'palette' },
  { key: 'data', title: 'Data & Analytics', icon: 'insights' },
  { key: 'help', title: 'Help & Support', icon: 'help-outline' },
];

type Props = {
  items: MenuItem[];
  onSelect: (key: MenuItem['key']) => void;
};

export default function MenuList({ items, onSelect }: Readonly<Props>) {
  return (
    <View className="mt-4 bg-white rounded-2xl overflow-hidden">
      {items.map((it, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <View key={it.key}>
            <Pressable
              onPress={() => onSelect(it.key)}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <View className="flex-row items-center">
                <MaterialIcons name={it.icon as any} size={20} color="#111" />
                <Text className="ml-3 text-[14px] text-black">{it.title}</Text>
              </View>

              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </Pressable>

            {!isLast && <View className="h-[1px] bg-gray-100" />}
          </View>
        );
      })}
    </View>
  );
}
