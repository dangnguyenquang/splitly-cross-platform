import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardContainer from './src/screens/onBoardScreenContainer';
import GetStartedScreen from './src/screens/getStartedScreen';
import SignInScreen from './src/screens/auth/sign-in-screen';
import SignUpScreen from './src/screens/auth/sign-up-screen';
import ThemeProvider from './src/context/theme';
import BottomNavigationTabs from './src/navigation/bottomTab';
import TransactionHistoryScreen from './src/screens/history';
import RequestScreen from './src/screens/request';
import NotificationScreen from './src/screens/notification';
import { HistoryDetailScreen } from './src/screens/history/historyDetailScreen';
import ReceiptScreen from './src/screens/history/receiptScreen';
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider"

export type RootStackParamList = {
  Onboard: undefined;
  GetStartedScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MainApp:undefined;
  History:undefined;
  Request:undefined;
  Notifications:undefined;
  HistoryDetailScreen:undefined;
  ReceiptScreen:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <ThemeProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboard"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Onboard" component={OnboardContainer} />
            <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="MainApp" component={BottomNavigationTabs} /> 

            <Stack.Screen name="History" component={TransactionHistoryScreen} /> 
            <Stack.Screen name="Request" component={RequestScreen} /> 
            <Stack.Screen name="Notifications" component={NotificationScreen} /> 
            <Stack.Screen name="HistoryDetailScreen" component={HistoryDetailScreen} /> 
            <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} /> 
          </Stack.Navigator>
        </NavigationContainer>
        </ThemeProvider>
    </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

export default App;
