// components/CustomHeader.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  ImageSourcePropType,
} from 'react-native';

/**
 * Icon / Image union type
 */
type HeaderIcon =
  | {
    type: 'icon';
    component: any; // Ionicons, MaterialIcons...
    name: string;
    size?: number;
    color?: string;
  }
  | {
    type: 'image';
    source: ImageSourcePropType;
    width?: number;
    height?: number;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  };

interface CustomHeaderProps {
  title: string;
  leftIcon?: HeaderIcon;
  rightIcon?: HeaderIcon;
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
  const statusBarHeight =
    Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  const renderIcon = (
    icon?: HeaderIcon,
    onPress?: () => void,
  ) => {
    if (!icon || !onPress) return null;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        {icon.type === 'icon' ? (
          <icon.component
            name={icon.name}
            size={icon.size || 24}
            color={icon.color || titleColor}
          />
        ) : (
          <Image
            source={icon.source}
            style={{
              width: icon.width || 24,
              height: icon.height || 24,
            }}
            resizeMode={icon.resizeMode || 'contain'}
          />
        )}
      </TouchableOpacity>
    );
  };

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
            {renderIcon(leftIcon, onLeftPress)}
          </View>

          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, { color: titleColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>

          <View style={styles.side}>
            {renderIcon(rightIcon, onRightPress)}
          </View>
        </View>

        {shadow && borderRadius === 0 && <View style={styles.borderBottom} />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  borderBottom: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});

export default CustomHeader;
