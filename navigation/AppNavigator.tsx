// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types';
import BottomNavigationTabs from '@/src/navigation/BottomTab';
import TransactionHistoryScreen from '@/src/screens/history';
import RequestScreen from '@/src/screens/request';
import NotificationScreen from '@/src/screens/notification';
import { HistoryDetailScreen } from '@/src/screens/history/HistoryDetailScreen';
import ReceiptScreen from '@/src/screens/history/ReceiptScreen';
import OnboardContainer from '@/src/screens/OInBoardScreenContainer';
import GetStartedScreen from '@/src/screens/GetStartedScreen';
import SignInScreen from '@/src/screens/auth/SignInScreen';
import SignUpScreen from '@/src/screens/auth/SignUpScreen';
import SelectParticipantsScreen from '@/src/screens/group/SelectParticipantsScreen';
import GroupsScreen from '@/src/screens/group/GroupsScreen';
import NewGroupScreen from '@/src/screens/group/NewGroupScreen';
import OTPSreen from '@/src/screens/auth/OTPScreen';
import SlashScreen from '@/src/screens/slash/SlashScreen';
import ResetPasswordScreen from '@/src/screens/auth/ResetPasswordScreen';
import NewPasswordScreen from '@/src/screens/auth/NewPasswordScreen';



const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Slash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Slash" component={SlashScreen} />
                <Stack.Screen name="Onboard" component={OnboardContainer} />
                <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
                <Stack.Screen name="MainApp" component={BottomNavigationTabs} />
                <Stack.Screen name="SelectParticipants" component={SelectParticipantsScreen} />
                <Stack.Screen name="CreateGroup" component={NewGroupScreen} />
                <Stack.Screen name="GroupsScreen" component={GroupsScreen} />

                <Stack.Screen name="History" component={TransactionHistoryScreen} />
                <Stack.Screen name="Request" component={RequestScreen} />
                <Stack.Screen name="Notifications" component={NotificationScreen} />
                <Stack.Screen name="HistoryDetailScreen" component={HistoryDetailScreen} />
                <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
                <Stack.Screen name="OTP" component={OTPSreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;