import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import InputAuth from '@/src/components/auth/CustomInputAuth';
import AvoidKeyboard from '@/src/components/AvoidKeyboard';
import CustomButton from '@/src/components/CustomButton';

import { findUserByEmail } from '@/src/api/connection.api';
import LoadingSpin from '@/src/components/LoadingSpin';
import { RootState } from '@/src/store/store';
import type { Contact, Navigation } from '@/src/types';
import axios from 'axios';
import { useSelector } from 'react-redux';

function AddNewContactScreen(): React.ReactElement {
  const navigation = useNavigation<Navigation>();

  const [fullName, setFullName] = useState('Brooklyn Simmons');
  const [email, setEmail] = useState('piviba5959@gamintor.com');
  const [error, setError] = useState<string>('');
  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );
  const [loading, setLoading] = useState(false);
  function handleBack(): void {
    navigation.goBack();
  }

  function handleCancel(): void {
    navigation.goBack();
  }

  const handleSearchContact = async () => {
    const name = fullName.trim();
    const mail = email.trim();

    if (!name || !mail) {
      Alert.alert('Validation', 'Please enter name and email');
      return;
    }
    let item: Contact;

    try {
      setLoading(true);
      const res = await findUserByEmail(token!, email);
      console.log('res', res);
      if (res.data.length > 0) {
        item = {
          id: res.data[0].userId,
          name: res.data[0].fullName,
          email: res.data[0].email,
          avatar: res.data[0].userImage,
          isFavorite: false,
        };
        navigation.navigate('SearchContact', { contact: item });
      } else {
        setTimeout(() => {
          setLoading(false);
          setError('User not found');
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoading(false);
        setError(error.message);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AvoidKeyboard>
        <View className="flex-1">
          {/* Header */}
          <View className="px-4 pt-2 pb-3">
            <View className="flex-row items-center">
              <Pressable onPress={handleBack} hitSlop={10} className="w-10">
                <MaterialIcons name="arrow-back" size={22} color="#111827" />
              </Pressable>

              <View className="flex-1 items-center">
                <Text className="text-[18px] font-semibold text-neutral-900">
                  Add New Contact
                </Text>
              </View>

              {/* Spacer to keep title centered */}
              <View className="w-10" />
            </View>
          </View>

          {/* Form */}
          <View className="px-6 pt-2">
            <InputAuth
              label="Account Holder Name"
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <View className="mt-3">
              <InputAuth
                label="Email"
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                error={error}
                icon={<MaterialIcons name="email" size={20} color="#111827" />}
              />
              {Boolean(error) && <Text className="text-red-500">{error}</Text>}
            </View>
          </View>

          {/* Bottom buttons pinned */}
          <View style={styles.bottomBar}>
            <View className="flex-row px-6 pb-6">
              <View className="flex-1 mr-3">
                <CustomButton
                  title="Cancel"
                  onPress={handleCancel}
                  type="secondary"
                  width="100%"
                  height={50}
                  borderRadius={999}
                  style={{ marginVertical: 0 }}
                />
              </View>

              <View className="flex-1 ml-3">
                <CustomButton
                  title="Search Contact"
                  onPress={handleSearchContact}
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
        {loading && <LoadingSpin />}
      </AvoidKeyboard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    marginTop: 'auto',
  },
});

export default AddNewContactScreen;
