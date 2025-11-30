import { View, Text } from 'react-native';
import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { FieldErrors } from 'react-hook-form';
import { LoginForm } from '@/src/screens/auth/SignInScreen';
interface ErrorToastifyIProps {
  errors: FieldErrors<LoginForm>;
}
export default function ErrorToastify({
  errors,
}: Readonly<ErrorToastifyIProps>) {
  return (
    <View className="pb-4">
      {errors.root?.message && (
        <View className="flex-row justify-between items-center bg-red-200 py-2 px-3 rounded-lg">
          <View className="flex-row items-center gap-2">
            <Ionicons name="information-circle-outline" size={24} color="red" />
            <Text className="text-slate-900">{errors.root.message}</Text>
          </View>
          <Text>x</Text>
        </View>
      )}
    </View>
  );
}
