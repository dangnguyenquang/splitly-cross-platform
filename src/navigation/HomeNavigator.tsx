import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home';
import TransactionHistoryScreen from '../screens/history';

export type HomeStackParamList = {
  Home: undefined;
  HistoryScreen: undefined;
  RequestScreen: undefined;
  Detail: { id: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FDBF14' },
        headerTitleStyle: { color: '#000', fontWeight: 'bold' },
        headerTintColor: '#000',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistoryScreen"
        component={TransactionHistoryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
