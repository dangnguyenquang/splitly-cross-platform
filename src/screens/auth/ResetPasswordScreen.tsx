import React, { useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';

import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { colors } from '@/src/constant/theme';
import InputAuth from '@/src/components/auth/CustomInputAuth';
import CustomButton from '@/src/components/CustomButton';
import ErrorToastify from '@/src/components/auth/ErrorToastify';
import { RootStackParamList } from '@/src/types';
import { resendOTP } from '@/src/api/auth.api';

type ResetPassForm = { email: string };

export default function ResetPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
  

  // Ẩn back button / header
  useLayoutEffect(() => {
    navigation.setOptions?.({
      headerShown: false,
      headerBackVisible: false,
      headerLeft: () => null,
    } as any);
  }, [navigation]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPassForm>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ResetPassForm) => {
    try {
      await resendOTP(data.email);
      navigation.navigate('OTP', { email: data.email, type: 'reset' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const msg =
          (err.response?.data)?.message ??
          (status === 404
            ? 'Email not found.'
            : 'Failed to send OTP. Please try again.');
        setError('root', { type: 'server', message: msg });
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      setError('root', { type: 'server', message: msg });
    }
  };

  return (
    <SafeAreaView>
      <View className="w-screen h-full px-10">
        {/* Title */}
        <View className="flex-row items-center mt-10">
          <Text className="text-3xl font-semibold">Reset your password </Text>
          <FontAwesome6
            name="key"
            size={22}
            iconStyle="solid"
            color={colors.primary}
          />
        </View>

        {/* Description */}
        <Text className="text-base text-gray-500 mt-4">
          Please enter your email and we will send an OTP code in the next step
          to reset your password.
        </Text>

        {/* Errors */}
        <View className="mt-6">
          <ErrorToastify errors={errors} />
        </View>

        {/* Email label + input */}
        <View className="mt-6">
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              maxLength: { value: 100, message: 'Maximum 100 letters' },
            }}
            render={({ field: { onChange, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="email-outline" size={32} />}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                label="Email"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-600">{errors.email.message}</Text>
          )}
        </View>

        {/* Continue button bottom */}
        <View className="w-screen flex-1 justify-end pb-6">
          <CustomButton title="Continue" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </SafeAreaView>
  );
}
