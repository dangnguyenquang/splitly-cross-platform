import { View, Text, Pressable } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { colors } from '../../Constant/theme';
import InputAuth from '../../components/auth/custom-input-auth';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import FooterContent from '../../components/auth/custom-footer-content';
import CustomButton from '../../components/CustomButton';
import { useForm, Controller } from 'react-hook-form';
import { userLogin } from '../../api/auth.api';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { User } from '../../types';
import axios from 'axios';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export type LoginForm = {
  email: string;
  password: string;
};
export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const dispatch = useDispatch();
  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const onSubmit = async (data: LoginForm) => {
    try {
      const res: User = await userLogin(dispatch, data, navigate);
      console.log('Response: ', res.email);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 404 || err.status === 401) {
          setError('root', {
            type: 'server',
            message: 'Invalid email or password',
          });
        }
        return err;
      }
    }
  };
  return (
    <SafeAreaView>
      <View className="w-screen h-full px-10">
        <View className="flex-row gap-10 items-center mt-10">
          <Text className="text-3xl font-semibold ">Welcom back!</Text>
          <View className="">
            <FontAwesome6
              name="hand-middle-finger"
              size={32}
              iconStyle="solid"
              color={colors.primary}
            />
          </View>
        </View>
        <Text className="text-lg font-normal mt-10 mb-8">
          Please enter email and password to sign in
        </Text>
        <View className="pb-4">
          {errors.root?.message && (
            <View className="flex-row justify-between items-center bg-red-200 py-2 px-3 rounded-lg">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="red"
                />
                <Text className="text-slate-900">{errors.root.message}</Text>
              </View>
              <Text>x</Text>
            </View>
          )}
        </View>
        <View className="">
          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              maxLength: { value: 100, message: 'Maximum 100 letters' },
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: 'Email is invalid',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="email-outline" size={32} />}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                label="Email"
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text className="text-red-600">{errors.email.message}</Text>
          )}
          <Controller
            control={control}
            rules={{
              required: 'Have not entered password',
              minLength: { value: 8, message: 'At least 8 letters' },
              validate: {
                hasLetterAndNumber: v =>
                  (/[A-Za-z]/.test(v) && /\d/.test(v)) ||
                  'Password must have number and letter',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="lock-outline" size={32} />}
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                label="Password"
                hiddenIcon={true}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text className="text-red-600">{errors.password.message}</Text>
          )}
        </View>
        <View>
          <View className="flex-row justify-between font-normal text-2xl pt-16">
            <Text>Remember me?</Text>
            <Pressable>
              <Text className="text-primary">Forgot password?</Text>
            </Pressable>
          </View>
        </View>
        <View>
          <FooterContent
            text="Don't have an account?"
            boldText="Sign up"
            linkTo="SignUp"
          />
        </View>
        <View className="w-screen flex-1 justify-end">
          <CustomButton title="Sign in" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </SafeAreaView>
  );
}
