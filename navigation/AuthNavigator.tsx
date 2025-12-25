// src/navigation/AuthNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootStackParamList } from "@/src/types";

import SlashScreen from "@/src/screens/slash/SlashScreen";
import OnboardContainer from "@/src/screens/OInBoardScreenContainer";
import GetStartedScreen from "@/src/screens/GetStartedScreen";
import SignInScreen from "@/src/screens/auth/SignInScreen";
import SignUpScreen from "@/src/screens/auth/SignUpScreen";
import ResetPasswordScreen from "@/src/screens/auth/ResetPasswordScreen";
import NewPasswordScreen from "@/src/screens/auth/NewPasswordScreen";
import OTPSreen from "@/src/screens/auth/OTPScreen";
import { RootState } from "@/src/store/store";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthNavigator() {
  const hasOnboarded = useSelector((state: RootState) => state.app?.hasOnboarded);

  return (
    <Stack.Navigator
      key={hasOnboarded ? "auth_seen" : "auth_new"}
      screenOptions={{ headerShown: false }}
      initialRouteName={hasOnboarded ? "GetStartedScreen" : "Slash"}
    >
      {!hasOnboarded && (
        <>
          <Stack.Screen name="Slash" component={SlashScreen} />
          <Stack.Screen name="Onboard" component={OnboardContainer} />
        </>
      )}

      <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="OTP" component={OTPSreen} />
    </Stack.Navigator>
  );
}
