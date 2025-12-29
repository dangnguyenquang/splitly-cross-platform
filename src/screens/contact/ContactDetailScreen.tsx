import MaterialIcons from '@react-native-vector-icons/material-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  acceptedUserContact,
  deleteConnectionUser,
  rejectedUserContact,
} from '@/src/api/connection.api';
import CustomButton from '@/src/components/CustomButton';
import CustomHeader from '@/src/components/header/index';
import ConfirmBottomSheet from '@/src/components/modal/confirm';
import SuccessModal from '@/src/components/modal/success';
import { RootState } from '@/src/store/store';
import type { Contact, RootStackParamList } from '@/src/types';
import axios from 'axios';
import { useSelector } from 'react-redux';

type ScreenNav = NativeStackNavigationProp<RootStackParamList, 'ContactDetail'>;
type ScreenRoute = RouteProp<RootStackParamList, 'ContactDetail'>;
type SuccessAction =
  | 'DELETE_CONTACT'
  | 'SEND_REQUEST'
  | 'SEND_PAYMENT'
  | 'ACCEPT_REQUEST'
  | 'DECLINE_REQUEST'
  | 'ACCEPT_PAYMENT'
  | 'DECLINE_PAYMENT';

const SUCCESS_MESSAGES: Record<SuccessAction, string> = {
  DELETE_CONTACT: 'Contact deleted successfully',
  SEND_REQUEST: 'Request sent successfully',
  SEND_PAYMENT: 'Payment request sent successfully',

  ACCEPT_REQUEST: 'Request accepted',
  DECLINE_REQUEST: 'Request declined',

  ACCEPT_PAYMENT: 'Payment accepted',
  DECLINE_PAYMENT: 'Payment declined',
};

function ContactDetailScreen(): React.ReactElement {
  const navigation = useNavigation<ScreenNav>();
  const route = useRoute<ScreenRoute>();

  const contact: Contact = route.params.contact;

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isSucess, setIsSucess] = useState<boolean>(false);
  const [successAction, setSuccessAction] =
    useState<SuccessAction>('ACCEPT_PAYMENT');

  const initials = useMemo(() => {
    const parts = (contact.name || '').trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? '';
    const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    const s = (a + b).toUpperCase();
    return s || '?';
  }, [contact.name]);
  const token = useSelector((s: RootState) => s.auth?.login.currentUser?.token);

  const handleDelete = () => {
    setIsDelete(true);
  };

  const handleRequestOrReject = async () => {
    try {
      if (!contact.accepted) {
        const res = await rejectedUserContact(contact.id);
        if (res.userId) {
          setIsSucess(true);
          setSuccessAction('DECLINE_REQUEST');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Err: ', error);
      }
    }
  };

  const handlePayOrAccept = async () => {
    try {
      if (!contact.accepted) {
        const res = await acceptedUserContact(contact.id);
        if (res.userId) {
          setIsSucess(true);
          setSuccessAction('ACCEPT_REQUEST');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Err: ', error);
      }
    }
  };

  const handleDeleteContact = async () => {
    try {
      const res = await deleteConnectionUser(token!, contact.id);
      console.log('res', res);
      if (res.status === 200) {
        setIsDelete(false);
        setSuccessAction('DELETE_CONTACT');
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
        <CustomHeader
          title="Contact"
          onLeftPress={() => navigation.goBack()}
          titleColor="#050404ff"
          shadow={true}
          leftIcon={{
            type: 'icon',
            component: MaterialIcons,
            name: 'arrow-back',
            size: 28,
            color: '#111827',
          }}
        />

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
            {contact.accepted && (
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
            )}
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomBar}>
          <View className="flex-row px-6 pb-6">
            <View className="flex-1 mr-3">
              <CustomButton
                title={contact.accepted ? 'Request' : 'Decline'}
                onPress={handleRequestOrReject}
                type="secondary"
                width="100%"
                height={50}
                borderRadius={999}
                style={{ marginVertical: 0 }}
              />
            </View>

            <View className="flex-1 ml-3">
              <CustomButton
                title={contact.accepted ? 'Pay' : 'Accept'}
                onPress={handlePayOrAccept}
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
          message={SUCCESS_MESSAGES[successAction]}
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
