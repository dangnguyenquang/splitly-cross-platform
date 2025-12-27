import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { addContactUser } from '@/src/api/connection.api';
import CustomButton from '@/src/components/CustomButton';
import SuccessModal from '@/src/components/modal/success';
import { RootState } from '@/src/store/store';
import type { Contact, RootStackParamList } from '@/src/types';
import axios from 'axios';
import { useSelector } from 'react-redux';

type ScreenNav = NativeStackNavigationProp<RootStackParamList, 'ContactDetail'>;
type ScreenRoute = RouteProp<RootStackParamList, 'ContactDetail'>;

function SearchContactScreen(): React.ReactElement {
  const navigation = useNavigation<ScreenNav>();
  const route = useRoute<ScreenRoute>();

  const contact: Contact = route.params.contact;

  const [isSucess, setIsSucess] = useState<boolean>(false);
  const token = useSelector((s: RootState) => s.auth?.login.currentUser?.token);
  const initials = useMemo(() => {
    const parts = (contact.name || '').trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? '';
    const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    const s = (a + b).toUpperCase();
    return s || '?';
  }, [contact.name]);

  function handleBack(): void {
    navigation.goBack();
  }
  console.log(contact);
  const handleAddContact = async () => {
    try {
      const res = await addContactUser(token!, contact.id);
      console.log('res', res);
      if (res.status === 201) {
        setIsSucess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 ">
        {/* Header */}
        <View className="px-4 pt-2 pb-3">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack} hitSlop={10} className="w-10">
              <MaterialIcons name="arrow-back" size={22} color="#111827" />
            </Pressable>

            <View className="flex-1 items-center">
              <Text className="text-2xl font-semibold text-neutral-900">
                Contact
              </Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View className="flex-1 px-6">
          {/* Centered content */}
          <View className="flex-1 items-center justify-center">
            {/* Avatar */}
            {contact.avatar ? (
              <Image source={{ uri: contact.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text className="text-[18px] font-semibold text-neutral-700">
                  {initials}
                </Text>
              </View>
            )}

            {/* Name + email */}
            <Text className="mt-5 text-[18px] font-semibold text-neutral-900">
              {contact.name}
            </Text>

            {!!contact.email && (
              <Text className="mt-1 text-[13px] text-neutral-600">
                {contact.email}
              </Text>
            )}

            <Text className="mt-3 text-[12px] text-neutral-400">
              Splitify Account
            </Text>

            {/* Divider */}
            <View className="mt-6 w-full h-[1px] bg-neutral-200" />

            {/* Delete button */}
            <View className="mt-6">
              <Text className="text-slate-400 text-base">
                This account is not in your contacts yet.
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomBar}>
          <View className="flex-row px-6 pb-6">
            <View className="flex-1 mr-3">
              <CustomButton
                title="Cancel"
                onPress={handleBack}
                type="secondary"
                width="100%"
                height={50}
                borderRadius={999}
                style={{ marginVertical: 0 }}
              />
            </View>

            <View className="flex-1 ml-3">
              <CustomButton
                title="Add My Contact"
                onPress={handleAddContact}
                type="primary"
                width="100%"
                height={50}
                borderRadius={999}
                style={{ marginVertical: 0 }}
              />
            </View>
          </View>
        </View>
      </View>
      {isSucess && (
        <SuccessModal
          visible={isSucess}
          message="Saved to contacts"
          onClose={() => {
            setIsSucess(false);
            navigation.navigate('MainApp', { screen: 'Contact' });
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#E5E7EB',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Keep bottom buttons pinned like screenshot
  bottomBar: {
    borderTopWidth: 0,
  },

  // Override for delete: red border + text
  deleteBtnOverride: {
    marginVertical: 0,
    borderColor: '#EF4444',
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  deleteTextOverride: {
    color: '#EF4444',
    fontWeight: '700',
  },
});

export default SearchContactScreen;
