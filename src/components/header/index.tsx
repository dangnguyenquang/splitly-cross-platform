// components/CustomHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';

interface IconProps {
  component: any; // Icon component, e.g., Ionicons, MaterialIcons
  name: string;
  size?: number;
  color?: string;
}

interface CustomHeaderProps {
  title: string;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  height?: number;
  borderRadius?: number;
  shadow?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor = '#fff',
  titleColor = '#000',
  height = 60,
  borderRadius = 0,
  shadow = true,
}) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  return (
    <>
      <StatusBar
        barStyle={backgroundColor === '#fff' ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
        translucent
      />
      <View
        style={[
          styles.headerWrapper,
          {
            backgroundColor,
            paddingTop: statusBarHeight,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
          },
        ]}
      >
        <View
          style={[
            styles.container,
            {
              height,
              ...(shadow
                ? {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                  }
                : {}),
            },
          ]}
        >
          <View style={styles.side}>
            {leftIcon && onLeftPress && (
              <TouchableOpacity onPress={onLeftPress} style={styles.iconButton} activeOpacity={0.7}>
                <leftIcon.component name={leftIcon.name} size={leftIcon.size || 24} color={leftIcon.color || titleColor} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: titleColor }]} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </View>

          <View style={styles.side}>
            {rightIcon && onRightPress && (
              <TouchableOpacity onPress={onRightPress} style={styles.iconButton} activeOpacity={0.7}>
                <rightIcon.component name={rightIcon.name} size={rightIcon.size || 24} color={rightIcon.color || titleColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {shadow && borderRadius === 0 && <View style={styles.borderBottom} />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerWrapper: { width: '100%' },
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between' },
  side: { width: 40, alignItems: 'center', justifyContent: 'center' },
  titleContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  title: { fontSize: 18, fontWeight: '600', letterSpacing: 0.3 },
  iconButton: { padding: 8, borderRadius: 20 },
  borderBottom: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(0, 0, 0, 0.08)' },
});

export default CustomHeader;
