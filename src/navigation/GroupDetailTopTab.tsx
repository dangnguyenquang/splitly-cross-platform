import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomTabBar from '../components/CustomTopTab';
import ExpenseScreen from '../screens/group/GroupDetailTab/Expenses';
import BalanceScreen from '../screens/group/GroupDetailTab/Balance';
import TotalScreen from '../screens/group/GroupDetailTab/Totals';
import { GroupDetailTopTabsProps } from '@/types';

const Tab = createMaterialTopTabNavigator();

const GroupDetailTopTabs: React.FC<GroupDetailTopTabsProps> = ({
  groupId,
  group,
}) => {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Expense"
        component={ExpenseScreen}
        initialParams={{ groupId, group }}
      />
      <Tab.Screen
        name="Balance"
        component={BalanceScreen}
        initialParams={{ groupId, group }}
      />
      <Tab.Screen
        name="Total"
        component={TotalScreen}
        initialParams={{ groupId, group }}
      />
    </Tab.Navigator>
  );
};

export default GroupDetailTopTabs;
