import MaterialIcons from '@react-native-vector-icons/material-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deleteConnectionUser } from '@/src/api/connection.api';
import CustomButton from '@/src/components/CustomButton';
import ConfirmBottomSheet from '@/src/components/modal/confirm';
import SuccessModal from '@/src/components/modal/success';
import { RootState } from '@/src/store/store';
import type { Contact, RootStackParamList } from '@/src/types';
import axios from 'axios';
import { useSelector } from 'react-redux';

type ScreenNav = NativeStackNavigationProp<RootStackParamList, 'ContactDetail'>;
type ScreenRoute = RouteProp<RootStackParamList, 'ContactDetail'>;

function ContactDetailScreen(): React.ReactElement {
  const navigation = useNavigation<ScreenNav>();
  const route = useRoute<ScreenRoute>();

  const contact: Contact = route.params.contact;

  const [isFavorite, setIsFavorite] = useState<boolean>(!!contact.isFavorite);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isSucess, setIsSucess] = useState<boolean>(false);

  const initials = useMemo(() => {
    const parts = (contact.name || '').trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? '';
    const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    const s = (a + b).toUpperCase();
    return s || '?';
  }, [contact.name]);
  const token = useSelector((s: RootState) => s.auth?.login.currentUser?.token);
  function handleBack(): void {
    navigation.goBack();
  }

  function handleToggleStar(): void {
    setIsFavorite(prev => !prev);
    // TODO: call API update favorite later if you want
  }

  const handleDelete = () => {
    // TODO: open ConfirmBottomSheet
    // Alert.alert('Delete', 'TODO: confirm delete');
    setIsDelete(true);
  };

  const handleRequest = () => {
    // TODO: navigate/request flow
  };

  const handlePay = () => {
    // TODO: navigate/pay flow
  };

  const handleDeleteContact = async () => {
    try {
      const res = await deleteConnectionUser(token!, contact.id);
      console.log('res', res);
      if (res.status === 200) {
        setIsDelete(false);
        setIsSucess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
      }
      console.log(error);
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

            <Pressable
              onPress={handleToggleStar}
              hitSlop={10}
              className="w-10 items-end"
            >
              <MaterialIcons
                name={isFavorite ? 'star' : 'star-border'}
                size={22}
                color={isFavorite ? '#F59E0B' : '#9CA3AF'}
              />
            </Pressable>
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
              Splitly Account
            </Text>

            {/* Divider */}
            <View className="mt-6 w-full h-[1px] bg-neutral-200" />

            {/* Delete button */}
            <View className="mt-6">
              <CustomButton
                title="Delete Contact"
                onPress={handleDelete}
                type="secondary"
                width={180}
                height={44}
                borderRadius={999}
                style={{ marginVertical: 0 }}
                danger
                textStyle={styles.deleteTextOverride}
              />
            </View>
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomBar}>
          <View className="flex-row px-6 pb-6">
            <View className="flex-1 mr-3">
              <CustomButton
                title="Request"
                onPress={handleRequest}
                type="secondary"
                width="100%"
                height={50}
                borderRadius={999}
                style={{ marginVertical: 0 }}
              />
            </View>

            <View className="flex-1 ml-3">
              <CustomButton
                title="Pay"
                onPress={handlePay}
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
      {isDelete && (
        <ConfirmBottomSheet
          visible={isDelete}
          title="Delete Contact"
          description={`Delete ${contact.name} from your contacts?`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          danger
          onConfirm={handleDeleteContact}
          onCancel={() => setIsDelete(false)}
        />
      )}
      {isSucess && (
        <SuccessModal
          visible={isSucess}
          message="Contact deleted successfully"
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

export default ContactDetailScreen;
