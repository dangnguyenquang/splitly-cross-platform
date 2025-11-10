// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import OnboardContainer from '../src/screens/onBoardScreenContainer';
import GetStartedScreen from '../src/screens/getStartedScreen';
import SignInScreen from '../src/screens/auth/sign-in-screen';
import SignUpScreen from '../src/screens/auth/sign-up-screen';
import BottomNavigationTabs from '../src/screens/bottomtab/bottomTab';
import NewGroupScreen from '../src/screens/group/NewGroupScreen';
import SelectParticipantsScreen from '../src/screens/group/SelectParticipantsScreen';
import GroupsScreen from '../src/screens/group/GroupsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
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
                <Stack.Screen name="SelectParticipants" component={SelectParticipantsScreen} />
                <Stack.Screen name="CreateGroup" component={NewGroupScreen} />
                <Stack.Screen name="GroupsScreen" component={GroupsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;