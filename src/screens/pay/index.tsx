import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import CustomHeader from '../../components/header/index';
import SectionDivider from '../../components/history/SectionDivider';
import { colors } from '../../constant/theme';
import Divider from '@/src/components/request/Divider';
import MoneyRequestCard from '@/src/components/request/RequestCard';
import CustomButton from '../../components/CustomButton';
import { getPayDebt, sendCheckPaymentRemindMessage } from '@/src/api/debt.api';
import { ActivityItem } from '../home';
import Feather from '@react-native-vector-icons/feather';

const { width } = Dimensions.get('window');

export default function PayScreen() {
  const navigation = useNavigation();

  // --- STATE ---
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderMessage, setReminderMessage] = useState('');

  const [selectedTransaction, setSelectedTransaction] = useState<ActivityItem | null>(null);
  const [sendingReminder, setSendingReminder] = useState(false)

  const currentUser = useSelector(
    (state: any) => state.auth.login.currentUser,
  );

  const groupByDate = useCallback((items: any[]): any[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayItems: any[] = [];
    const yesterdayItems: any[] = [];
    const olderItems: any[] = [];

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

    const sections: any[] = [];
    if (todayItems.length > 0) sections.push({ title: 'Today', data: todayItems });
    if (yesterdayItems.length > 0) sections.push({ title: 'Yesterday', data: yesterdayItems });
    if (olderItems.length > 0) sections.push({ title: 'Older', data: olderItems });

    return sections;
  }, []);

  const transformPayData = useCallback((payDebts: any[]) => {
    const allActivities: any[] = [];
    const currentUserId = currentUser?.userId;

    payDebts.forEach((debt, index) => {

      if (debt.debtor.userId === currentUserId) {
        allActivities.push({
          id: `pay-${debt.creditor.userId}-${index}-${debt.userDebtId}`,
          requestPersonName: debt.creditor.fullName,
          requestPersonAvatar: debt.creditor.userImage || '',
          amount: `${debt.amount.toLocaleString('vi-VN')}`,
          owner: 'You',
          ownerAvatar: currentUser?.userImage || '',
          timestamp: new Date(debt.createdAt),
          type: 'pay',
          userDebtId: debt.userDebtId,
          rawAmount: debt.amount,
          paymentVerificationReminderAt: debt.paymentVerificationReminderAt
        });
      }
    });

    allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return allActivities;
  }, [currentUser]);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        setLoading(true);
        const response = await getPayDebt(false);
        const transformedData = transformPayData(response || []);
        const groupedData = groupByDate(transformedData);
        setActivity(groupedData);
      } catch (error) {
        console.error('Error fetching pay debts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDebts();
    }
  }, [currentUser, transformPayData, groupByDate]);

  const handleTransactionPress = (item: ActivityItem) => {
    setSelectedTransaction(item);
    setModalVisible(true);
  };

  const canSendReminder = (): boolean => {
    if (!selectedTransaction) return false;
    const reminderTime = selectedTransaction.paymentVerificationReminderAt;
    if (!reminderTime) return true;

    const lastReminderDate = new Date(reminderTime);
    const now = new Date();
    const hoursSinceLastReminder = (now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastReminder >= 12;
  };

  const getTimeUntilNextReminder = (): string => {
    if (!selectedTransaction || !selectedTransaction.paymentVerificationReminderAt) return '';
    const lastReminderDate = new Date(selectedTransaction.paymentVerificationReminderAt);
    const now = new Date();
    const hoursSinceLastReminder = (now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, 12 - hoursSinceLastReminder);

    if (hoursRemaining === 0) return '';
    const hours = Math.floor(hoursRemaining);
    const minutes = Math.floor((hoursRemaining - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const handleConfirmAction = async () => {
    if (!selectedTransaction || !selectedTransaction.userDebtId) {
      return;
    }

    if (!canSendReminder()) {
      Alert.alert("Notice", `You can send another reminder in ${getTimeUntilNextReminder()}`);
      return;
    }

    try {
      setSendingReminder(true);
      await sendCheckPaymentRemindMessage(
        Number(selectedTransaction.userDebtId),
        reminderMessage || `Please verify my payment of ${selectedTransaction.amount}`
      );

      setModalVisible(false);
      setSuccessModalVisible(true);

    } catch (error) {
      console.error('Error sending reminder:', error);
      Alert.alert("Error", `Failed to send reminder. Please try again.`)
    } finally {
      setSendingReminder(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="Pay"
        onLeftPress={() => navigation.goBack()}
        backgroundColor={colors.background}
        titleColor="#050404ff"
        leftIcon={{
          type: "icon",
          component: MaterialIcons,
          name: 'arrow-back',
          size: 28,
          color: '#000000ff',
        }}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
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
              ownerAvatar={item.ownerAvatar}
              showDivider={index < section.data.length - 1}
              handleOnPressRequestButton={() => handleTransactionPress(item)}
              type={item.type}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionDivider title={title} />
          )}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Feather name="inbox" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                No pay found.
              </Text>
            </View>
          }
        />
      )}

      {/* <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: '#FFC107' }]}
          onPress={() => setRefreshKey(prev => prev + 1)}
        >
          <MaterialIcons name="refresh" size={24} color="#000" />
        </TouchableOpacity>
      </View> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontSize: 24, fontWeight: '600', alignSelf: 'center', padding: 20 }}>
                Pay Details
              </Text>
              <Divider />

              <View style={styles.amountBox}>
                <Text style={{ fontSize: 16 }}>Amount</Text>
                <Text style={{ fontSize: 40 }}>
                  <Feather name="dollar-sign" size={40} color="#1a1a1a" />
                  {selectedTransaction?.amount || '0'}
                </Text>
              </View>

              <SectionDivider title={'Request to'} />

              <View style={styles.userContainer}>
                <View style={styles.avatar}>
                  <Image
                    source={{ uri: selectedTransaction?.requestPersonAvatar || '' }}
                    style={styles.avatarImage}
                  />
                </View>
                <View>
                  <Text style={{ color: 'black', fontWeight: 'bold' }}>
                    {selectedTransaction?.requestPersonName || 'User Name'}
                  </Text>
                  {/* <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>
                    {selectedTransaction?.creditorEmail || 'No email info'}
                  </Text> */}
                </View>
              </View>

              <Divider />

              <View style={{ padding: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 24 }}>
                  Notes (Optional)
                </Text>
                <Text style={styles.noteBox}>
                  <TextInput
                    value={reminderMessage}
                    onChangeText={setReminderMessage}
                    style={styles.notesInput}
                    multiline
                    editable={canSendReminder()}
                    placeholder="Enter reminder message..."
                    textAlignVertical="top"
                  />
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={'Cancel'}
                  width={180}
                  height={54}
                  type="secondary"
                  onPress={() => setModalVisible(false)}
                />
                <CustomButton
                  title={sendingReminder ? 'Sending...' : 'Remind'}
                  width={180}
                  height={54}
                  onPress={handleConfirmAction}
                  disabled={sendingReminder}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- SUCCESS MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSuccessModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.successModalView}>
              <View style={styles.checkIconContainer}>
                <MaterialIcons name="check" size={30} color={'#000000ff'} />
              </View>
              <Text style={styles.successText}>
                Reminder sent successfully!
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
  header: {
    fontSize: 24,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: width,
    height: 690,
    backgroundColor: 'white',
    shadowColor: '#ffececff',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    position: 'relative',
  },
  amountBox: {
    width: 380,
    height: 137,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    margin: 24,
    backgroundColor: '#F5F5F5',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    margin: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 28,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  noteBox: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 87,
    borderRadius: 10,
    padding: 20,
    textAlignVertical: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  successModalView: {
    width: width,
    backgroundColor: 'white',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 30,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  checkIconContainer: {
    height: 85,
    width: 85,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: 'black',
  },
  successText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 32,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 300
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