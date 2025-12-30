import CustomHeader from '@/src/components/header/index';
import SectionDivider from '@/src/components/history/SectionDivider';
import MoneyRequestCard from '@/src/components/request/RequestCard';
import { colors } from '@/src/constant/theme';
import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { confirmDebt, getPayDebt, getReceiveDebt, sendCheckPaymentRemindMessage, sendPaymentRemindMessage } from '@/src/api/debt.api';
import Divider from '@/src/components/request/Divider';
import CustomButton from '@/src/components/CustomButton';
import { registerTokenDevice } from '@/src/api/notifee.api';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { Navigation } from '@/src/types';

export interface UserInfo {
  userId: number;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  userImage: string | null;
  roles: any;
}

export interface DebtItem {
  debtor: UserInfo;
  creditor: UserInfo;
  amount: number;
  note: string;
  createdAt: string;
  status: boolean;
  paymentReminderAt?: string,
  paymentVerificationReminderAt?: string
  userDebtId: number;
}

export interface ActivityItem {
  id: string;
  ownerName: string;
  ownerAvatar?: string;
  amount: string;
  requestPersonName: string;
  requestPersonAvatar?: string;
  action: 'owes' | 'borrowed';
  timestamp: Date;
  type: 'pay' | 'receive';
  userDebtId?: number;
  paymentReminderAt?: string;
  paymentVerificationReminderAt?: string;
  rawAmount?: number
}

export interface SectionData {
  title: string;
  data: ActivityItem[];
}


export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'pay' | 'request'>('request');
  const [selectedTransaction, setSelectedTransaction] = useState<ActivityItem | null>(null);
  const [activity, setActivity] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceView, setBalanceView] = useState<'receive' | 'pay'>('receive');
  const [totalReceive, setTotalReceive] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [reminderMessage, setReminderMessage] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);

  const currentUser = useSelector(
    (state: RootState) => state.auth.login.currentUser,
  );

  const navigation = useNavigation<Navigation>();

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
    let receiveTotal = 0;
    let payTotal = 0;

    receiveDebts.forEach((debt, index) => {
      if (debt.creditor.userId === currentUserId) {
        receiveTotal += debt.amount;
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
        payTotal += debt.amount;
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

    setTotalReceive(receiveTotal);
    setTotalPay(payTotal);

    allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return allActivities;
  }, [currentUser]);

  const fetchDebts = useCallback(async () => {
    try {
      setLoading(true);

      const [receiveDebtData, payDebtData] = await Promise.all([
        getReceiveDebt(false),
        getPayDebt(false),
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
  }, [transformDebtData, groupByDate]);

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;

      fetchDebts();
    }, [currentUser, fetchDebts])
  );

  const toggleBalanceView = () => {
    setBalanceView(prev => (prev === 'receive' ? 'pay' : 'receive'));
  };

  const displayAmount = balanceView === 'receive' ? totalReceive : totalPay;
  const displayLabel =
    balanceView === 'receive' ? 'You will receive' : 'You owe';

  const handleTransactionPress = (item: ActivityItem) => {
    setSelectedTransaction(item);
    setModalType(item.type === 'pay' ? 'pay' : 'request');

    setModalVisible(true);
  };

  const canSendReminder = (): boolean => {
    if (!selectedTransaction) return false;

    const reminderTime = modalType === 'pay'
      ? selectedTransaction.paymentVerificationReminderAt
      : selectedTransaction.paymentReminderAt;

    if (!reminderTime) return true; // No reminder sent yet

    const lastReminderDate = new Date(reminderTime);
    const now = new Date();
    const hoursSinceLastReminder = (now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastReminder >= 12;
  };

  const getTimeUntilNextReminder = (): string => {
    if (!selectedTransaction) return '';

    const reminderTime = modalType === 'pay'
      ? selectedTransaction.paymentVerificationReminderAt
      : selectedTransaction.paymentReminderAt;

    if (!reminderTime) return '';

    const lastReminderDate = new Date(reminderTime);
    const now = new Date();
    const hoursSinceLastReminder = (now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, 12 - hoursSinceLastReminder);

    if (hoursRemaining === 0) return '';

    const hours = Math.floor(hoursRemaining);
    const minutes = Math.floor((hoursRemaining - hours) * 60);

    return `${hours}h ${minutes}m`;
  };

  const handleConfirmAction = async () => {
    if (!selectedTransaction || !selectedTransaction.id) {
      console.error('No transaction selected or missing userDebtId');
      return;
    }

    if (!canSendReminder()) {
      Alert.alert("Error", `You can send another reminder in ${getTimeUntilNextReminder()}`)
      return;
    }

    try {
      setSendingReminder(true);

      if (modalType === 'pay') {
        // Send payment verification reminder
        await sendCheckPaymentRemindMessage(
          Number(selectedTransaction.userDebtId),
          reminderMessage || `Please verify my payment of ${selectedTransaction.amount}`
        );
      } else {
        // Send payment reminder
        await sendPaymentRemindMessage(
          Number(selectedTransaction.userDebtId),
          reminderMessage || `Reminder: You owe me ${selectedTransaction.amount}`
        );
      }

      setModalVisible(false);
      setSuccessModalVisible(true);

      // Refresh the debt list to get updated reminder times
      const [receiveDebtData, payDebtData] = await Promise.all([
        getReceiveDebt(),
        getPayDebt(),
      ]);

      const transformedData = transformDebtData(
        receiveDebtData || [],
        payDebtData || [],
      );

      const groupedData = groupByDate(transformedData);
      setActivity(groupedData);

    } catch (error) {
      console.error('Error sending reminder:', error);
      Alert.alert("Error", `Failed to send reminder. Please try again.`)
    } finally {
      setSendingReminder(false);
    }
  };

  const handleConfirmPayment = async (item: ActivityItem) => {
    if (item.userDebtId) {
      try {
        await confirmDebt(item.userDebtId);

        fetchDebts();
      } catch (error) {
        console.error("Failed to confirm payment", error);
      }
    }
  };

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
          type: "icon",
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
              onPress={() => navigation.navigate('Pay' as never)}
            >
              <Feather name="credit-card" size={26} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.functionLabel}>Pay</Text>
          </View>

          <View style={styles.functionItem}>
            <TouchableOpacity
              style={styles.functionCircle}
              onPress={() => navigation.navigate('QuickPayment' as never) }
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
                handleOnPressRequestButton={() => handleTransactionPress(item)}
                handleOnPressConfirmButton={() => handleConfirmPayment(item)}
                ownerAvatar={item.ownerAvatar}
                requestPersonAvatar={item.requestPersonAvatar}
                createdAt={item.timestamp}
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

      {/* Request/Pay Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>
                  {modalType === 'pay' ? 'Pay' : 'Request'}
                </Text>
                <Divider />
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Amount</Text>
                  <Text style={styles.amountValue}>
                    <Feather name="dollar-sign" size={40} color="#1a1a1a" />
                    {selectedTransaction?.amount || '0'}
                  </Text>
                  <Text style={styles.balanceText}>
                    Your available balance: <Feather name="dollar-sign" size={12} color="#999" />{totalReceive.toLocaleString('vi-VN')}
                  </Text>
                </View>
                <SectionDivider
                  title={modalType === 'pay' ? 'Pay to' : 'Request to'}
                />
                <View style={styles.userInfoContainer}>
                  <View style={styles.avatar}>
                    <Image
                      source={{ uri: modalType === "pay" ? selectedTransaction?.ownerAvatar : selectedTransaction?.requestPersonAvatar }}
                      style={styles.avatarImage}
                    />
                  </View>
                  <View>
                    <Text style={styles.userName}>
                      {modalType === 'pay'
                        ? selectedTransaction?.requestPersonName
                        : selectedTransaction?.ownerName}
                    </Text>
                    <Text style={styles.userEmail}>
                      {modalType === 'pay'
                        ? selectedTransaction?.requestPersonName?.toLowerCase().replace(' ', '.')
                        : selectedTransaction?.ownerName?.toLowerCase().replace(' ', '.')}@gmail.com
                    </Text>
                  </View>
                </View>
                <Divider />
                <View style={styles.notesContainer}>
                  <Text style={styles.notesTitle}>Message</Text>

                  <View style={styles.notesBox}>
                    <TextInput
                      value={reminderMessage}
                      onChangeText={setReminderMessage}
                      style={styles.notesInput}
                      multiline
                      editable={canSendReminder()}
                      placeholder="Enter reminder message..."
                      textAlignVertical="top"
                    />
                  </View>

                  {!canSendReminder() && (
                    <Text style={styles.reminderWarning}>
                      You can send another reminder in {getTimeUntilNextReminder()}
                    </Text>
                  )}
                </View>

                <View style={styles.modalButtons}>
                  <CustomButton
                    title="Cancel"
                    width={150}
                    height={45}
                    type="secondary"
                    onPress={() => setModalVisible(false)}
                  />
                  <CustomButton
                    title={sendingReminder ? 'Sending...' : (modalType === 'pay' ? 'Send Reminder' : 'Send Reminder')}
                    width={150}
                    height={45}
                    onPress={handleConfirmAction}
                    disabled={sendingReminder || !canSendReminder()}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSuccessModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.successModalView}>
              <View style={styles.successIcon}>
                <MaterialIcons name="check" size={40} color="#000000ff" />
              </View>
              <Text style={styles.successText}>
                Your {modalType === 'pay' ? 'payment verification' : 'payment'} reminder has been sent successfully.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  notesInput: {
    minHeight: 80,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    padding: 20,
  },
  amountBox: {
    width: '90%',
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    margin: 24,
    backgroundColor: '#F5F5F5',
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amountValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1a1a1a',
    marginVertical: 8,
  },
  balanceText: {
    fontSize: 12,
    color: '#999',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    margin: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    color: '#1a1a1a',
    fontWeight: '700',
    fontSize: 16,
  },
  userEmail: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
  },
  notesContainer: {
    padding: 24,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  notesBox: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    minHeight: 87,
    borderRadius: 10,
    padding: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
  },
  modalButtons: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  successModalView: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successIcon: {
    height: 85,
    width: 85,
    borderRadius: 42.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: '#000',
  },
  successText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 32,
  },
  reminderWarning: {
    marginTop: 12,
    fontSize: 13,
    color: '#ff6b6b',
    fontWeight: '600',
  },
});
