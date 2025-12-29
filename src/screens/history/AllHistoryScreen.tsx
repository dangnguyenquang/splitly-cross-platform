import React, { useCallback, useState } from 'react';
import { View, SectionList } from 'react-native';
import CardItem from '../../components/history/HistoryCardItem';
import SectionDivider from '../../components/history/SectionDivider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityItem, DebtItem, SectionData } from '../home';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { getPayDebt, getReceiveDebt } from '@/src/api/debt.api';
import { formatDate } from '@/src/utils/date';

export function AllHistoryScreen() {
  const currentUser = useSelector(
    (state: RootState) => state.auth.login.currentUser,
  );

  const navigation = useNavigation();
  const [activity, setActivity] = useState<SectionData[]>([]);

  const groupByDate = useCallback((items: ActivityItem[]): SectionData[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayItems: ActivityItem[] = [];
    const yesterdayItems: ActivityItem[] = [];
    const olderItems: ActivityItem[] = [];

    items.forEach(item => {
      const itemDate = new Date(item.timestamp);
      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      if (itemDay.getTime() === today.getTime()) {
        todayItems.push(item);
      } else if (itemDay.getTime() === yesterday.getTime()) {
        yesterdayItems.push(item);
      } else {
        olderItems.push(item);
      }
    });

    const sections: SectionData[] = [];
    if (todayItems.length > 0) {
      sections.push({ title: 'Today', data: todayItems });
    }
    if (yesterdayItems.length > 0) {
      sections.push({ title: 'Yesterday', data: yesterdayItems });
    }
    if (olderItems.length > 0) {
      sections.push({ title: 'Older', data: olderItems });
    }

    return sections;
  }, []);

  const transformDebtData = useCallback((
    receiveDebts: DebtItem[],
    payDebts: DebtItem[],
  ): ActivityItem[] => {
    const allActivities: ActivityItem[] = [];
    const currentUserId = currentUser?.userId;

    receiveDebts.forEach((debt, index) => {
      if (debt.creditor.userId === currentUserId) {
        allActivities.push({
          id: `receive-${debt.debtor.userId}-${index}`,
          ownerName: debt.debtor.fullName,
          ownerAvatar: debt.debtor.userImage || '',
          amount: `${debt.amount.toLocaleString('vi-VN')}`,
          requestPersonName: currentUser?.fullName + ' (You)' || 'You',
          requestPersonAvatar: currentUser?.userImage || '',
          action: 'owes',
          timestamp: new Date(debt.createdAt),
          type: 'receive',
          userDebtId: debt.userDebtId,
          paymentReminderAt: debt.paymentReminderAt,
          paymentVerificationReminderAt: debt.paymentVerificationReminderAt,
          rawAmount: debt.amount,
        });
      }
    });

    payDebts.forEach((debt, index) => {
      if (debt.debtor.userId === currentUserId) {
        allActivities.push({
          id: `pay-${debt.creditor.userId}-${index}`,
          ownerName: currentUser?.fullName + ' (You)' || 'You',
          ownerAvatar: currentUser?.userImage || '',
          amount: `${debt.amount.toLocaleString('vi-VN')}`,
          requestPersonName: debt.creditor.fullName,
          requestPersonAvatar: debt.creditor.userImage || '',
          action: 'owes',
          timestamp: new Date(debt.createdAt),
          type: 'pay',
          userDebtId: debt.userDebtId,
          paymentReminderAt: debt.paymentReminderAt,
          paymentVerificationReminderAt: debt.paymentVerificationReminderAt,
          rawAmount: debt.amount,
        });
      }
    });

    allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return allActivities;
  }, [currentUser]);

  const fetchDebts = useCallback(async () => {
    try {
      const [receiveDebtData, payDebtData] = await Promise.all([
        getReceiveDebt(true),
        getPayDebt(true),
      ]);

      const transformedData = transformDebtData(
        receiveDebtData || [],
        payDebtData || [],
      );

      const groupedData = groupByDate(transformedData);
      setActivity(groupedData);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  }, [transformDebtData, groupByDate]);

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;

      fetchDebts();
    }, [currentUser, fetchDebts])
  );
  return (
    <View>
      <SectionList
        sections={activity}
        keyExtractor={item => item.id}
        renderItem={({ item, index, section }) => (
          <CardItem
            username={item.type === 'pay' ? item.requestPersonName : item.ownerName}
            avatarUrl={item.type === 'pay' ? item.requestPersonAvatar : item.ownerAvatar}
            time={formatDate(item.timestamp)}
            amount={item.amount}
            type={item.type}
            showDivider={index < section.data.length - 1}
            onPress={() => navigation.navigate('HistoryDetailScreen' as never)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionDivider title={title} />
        )}
      />
    </View>
  );
}
