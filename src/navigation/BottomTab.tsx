import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../constant/theme';
import ContactScreen from '../screens/contact/ContactScreen';
import AccountScreen from '../screens/account';
import CameraScreen from '../screens/camera';
import HomeStackNavigator from './HomeNavigator';
import GroupsScreen from '../screens/group/GroupsScreen';

export type RootTabParamList = {
  Home: undefined;
  Group: undefined;
  Camera: undefined;
  Contact: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_CONFIG = {
  Home: { icon: 'home', label: 'Home' },
  Group: { icon: 'groups', label: 'Groups' },
  Camera: { icon: 'qr-code-scanner', label: '' },
  Contact: { icon: 'contacts', label: 'Contacts' },
  Account: { icon: 'person', label: 'Account' },
} as const;

function BottomNavigationTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = TAB_CONFIG[route.name]?.icon || 'help-outline';
          return (
            <MaterialIcons
              name={iconName}
              size={focused ? size + 2 : size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 80,
          paddingBottom: Platform.OS === 'ios' ? 28 : 20,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: TAB_CONFIG.Home.label }}
      />
      <Tab.Screen
        name="Group"
        component={GroupsScreen}
        options={{ tabBarLabel: TAB_CONFIG.Group.label }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarLabel: TAB_CONFIG.Camera.label,
          tabBarIconStyle: { marginTop: Platform.OS === 'ios' ? -4 : 0 },
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{ tabBarLabel: TAB_CONFIG.Contact.label }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarLabel: TAB_CONFIG.Account.label }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigationTabs;
