import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import * as React from 'react';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { colors } from '../../constant/theme';
import InputAuth from '../../components/auth/custom-input-auth';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import FooterContent from '../../components/auth/custom-footer-content';
import CustomButton from '../../components/CustomButton';
export default function SignInScreen() {
  const navigation = useNavigation();
  return (
    <View className="w-screen h-full p-10">
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
      <Text className="text-lg font-normal my-10">
        Please enter email and password to sign in
      </Text>
      <View className="">
        <InputAuth
          icon={<MaterialDesignIcons name="email-outline" size={32} />}
          placeholder="Email"
          value=""
          onChangeText={() => {}}
          label="Email"
        />
        <InputAuth
          icon={<MaterialDesignIcons name="lock-outline" size={32} />}
          placeholder="Password"
          value=""
          onChangeText={() => {}}
          label="Password"
          secure={true}
          hiddenIcon={true}
        />
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
        <CustomButton
          title="Sign in"
          onPress={() => navigation.navigate('MainApp' as never)}
        />
      </View>
    </View>
  );
}
