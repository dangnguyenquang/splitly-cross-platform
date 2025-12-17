import React, { useLayoutEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";

import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { colors } from "@/src/constant/theme";
import InputAuth from "@/src/components/auth/CustomInputAuth";
import ErrorToastify from "@/src/components/auth/ErrorToastify";
import CustomButton from "@/src/components/CustomButton";
import LoadingModal from "@/src/components/LoadingModal";
import { RootStackParamList } from "@/src/types";


type CreateNewPasswordForm = {
  newPassword: string;
  confirmNewPassword: string;
};

type RouteParams = {
  email?: string;
  otp?: string;
};

export default function NewPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { email, otp } = (route.params as RouteParams) || {};

  useLayoutEffect(() => {
    // Ẩn header
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
    getValues,
    formState: { errors },
  } = useForm<CreateNewPasswordForm>({
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CreateNewPasswordForm) => {
    try {
      setIsLoading(true);

      navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data)?.message ??
          "Create new password failed. Please try again.";
        setError("root", { type: "server", message: msg });
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      setError("root", { type: "server", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View className="w-screen h-full px-10">
        {/* Back (custom) */}
        <Pressable
          onPress={() => navigation.goBack()}
          className="mt-2 w-10 h-10 items-center justify-center"
          accessibilityRole="button"
        >
          <MaterialDesignIcons name="arrow-left" size={26} color="#111827" />
        </Pressable>

        {/* Title */}
        <View className="flex-row items-center mt-4">
          <Text className="text-3xl font-semibold">Create new password </Text>
          <FontAwesome6
            name="lock"
            size={20}
            iconStyle="solid"
            color={colors.primary}
          />
        </View>

        {/* Description */}
        <Text className="text-base text-gray-500 mt-4">
          You’re almost there! Please create a new password for your Splitify
          account.
        </Text>

        {/* Errors */}
        <View className="mt-6">
          <ErrorToastify errors={errors} />
        </View>

        {/* New Password */}
        <View className="mt-4">
          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: "New password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            }}
            render={({ field: { onChange, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="lock-outline" size={26} />}
                placeholder="New Password"
                value={value}
                onChangeText={onChange}
                label="New Password"
                hiddenIcon={true}
              />
            )}
          />
          {errors.newPassword && (
            <Text className="text-red-600">{errors.newPassword.message}</Text>
          )}
        </View>

        {/* Confirm New Password */}
        <View className="mt-5">
          <Controller
            control={control}
            name="confirmNewPassword"
            rules={{
              required: "Confirm password is required",
              validate: (v) =>
                v === getValues("newPassword") || "Passwords do not match",
            }}
            render={({ field: { onChange, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="lock-outline" size={26} />}
                placeholder="Confirm New Password"
                value={value}
                onChangeText={onChange}
                label="Confirm New Password"
                hiddenIcon={true}
              />
            )}
          />
          {errors.confirmNewPassword && (
            <Text className="text-red-600">
              {errors.confirmNewPassword.message}
            </Text>
          )}
        </View>

        {/* Continue button bottom */}
        <View className="w-screen flex-1 justify-end pb-6">
          <CustomButton title="Continue" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>

      {isLoading && (
        <LoadingModal
          isLoading={isLoading}
          title="Updating password..."
          messageLine1="Please wait a moment."
          messageLine2="Do not close the app."
          iconName="user"
        />
      )}
    </SafeAreaView>
  );
}
