import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/constant/theme';
import Header from '@/src/components/Header';
import { SCREEN_WIDTH } from '@/src/utils/dimension';
import { useSelector } from 'react-redux';
import CustomButton from '@/src/components/CustomButton';
import { ConsensusPayment, PaymentItem } from '@/src/types';
import Feather from '@react-native-vector-icons/feather';
import { markConsensusDecline, markConsensusSuccess, splitBill } from '@/src/api/payment.api';
import { RootState } from '@/src/store/store';

type PaymentDetailRouteProp = RouteProp<
  {
    PaymentDetail: {
      payment: any;
      group: any;
    };
  },
  'PaymentDetail'
>;

const PaymentDetailScreen: React.FC = () => {
  const route = useRoute<PaymentDetailRouteProp>();
  const navigation = useNavigation();
  const { payment } = route.params;

  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );

  const [items, setItems] = useState<PaymentItem[]>([]);

  const [consensusPayments, setConsensusPayments] = useState<ConsensusPayment[]>(
    payment.consensusPayments ?? []
  );
  const currentUserConsensus = consensusPayments.find(
    c => c.userId === currentUser.userId
  );

  const isParticipant = consensusPayments.some(
    c => c.userId === currentUser.userId
  );
  useEffect(() => {
    // Ensure payer is included once
    if (!consensusPayments.some(c => c.userId === payment.user.userId)) {
      setConsensusPayments(prev => [
        ...prev,
        {
          userId: payment.user.userId,
          fullName: payment.user.fullName,
          email: currentUser.email,
          phone: currentUser.phone,
          processAccepted: true,
          successAccepted: true,
        },
      ]);
    }
  }, []);
  useEffect(() => {
    if (payment?.items) {
      setItems(payment.items);
    }
  }, [payment]);

  const isCurrentUserPayer = payment.user.userId === currentUser.userId;
  const acceptedCountTotal = consensusPayments.filter(
    c => c.processAccepted || c.successAccepted
  ).length;
  const totalParticipants = consensusPayments.length;
  const disableSplit = acceptedCountTotal !== totalParticipants;
  const isReadyToSplit = payment.status === 'ready_to_split';

  const canSplit =
    isCurrentUserPayer &&
    !isReadyToSplit &&
    !disableSplit;

  const isAccepted = currentUserConsensus?.successAccepted === true;
  const isDeclined =
    currentUserConsensus?.processAccepted === false &&
    currentUserConsensus?.successAccepted === false;

  

  /** ---------------- STATE ---------------- */
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newAmount, setNewAmount] = useState<string>('');

  const openEditModal = (item: PaymentItem) => {
    if (!isCurrentUserPayer || payment.status !== 'waiting') return;
    setEditingItem(item);
    setNewAmount(String(item.priceQuotation));
  };

  const closeModal = () => {
    setEditingItem(null);
    setNewAmount('');
  };

  const saveAmount = () => {
    if (!editingItem) return;

    const value = Number(newAmount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid amount');
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.itemId === editingItem.itemId
          ? { ...item, priceQuotation: value }
          : item,
      ),
    );

    closeModal();
  };
  /** ----------- Accept / Decline handlers ----------- */
  const handleAccept = async () => {
    try {
      await markConsensusSuccess(payment.paymentId,token);
      Alert.alert('Success', 'Payment accepted successfully');
      navigation.goBack()
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to accept payment');
    }
  };

  const handleDecline = async () => {
    try {
      await markConsensusDecline(payment.paymentId, token);

      Alert.alert('Success', 'Payment declined successfully');
      navigation.goBack()
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to decline payment');
    }
  };
  const handleSplit = async () => {
    try {
      await splitBill(payment.paymentId, token);
      Alert.alert('Success', 'Successfully splitbill');
      navigation.goBack()
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Fail to split bill');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment Detail" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{payment.title}</Text>

        {/* Status */}
        <View style={styles.statusRow}>
          <Text style={styles.label}>Status</Text>
          <View
            style={[
              styles.statusBadge,
              payment.status === 'success' ? styles.successBg : styles.processingBg,
            ]}
          >
            <Text style={styles.statusText}>{payment.status?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.amountCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="dollar-sign" size={24} color="#1a1a1a" />
            <Text style={[styles.amount, { marginLeft: 8 }]}>{payment.estimatedAmount}</Text>
          </View>
        </View>

        {/* Paid by */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Paid by</Text>
          <Text style={styles.value}>{payment.user.fullName}</Text>
        </View>

        {/* Items */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Items</Text>
          <FlatList
            data={items}
            keyExtractor={item => `item-${item.itemId}`}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.itemName} x{item.quantity}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={!isCurrentUserPayer}
                  onPress={() => openEditModal(item)}
                >
                  <Text
                    style={[styles.itemAmount, isCurrentUserPayer && styles.editableAmount]}
                  >
                    {item.priceQuotation}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Participants */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Participants</Text>
          {consensusPayments.map((c, index) => (
            <View key={`${c.userId}-${index}`} style={styles.consensusRow}>
              <Text style={styles.value}>{c.fullName}</Text>
              <View
                style={[
                  styles.consensusBadge,
                  c.processAccepted || c.successAccepted ? styles.acceptedBg : styles.pendingBg,
                ]}
              >
                <Text style={styles.consensusText}>
                  {c.processAccepted || c.successAccepted ? 'Accepted' : 'Pending'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {payment.status =='waiting' && isParticipant && (
          <>
            {isCurrentUserPayer && (
              <View style={styles.actionRow}>
                <CustomButton
                  title="Cancel"
                  width={SCREEN_WIDTH * 0.45}
                  type="secondary"
                  onPress={() => console.log('Cancel payment')}
                />

                <CustomButton
                  title="Ready to split"
                  width={SCREEN_WIDTH * 0.45}
                  onPress={handleSplit}
                  disabled={!canSplit}
                />
              </View>
            )}

            {!isCurrentUserPayer && (
              <View style={styles.actionRow}>
                <CustomButton
                  title="Decline"
                  width={SCREEN_WIDTH * 0.45}
                  type="secondary"
                  onPress={handleDecline}
                  disabled={isDeclined}
                />

                <CustomButton
                  title="Accept"
                  width={SCREEN_WIDTH * 0.45}
                  onPress={handleAccept}
                  disabled={isAccepted}
                />
              </View>
            )}
          </>
        )}





        {/* Image */}
        {payment.imageUrl && (
          <Image source={{ uri: payment.imageUrl }} style={styles.coverImage} />
        )}
      </ScrollView>

      {/* Modal */}
      <Modal transparent visible={!!editingItem&& payment.status === 'waiting'} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TextInput
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={closeModal}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveAmount}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentDetailScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 14, color: colors.secondary, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  successBg: { backgroundColor: '#22C55E' },
  processingBg: { backgroundColor: '#F59E0B' },
  amountCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 14, marginBottom: 16 },
  amount: { fontSize: 22, fontWeight: '700' },
  sectionCard: { borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  value: { fontSize: 14 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#EEE' },
  itemName: { fontSize: 14 },
  itemAmount: { fontSize: 14, fontWeight: '600' },
  editableAmount: { color: colors.primary, textDecorationLine: 'underline' },
  consensusRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  consensusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  consensusText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  acceptedBg: { backgroundColor: '#22C55E' },
  pendingBg: { backgroundColor: '#9CA3AF' },
  actionRow: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between' },
  coverImage: { width: SCREEN_WIDTH * 0.9, height: 180, borderRadius: 14, alignSelf: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20 },
  cancelText: { color: colors.secondary },
  saveText: { color: colors.primary, fontWeight: '700' },
});
