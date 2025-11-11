import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AllHistoryScreen } from '../screens/history/AllHistoryScreen';
import { PaidHistoryScreen } from '../screens/history/PaidHistoryScreen';
import { RequestHistoryScreen } from '../screens/history/RequestHistoryScreen';
import { ExpendHistoryScreen } from '../screens/history/ExpendHistoryScreen';
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
