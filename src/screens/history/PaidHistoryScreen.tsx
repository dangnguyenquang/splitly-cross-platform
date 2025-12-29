import React, { useCallback, useState } from 'react';
import { SectionList, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import CardItem from '../../components/history/HistoryCardItem';
import SectionDivider from '../../components/history/SectionDivider';

import { RootState } from '@/src/store/store';
import { getPayDebt } from '@/src/api/debt.api';
import { formatDate } from '@/src/utils/date';
import { ActivityItem, DebtItem, SectionData } from '../home';

export function PaidHistoryScreen() {
  const currentUser = useSelector(
    (state: RootState) => state.auth.login.currentUser,
  );

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
      const itemDay = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate(),
      );

      if (itemDay.getTime() === today.getTime()) {
        todayItems.push(item);
      } else if (itemDay.getTime() === yesterday.getTime()) {
        yesterdayItems.push(item);
      } else {
        olderItems.push(item);
      }
    });

    const sections: SectionData[] = [];
    if (todayItems.length) sections.push({ title: 'Today', data: todayItems });
    if (yesterdayItems.length)
      sections.push({ title: 'Yesterday', data: yesterdayItems });
    if (olderItems.length) sections.push({ title: 'Older', data: olderItems });

    return sections;
  }, []);

  const transformPayData = useCallback(
    (payDebts: DebtItem[]): ActivityItem[] => {
      const currentUserId = currentUser?.userId;
      if (!currentUserId) return [];

      const activities: ActivityItem[] = payDebts.map(debt => ({
        id: `pay-${debt.userDebtId}`,
        ownerName: currentUser.fullName + ' (You)',
        ownerAvatar: currentUser.userImage || '',
        requestPersonName: debt.creditor.fullName,
        requestPersonAvatar: debt.creditor.userImage || '',
        amount: debt.amount.toLocaleString('vi-VN'),
        action: 'owes',
        timestamp: new Date(debt.createdAt),
        type: 'pay',
        userDebtId: debt.userDebtId,
        paymentReminderAt: debt.paymentReminderAt,
        paymentVerificationReminderAt: debt.paymentVerificationReminderAt,
        rawAmount: debt.amount,
      }));

      return activities.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );
    },
    [currentUser],
  );

  const fetchPayDebts = useCallback(async () => {
    try {
      const response = await getPayDebt(true);
      const transformedData = transformPayData(response || []);
      const groupedData = groupByDate(transformedData);
      setActivity(groupedData);
    } catch (error) {
      console.error('Error fetching pay debts:', error);
    }
  }, [transformPayData, groupByDate]);

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;

      fetchPayDebts();
    }, [currentUser, fetchPayDebts]),
  );

  return (
    <View>
      <SectionList
        sections={activity}
        keyExtractor={item => item.id}
        renderItem={({ item, index, section }) => (
          <CardItem
            username={item.requestPersonName}
            avatarUrl={item.requestPersonAvatar}
            time={formatDate(item.timestamp)}
            amount={item.amount}
            type={item.type}
            showDivider={index < section.data.length - 1}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionDivider title={title} />
        )}
      />
    </View>
  );
}
