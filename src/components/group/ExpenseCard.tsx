import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/src/constant/theme';
import { SCREEN_WIDTH } from '@/src/utils/dimension';

interface ExpenseCardProps {
  expense: any; // matches payment schema
  currency: string;
  onPress?: () => void;
}

/* ===== Category mappings ===== */
const categoryIconMap: Record<string, string> = {
  Food: '🍔',
  Travel: '🚌',
  Shopping: '🛒',
  Default: '💸',
};

const categoryColorMap: Record<string, string> = {
  Food: '#FFE5D9',
  Travel: '#E0F2FE',
  Shopping: '#EDE9FE',
  Default: '#F3F4F6',
};

/* ===== Status color ===== */
const statusColorMap: Record<string, string> = {
  success: '#22C55E',
  processing: '#F59E0B',
  failed: '#EF4444',
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  currency,
  onPress,
}) => {
  const category = expense?.tag?.tagName || 'Default';
  const icon = categoryIconMap[category] || categoryIconMap.Default;
  const bgColor = categoryColorMap[category] || categoryColorMap.Default;

  const statusColor = statusColorMap[expense.status] || colors.secondary;

  const createdDate = expense?.groupInfoResponse?.createdAt
    ? new Date(expense.groupInfoResponse.createdAt).toLocaleTimeString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    : '';

  const isMine = expense?.containUser === true;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} disabled={!onPress}>
      <View
        style={[
          styles.expenseCard,
          isMine && styles.myExpenseCard,
        ]}
      >
        {/* Category Icon */}
        <View style={[styles.cardCategoryLogo, { backgroundColor: bgColor }]}>
          <Text style={styles.categoryEmoji}>{icon}</Text>
        </View>

        {/* Main Info */}
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText} numberOfLines={1}>
              {expense.title}
            </Text>

            {isMine && (
              <View style={styles.mineBadge}>
                <Text style={styles.mineBadgeText}>You</Text>
              </View>
            )}
          </View>

          <Text style={styles.subText}>
            Paid by: {expense?.user?.fullName || 'Unknown'}
          </Text>

          <Text style={styles.subText}>
            {expense.items?.length || 0} items
          </Text>
        </View>

        {/* Amount + Status */}
        <View style={styles.cardInfoRight}>
          <Text style={styles.amountText}>
            {expense.estimatedAmount} {currency}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {expense.status.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.dateText}>{createdDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
  },

  myExpenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  cardCategoryLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  categoryEmoji: {
    fontSize: 20,
  },

  cardInfo: {
    width: SCREEN_WIDTH * 0.42,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    maxWidth: '85%',
  },

  mineBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  mineBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },

  subText: {
    fontSize: 12,
    color: colors.secondary,
    marginTop: 2,
  },

  cardInfoRight: {
    width: SCREEN_WIDTH * 0.28,
    alignItems: 'flex-end',
  },

  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },

  dateText: {
    fontSize: 11,
    color: colors.secondary,
    marginTop: 4,
  },
});
