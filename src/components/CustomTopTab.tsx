import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { colors } from '../constant/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const handleTabPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.tabBarLabel ?? options.title ?? route.name;

          const Icon = options.tabBarIcon;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={`${label} tab`}
              onPress={() => handleTabPress(route, isFocused)}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonActive,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.contentContainer}>
                {Icon && (
                  <View style={{ marginRight: 6 }}>
                    {Icon({ focused: isFocused, color: isFocused ? '#FFF' : '#666', size: 20 })}
                  </View>
                )}
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    color: '#71717a',
    fontWeight: '600',
    fontSize: 14,
  },
  tabLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});