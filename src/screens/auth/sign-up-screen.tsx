import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { colors } from '../../Constant/theme';
import InputAuth from '../../components/auth/custom-input-auth';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import FooterContent from '../../components/auth/custom-footer-content';
import CustomButton from '../../components/CustomButton';
export default function SignUpScreen() {
  return (
    <View className="w-screen h-full p-10">
      <View className="flex-row gap-10 items-center mt-10">
        <Text className="text-3xl font-semibold ">Create an account!</Text>
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
        Please enter email and password to sign up
      </Text>
      <View className="">
        <InputAuth
          icon={<MaterialDesignIcons name="email-outline" size={32} />}
          placeholder="Please enter email"
          value=""
          onChangeText={() => {}}
          label="Email"
        />
        <InputAuth
          icon={<MaterialDesignIcons name="lock-outline" size={32} />}
          placeholder="Please enter password"
          value=""
          onChangeText={() => {}}
          label="Password"
          secure={true}
          hiddenIcon={true}
        />
        <InputAuth
          icon={<MaterialDesignIcons name="lock-outline" size={32} />}
          placeholder="Please confirm password"
          value=""
          onChangeText={() => {}}
          label="Confirm password"
          secure={true}
          hiddenIcon={true}
        />
      </View>
      <View className="">
        <FooterContent
          text="I agree with Splitly"
          boldText="Term & Policy"
          linkTo="SignUp"
        />
      </View>
      <View>
        <FooterContent
          text="Already have an account?"
          boldText="Sign in"
          linkTo="SignIn"
        />
      </View>
      <View className="w-screen flex-1 justify-end">
        <CustomButton title="Sign up" />
      </View>
    </View>
  );
}
