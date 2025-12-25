import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '../../../../components/ui/icon';
import { colors } from '@/src/constant/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { Expense, RootStackParamList } from '@/src/types';
import ExpenseCard from '@/src/components/group/ExpenseCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { getPaymentsByGroupId } from '@/src/api/group.api';

type ExpenseNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ExpenseRouteProp = RouteProp<
  { Expense: { groupId: string; group: any } },
  'Expense'
>;

const ExpenseScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<ExpenseNavigationProp>();
  const route = useRoute<ExpenseRouteProp>();
  const { groupId, group } = route.params;

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );

  useFocusEffect(
    useCallback(() => {
      if (!token || !groupId) return;

      const fetchExpenses = async () => {
        try {
          setLoading(true);
          const res = await getPaymentsByGroupId(Number(groupId), token);
          setExpenses(res ?? []);
        } catch (error) {
          console.error('Fetch expenses error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchExpenses();
    }, [groupId, token]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 📭 Empty
  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expenses yet</Text>

        <Fab
          size="lg"
          placement="bottom right"
          style={styles.fabButton}
          onPress={() => navigation.navigate('AddExpense', { groupId, group })}
        >
          <FabIcon as={AddIcon} style={styles.fabIcon} />
          <FabLabel style={styles.fabIcon}>Add expense</FabLabel>
        </Fab>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item: Expense) => item.paymentId}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            currency={group?.currency || 'VND'}
            onPress={() =>
              navigation.navigate('PaymentDetail', {
                payment: item,
                group,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Fab
        size="lg"
        placement="bottom right"
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddExpense', { groupId, group })}
      >
        <FabIcon as={AddIcon} style={styles.fabIcon} />
        <FabLabel style={styles.fabIcon}>Add expense</FabLabel>
      </Fab>
    </View>
  );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 120, // space for FAB
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },

  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
    textAlign: 'center',
  },

  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: colors.primary,
    elevation: 4, // Android shadow
  },

  fabIcon: {
    color: '#000000',
  },
});
