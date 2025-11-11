import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AllHistoryScreen } from '../screens/history/allHistoryScreen';
import { PaidHistoryScreen } from '../screens/history/paidHistoryScreen';
import { RequestHistoryScreen } from '../screens/history/requestHistoryScreen';
import { ExpendHistoryScreen } from '../screens/history/expendHistoryScreen';
import CustomTabBar from '../components/CustomTopTab';
import ExpenseScreen from '../screens/group/GroupDetailTab/Expenses';
import BalanceScreen from '../screens/group/GroupDetailTab/Balance';
import TotalScreen from '../screens/group/GroupDetailTab/Totals';

const Tab = createMaterialTopTabNavigator();

export default function GroupDetailTopTabs() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Expense" component={ExpenseScreen} />
      <Tab.Screen name="Balance" component={BalanceScreen} />
      <Tab.Screen name="Total" component={TotalScreen} />
    </Tab.Navigator>
  );
}
