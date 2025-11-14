import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constant/theme';

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  index?: number;
  leftIconName?: string;
  onPress?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  time,
  index = 0,
  leftIconName = 'info-outline',
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <View style={styles.leftIcon}>
          <MaterialIcons name={leftIconName} size={30} color="#000" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={4}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        <View style={styles.rightIcon}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor:
                index % 2 === 0 ? colors.background : colors.primary,
              marginRight: 4,
            }}
          />
          <MaterialIcons name="arrow-forward-ios" size={30} color="#000" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 24,
    gap: 20,
    alignItems: 'center',
  },
  leftIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    color: colors.secondary,
    marginBottom: 4,
  },
  time: {
    color: colors.secondary,
    fontSize: 12,
  },
  rightIcon: {
    flexDirection: 'row',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
