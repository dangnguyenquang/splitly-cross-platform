import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
// React Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardContainer from './src/screens/onBoardScreenContainer';
import GetStartedScreen from './src/screens/getStartedScreen';
import SignInScreen from './src/screens/auth/sign-in-screen';
import SignUpScreen from './src/screens/auth/sign-up-screen';
import OTPSreen from './src/screens/auth/otp-verify-screen';

import { Provider } from 'react-redux';
import { store, persistor } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';

export type RootStackParamList = {
  Onboard: undefined;
  GetStartedScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  OTP: {email: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Onboard"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Onboard" component={OnboardContainer} />
              <Stack.Screen
                name="GetStartedScreen"
                component={GetStartedScreen}
              />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="OTP" component={OTPSreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
