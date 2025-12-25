import BottomNavigationTabs from '@/src/navigation/BottomTab';
import PersonalInfoScreen from '@/src/screens/account/userDetail';
import AddExpenseScreen from '@/src/screens/group/AddExpenseScreen';
import GroupDetailScreen from '@/src/screens/group/GroupDetailScreen';
import GroupsScreen from '@/src/screens/group/GroupsScreen';
import NewGroupScreen from '@/src/screens/group/NewGroupScreen';
import PaymentDetailScreen from '@/src/screens/group/PaymentDetailScreen';
import SelectParticipantsScreen from '@/src/screens/group/SelectParticipantsScreen';
import TransactionHistoryScreen from '@/src/screens/history';
import { HistoryDetailScreen } from '@/src/screens/history/HistoryDetailScreen';
import ReceiptScreen from '@/src/screens/history/ReceiptScreen';
import NotificationScreen from '@/src/screens/notification';
import RequestScreen from '@/src/screens/request';
import { RootStackParamList } from '@/src/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainApp"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainApp" component={BottomNavigationTabs} />

      <Stack.Screen
        name="SelectParticipants"
        component={SelectParticipantsScreen}
      />
      <Stack.Screen name="CreateGroup" component={NewGroupScreen} />
      <Stack.Screen name="GroupsScreen" component={GroupsScreen} />

      <Stack.Screen name="PersonalInfoDetail" component={PersonalInfoScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="PaymentDetail" component={PaymentDetailScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="History" component={TransactionHistoryScreen} />
      <Stack.Screen name="Request" component={RequestScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen
        name="HistoryDetailScreen"
        component={HistoryDetailScreen}
      />
      <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
