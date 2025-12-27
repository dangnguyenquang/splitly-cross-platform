import { userLogin } from '@/src/api/auth.api';
import FooterContent from '@/src/components/auth/CustomFooterContent';
import InputAuth from '@/src/components/auth/CustomInputAuth';
import ErrorToastify from '@/src/components/auth/ErrorToastify';
import AvoidKeyboard from '@/src/components/AvoidKeyboard';
import CheckBox from '@/src/components/CheckBox';
import CustomButton from '@/src/components/CustomButton';
import LoadingModal from '@/src/components/LoadingModal';
import { colors } from '@/src/constant/theme';
import { LoginForm, RootStackParamList, User } from '@/src/types';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

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
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <AvoidKeyboard>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 40,
            flexGrow: 1,
          }}
        >
          <View className="flex-row gap-10 items-center mt-10">
            <Text className="text-3xl font-semibold ">Welcome back!</Text>
            <View className="">
              <FontAwesome6
                name="hand-peace"
                size={32}
                iconStyle="solid"
                color={colors.primary}
              />
            </View>
          </View>
          <Text className="text-base font-normal mt-10 mb-8">
            Please enter email and password to sign in
          </Text>
          <ErrorToastify
            errors={errors}
            onClose={() => setError('root', { type: 'server', message: '' })}
          />
          <View className="">
            <Controller
              control={control}
              rules={{
                required: 'Email is required',
                maxLength: { value: 100, message: 'Maximum 100 letters' },
                // pattern: {
                //   value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                //   message: 'Email is invalid',
                // },
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
                required: 'Password is required',
                //minLength: { value: 8, message: 'At least 8 letters' },
                // validate: {
                //   hasLetterAndNumber: v =>
                //     (/[A-Za-z]/.test(v) && /\d/.test(v)) ||
                //     'Password must have number and letter',
                // },
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
              <View>
                <CheckBox
                  value={isChecked}
                  title="Remember me?"
                  setIsCheck={() => setIsChecked(prev => !prev)}
                />
              </View>
              <Pressable onPress={() => navigate.navigate('ResetPassword')}>
                <Text className="text-primary-10 font-bold">
                  Forgot password?
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="pt-6">
            <FooterContent
              text="Don't have an account?"
              boldText="Sign up"
              linkTo="SignUp"
            />
          </View>
          <View className="mt-auto pt-10 items-center">
            <CustomButton title="Sign in" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
        {isLoading && (
          <LoadingModal
            isLoading={isLoading}
            title="Signing in..."
            messageLine1="You will be directed to the"
            messageLine2="homepage."
            iconName="user"
          />
        )}
      </AvoidKeyboard>
    </SafeAreaView>
  );
}
