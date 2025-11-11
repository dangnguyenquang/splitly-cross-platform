import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AllHistoryScreen } from '../screens/history/allHistoryScreen';
import { PaidHistoryScreen } from '../screens/history/paidHistoryScreen';
import { RequestHistoryScreen } from '../screens/history/requestHistoryScreen';
import { ExpendHistoryScreen } from '../screens/history/expendHistoryScreen';
import CustomTabBar from '../components/CustomTopTab';

const Tab = createMaterialTopTabNavigator();

export default function HistoryTopTabs() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="All" component={AllHistoryScreen} />
      <Tab.Screen name="Paid" component={PaidHistoryScreen} />
      <Tab.Screen name="Requests" component={RequestHistoryScreen} />
      <Tab.Screen name="Expenses" component={ExpendHistoryScreen} />
    </Tab.Navigator>
  );
}
