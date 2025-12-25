import React, { useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from './AppNavigator';
import { RootState } from "@/src/store/store";


export default function RootNavigator() {
  const user = useSelector((s: RootState) => s.auth?.login.currentUser);

  const isLoggedIn = useMemo(() => Boolean(user?.token || user), [user?.token, user]);

  // key để reset navigation state khi login/logout (tránh back vào màn protected)
  return (
    <NavigationContainer key={isLoggedIn ? "app" : "auth"}>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
