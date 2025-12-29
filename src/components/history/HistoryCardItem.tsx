import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

const COLORS = {
  primary: '#111827',
  secondary: '#6B7280',
  success: '#059669', 
  successBg: '#D1FAE5',
  danger: '#DC2626',  
  dangerBg: '#FEE2E2',
  white: '#FFFFFF',
  divider: '#F3F4F6',
};

interface CardItemProps {
  username: string;
  showDivider?: boolean;
  avatarUrl?: string;
  time?: string;
  amount?: string;
  type?: string;
  onPress?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  username,
  showDivider = true,
  avatarUrl = 'https://i.pravatar.cc/150?img=1',
  time = '09:41 PM',
  amount = '100,000đ',
  type = 'Pay',
  onPress = () => { },
}) => {
  const isPayment = type.toLowerCase() === 'pay';
  

  const statusColor = isPayment ? COLORS.danger : COLORS.success;
  const statusBg = isPayment ? COLORS.dangerBg : COLORS.successBg;
  const statusIcon = isPayment ? 'arrow-outward' : 'south-west'; 
  const sign = isPayment ? '-' : '+';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.item}>
        <View style={styles.leftSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </View>

          <View style={styles.infoWrapper}>
            <Text style={styles.username} numberOfLines={1}>
              {username}
            </Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.amount, { color: statusColor }]}>
            {sign}{amount} <Feather name="dollar-sign" color={statusColor} size={16}/>
          </Text>
          
          <View style={[styles.badge, { backgroundColor: statusBg }]}>
            <MaterialIcons
              name={statusIcon} 
              size={12} 
              color={statusColor} 
              style={{ marginRight: 2 }}
            />
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {type}
            </Text>
          </View>
        </View>
      </View>

      {showDivider && (
        <View style={styles.dividerContainer}>
           <View style={styles.divider} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  avatarWrapper: {
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '500',
  },

  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 17,
    fontWeight: '800', 
    marginBottom: 6,
    fontVariant: ['tabular-nums'], 
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8, 
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    paddingLeft: 82, 
    paddingRight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});

export default CardItem;