import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { colors } from '@/src/constant/theme';
import InputAuth from '@/src/components/auth/CustomInputAuth';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import FooterContent from '@/src/components/auth/CustomFooterContent';
import CustomButton from '@/src/components/CustomButton';
import { useForm, Controller } from 'react-hook-form';
import { userLogin } from '@/src/api/auth.api';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '@/src/types';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorToastify from '@/src/components/auth/ErrorToastify';

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
        <ErrorToastify errors={errors} />
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
          <CustomButton title="Sign in" onPress={handleSubmit(onSubmit)} testID='sign-in-button'/>
        </View>
      </View>
    </SafeAreaView>
  );
}
