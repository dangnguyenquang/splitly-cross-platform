import { getPayDebt, getReceiveDebt } from '@/src/api/debt.api';
import CustomHeader from '@/src/components/header/index';
import SectionDivider from '@/src/components/history/SectionDivider';
import MoneyRequestCard from '@/src/components/request/RequestCard';
import { colors } from '@/src/constant/theme';
import { RootState } from '@/src/store/store';
import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

interface UserInfo {
  userId: number;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  userImage: string | null;
  roles: any;
}

interface DebtItem {
  debtor: UserInfo;
  creditor: UserInfo;
  amount: number;
  note: string;
  createdAt: string;
  status: boolean;
}

interface ActivityItem {
  id: string;
  ownerName: string;
  amount: string;
  requestPersonName: string;
  action: 'owes' | 'borrowed';
  timestamp: Date;
  type: 'pay' | 'receive';
}

interface SectionData {
  title: string;
  data: ActivityItem[];
}

import { registerTokenDevice } from '@/src/api/notifee.api';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activity, setActivity] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceView, setBalanceView] = useState<'receive' | 'pay'>('receive');
  const [totalReceive, setTotalReceive] = useState(0);
  const [totalPay, setTotalPay] = useState(0);

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );
  const currentUser = useSelector(
    (state: RootState) => state.auth.login.currentUser,
  );

  const navigation = useNavigation();

  useEffect(() => {
    const groupByDate = (items: ActivityItem[]): SectionData[] => {
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
    };

    const transformDebtData = (
      receiveDebts: DebtItem[],
      payDebts: DebtItem[],
    ): ActivityItem[] => {
      const allActivities: ActivityItem[] = [];
      const currentUserId = currentUser?.userId;
      let receiveTotal = 0;
      let payTotal = 0;

      receiveDebts.forEach((debt, index) => {
        if (debt.creditor.userId === currentUserId) {
          receiveTotal += debt.amount;
          allActivities.push({
            id: `receive-${debt.debtor.userId}-${index}`,
            ownerName: debt.debtor.fullName,
            amount: `${debt.amount.toLocaleString('vi-VN')}đ`,
            requestPersonName: currentUser?.fullName + ' (You)' || 'You',
            action: 'owes',
            timestamp: new Date(debt.createdAt),
            type: 'receive',
          });
        }
      });

      payDebts.forEach((debt, index) => {
        if (debt.debtor.userId === currentUserId) {
          payTotal += debt.amount;
          allActivities.push({
            id: `pay-${debt.creditor.userId}-${index}`,
            ownerName: currentUser?.fullName + ' (You)' || 'You',
            amount: `${debt.amount.toLocaleString('vi-VN')}đ`,
            requestPersonName: debt.creditor.fullName,
            action: 'owes',
            timestamp: new Date(debt.createdAt),
            type: 'pay',
          });
        }
      });

      setTotalReceive(receiveTotal);
      setTotalPay(payTotal);

      allActivities.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );

      return allActivities;
    };

    const fetchDebts = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const [receiveDebtData, payDebtData] = await Promise.all([
          getReceiveDebt(token),
          getPayDebt(token),
        ]);

        const transformedData = transformDebtData(
          receiveDebtData || [],
          payDebtData || [],
        );

        const groupedData = groupByDate(transformedData);
        setActivity(groupedData);
      } catch (error) {
        console.error('Error fetching debts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [token, currentUser]);

  const toggleBalanceView = () => {
    setBalanceView(prev => (prev === 'receive' ? 'pay' : 'receive'));
  };

  const displayAmount = balanceView === 'receive' ? totalReceive : totalPay;
  const displayLabel =
    balanceView === 'receive' ? 'You will receive' : 'You owe';

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const deviceId = await DeviceInfo.getUniqueId();

      await messaging().registerDeviceForRemoteMessages();
      const tokenDevice = await messaging().getToken();
      console.log('device token: ', tokenDevice);
      if (!cancelled) {
        try {
          const res = await registerTokenDevice(
            deviceId,
            tokenDevice,
            'ANDROID',
          );
          console.log('register token ok', res?.status);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log('register token failed', err);
          }
        }
      }
    };

    run().catch(console.log);

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Splitly"
        onLeftPress={() => console.log('Menu pressed')}
        onRightPress={() => navigation.navigate('Notifications' as never)}
        backgroundColor={colors.primary}
        titleColor="#050404ff"
        shadow={true}
        leftIcon={{
          type: 'image',
          source: require('@/assets/logo-rmbg.png'),
        }}
        rightIcon={{
          type: 'icon',
          component: Feather,
          name: 'bell',
          size: 28,
          color: '#000000ff',
        }}
      />

      <View style={styles.moneyFunctionSection}>
        <TouchableOpacity
          style={styles.balanceContainer}
          onPress={toggleBalanceView}
          activeOpacity={0.7}
        >
          <View style={styles.amountRow}>
            <Feather name="dollar-sign" size={40} color="#1a1a1a" />
            <Text style={styles.amountText}>
              {displayAmount.toLocaleString('vi-VN')}
            </Text>
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>{displayLabel}</Text>
            <View style={styles.swapIconContainer}>
              <MaterialIcons name="swap-horiz" size={18} color="#1a1a1a" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.functionSection}>
          <View style={styles.functionItem}>
            <TouchableOpacity
              style={styles.functionCircle}
              onPress={() => navigation.navigate('Request' as never)}
            >
              <MaterialIcons name="arrow-outward" size={26} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.functionLabel}>Request</Text>
          </View>

          <View style={styles.functionItem}>
            <TouchableOpacity
              style={styles.functionCircle}
              onPress={() => console.log('Pay pressed')}
            >
              <Feather name="credit-card" size={26} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.functionLabel}>Pay</Text>
          </View>

          <View style={styles.functionItem}>
            <TouchableOpacity
              style={styles.functionCircle}
              onPress={() => console.log('Create Payment pressed')}
            >
              <Feather name="plus-circle" size={26} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.functionLabel}>Create</Text>
          </View>

          <View style={styles.functionItem}>
            <TouchableOpacity
              style={styles.functionCircle}
              onPress={() => navigation.navigate('History' as never)}
            >
              <MaterialIcons name="history" size={26} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.functionLabel}>History</Text>
          </View>

          <View style={styles.functionItem}>
            <TouchableOpacity
              style={styles.functionCircle}
              onPress={() => console.log('Analytics pressed')}
            >
              <MaterialIcons name="bar-chart" size={26} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.functionLabel}>Analytics</Text>
          </View>
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.activityTitle}>Activity</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('History' as never)}
        >
          <Text style={styles.viewAllText}>View all</Text>
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={colors.secondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsSection}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : activity.length === 0 ||
          activity.every(section => section.data.length === 0) ? (
          <View style={styles.centerContainer}>
            <Feather name="inbox" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>No transactions yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Your activity will appear here
            </Text>
          </View>
        ) : (
          <SectionList
            sections={activity}
            keyExtractor={item => item.id}
            renderItem={({ item, index, section }) => (
              <MoneyRequestCard
                ownerName={item.ownerName}
                amount={item.amount}
                requestPersonName={item.requestPersonName}
                action={item.action}
                showDivider={index < section.data.length - 1}
                handleOnPressRequestButton={() => setModalVisible(true)}
                type={item.type}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <SectionDivider title={title} />
            )}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sectionListContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  moneyFunctionSection: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  amountText: {
    color: '#1a1a1a',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '500',
  },
  swapIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 12,
    padding: 2,
  },
  functionSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginTop: 28,
    paddingHorizontal: 8,
  },
  functionItem: {
    alignItems: 'center',
    flex: 1,
  },
  functionCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderWidth: 1.5,
  },
  functionLabel: {
    fontSize: 11,
    marginTop: 8,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  activitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fafafa',
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
  },
  transactionsSection: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  sectionListContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  emptyStateText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
