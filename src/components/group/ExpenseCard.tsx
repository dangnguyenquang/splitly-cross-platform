import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '@/src/constant/theme';
import { Expense } from '@/src/types';
import { SCREEN_WIDTH } from '@/src/utils/dimension';


interface ExpenseCardProps {
  expense: Expense;
  currency: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, currency }) => {
  const icon = categoryIconMap[expense.expenseType] || '❓';
  const bgColor = categoryColorMap[expense.expenseType] || '#eee';

  return (
    <View style={styles.expenseCard}>
      <View style={[styles.cardCategoryLogo, { backgroundColor: bgColor }]}>
        <Text style={styles.categoryEmoji}>{icon}</Text>
      </View>

      {/* Thông tin chi phí */}
      <View style={styles.cardInfo}>
        <Text style={styles.boldText}>{expense.title}</Text>
        <Text style={styles.secondaryText}>Paid by: {expense.paidBy}</Text>
      </View>

      <View style={styles.cardInfo2}>
        <Text style={styles.boldTextCurrency}>
          {expense.amount} {currency}
        </Text>
        <Text style={styles.secondaryText}>
          {expense.dateTime.toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  expenseCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    paddingVertical: 12,
    borderColor: '#eee',
  },
  boldText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  boldTextCurrency: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardInfo: {
    width: SCREEN_WIDTH * 0.4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardInfo2: {
    width: SCREEN_WIDTH * 0.3,
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 8,
    marginBottom: 8,
  },
  cardCategoryLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  secondaryText: {
    color: colors.secondary,
  },
});
