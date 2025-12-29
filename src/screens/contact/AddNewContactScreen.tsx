import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InputAuth from '@/src/components/auth/CustomInputAuth';
import AvoidKeyboard from '@/src/components/AvoidKeyboard';
import CustomButton from '@/src/components/CustomButton';

import { findUserByEmail } from '@/src/api/connection.api';
import CustomHeader from '@/src/components/header/index';
import LoadingSpin from '@/src/components/LoadingSpin';
import { RootState } from '@/src/store/store';
import type { Contact, Navigation } from '@/src/types';
import axios from 'axios';
import { useSelector } from 'react-redux';

function AddNewContactScreen(): React.ReactElement {
  const navigation = useNavigation<Navigation>();

  const [email, setEmail] = useState('');
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
    let item: Contact;

    try {
      setLoading(true);
      const res = await findUserByEmail(token!, email);
      console.log('res', res);
      if (res.data) {
        item = {
          id: res.data.userId,
          name: res.data.fullName,
          email: res.data.email,
          avatar: res.data.userImage,
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
        setError(error.response?.data.message);
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
          <CustomHeader
            title="Add New Contact"
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

          {/* Form */}
          <View className="px-6 pt-2">
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
