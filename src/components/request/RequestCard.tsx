import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constant/theme';

interface MoneyRequestCardProps {
  ownerName?: string;
  amount?: string;
  action?: string;
  showDivider?: boolean;
  requestPersonName?: string;
  handleOnPressRequestButton?: () => void;
  type: 'pay' | 'receive';
}

const MoneyRequestCard: React.FC<MoneyRequestCardProps> = ({
  ownerName = 'Lucian Nguyen',
  requestPersonName = 'Lucian Nguyen',
  action = 'owes',
  amount = '194,000đ',
  showDivider = true,
  handleOnPressRequestButton,
  type
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Left Section - Names and Action */}
        <View style={styles.leftSection}>
          <Text style={styles.ownerName}>{ownerName}</Text>
          <Text style={styles.actionText}>{action}</Text>
          <Text style={styles.requestPersonName}>{requestPersonName}</Text>
        </View>
        
        {/* Right Section - Amount and Button */}
        <View style={styles.rightSection}>
          <View style={styles.amountButtonContainer}>
            <Text style={styles.amountText}>{amount}</Text>
            <TouchableOpacity
              style={styles.payButton}
              onPress={handleOnPressRequestButton}
            >
              <Text style={styles.payButtonText}>{type === 'pay' ? "Pay" : "Request"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

export default MoneyRequestCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  requestPersonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rightSection: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  amountButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  payButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
  },
});