import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import ExpenseCard from '@/src/components/group/GroupExpenseCard';
import { GroupDetailInformation, Expense } from '@/types';
import { mockGroupDetail } from '@/data/mockDataGroupDetail';
import { Fab, FabIcon, FabLabel } from '../../../../components/ui/fab';
import { AddIcon } from '../../../../components/ui/icon';
import { colors } from '@/src/constant/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
type ExpenseNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const ExpenseScreen: React.FC = () => {
  const [groupDetail, setGroupDetail] = useState<GroupDetailInformation>();
  const navigation = useNavigation<ExpenseNavigationProp>();
  useEffect(() => {
    // Simulate fetching group details
    const fetchGroupDetail = async () => {
      setGroupDetail(mockGroupDetail);
    };
    fetchGroupDetail();
  }, []);

  if (
    !groupDetail ||
    !groupDetail.expenses ||
    groupDetail.expenses.length === 0
  ) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expenses yet</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={groupDetail.expenses}
        keyExtractor={(item: Expense) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            currency={groupDetail.currency || 'VND'}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <Fab
        size="lg"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <FabIcon as={AddIcon} style={styles.fabIcon} />
        <FabLabel style={styles.fabIcon}>Add expense</FabLabel>
      </Fab>
    </View>
  );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  fabButton: {
    backgroundColor: colors.primary,
    color: colors.primary,
    marginBottom: 20,
  },
  fabIcon: {
    color: 'black',
  },
});
