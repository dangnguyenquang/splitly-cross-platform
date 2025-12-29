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
import { ConsensusPayment } from '@/src/types';
import Feather from '@react-native-vector-icons/feather';
import { markConsensusDecline, markConsensusSuccess } from '@/src/api/payment.api';
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

  const [consensusPayments, setConsensusPayments] = useState<ConsensusPayment[]>(
    payment.consensusPayments ?? []
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

  const isCurrentUserPayer = payment.user.userId === currentUser.userId;
  const acceptedCountTotal = consensusPayments.filter(
    c => c.processAccepted || c.successAccepted
  ).length;
  const totalParticipants = consensusPayments.length;
  const disableSplit = acceptedCountTotal !== totalParticipants;

  /** ---------------- STATE ---------------- */
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newAmount, setNewAmount] = useState<string>('');

  const openEditModal = (item: any) => {
    if (!isCurrentUserPayer) return;
    setEditingItem(item);
    setNewAmount(String(item.amount));
  };

  const closeModal = () => {
    setEditingItem(null);
    setNewAmount('');
  };

  const saveAmount = () => {
    console.log('Update item', editingItem.itemId, newAmount);
    closeModal();
  };
  /** ----------- Accept / Decline handlers ----------- */
  const handleAccept = async () => {
    try {
      await markConsensusSuccess(payment.paymentId,token);
      // setConsensusPayments(prev =>
      //   prev.map(c =>
      //     c.userId === userId ? { ...c, successAccepted: true, processAccepted: true } : c
      //   )
      // );
      Alert.alert('Success', 'Payment accepted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to accept payment');
    }
  };

  const handleDecline = async () => {
    try {
      await markConsensusDecline(payment.paymentId, token);
      // setConsensusPayments(prev =>
      //   prev.map(c =>
      //     c.userId === userId ? { ...c, successAccepted: false, processAccepted: false } : c
      //   )
      // );
      Alert.alert('Success', 'Payment declined successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to decline payment');
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
            data={payment.items}
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

        {/* Action buttons */}
        {payment.status !== 'success' && (
          isCurrentUserPayer ? (
            <View style={styles.actionRow}>
              <CustomButton
                title="Cancel"
                width={SCREEN_WIDTH * 0.45}
                type="secondary"
                onPress={() => console.log('Cancel payment')}
              />
              <CustomButton
                title="Split"
                width={SCREEN_WIDTH * 0.45}
                onPress={() => console.log('Split payment')}
                disabled={disableSplit}
              />
            </View>
          ) : (
            <View style={styles.actionRow}>
              <CustomButton
                title="Decline"
                width={SCREEN_WIDTH * 0.45}
                type="secondary"
                onPress={() => {
                  handleDecline();
                }}
              />
              <CustomButton
                title="Accept"
                width={SCREEN_WIDTH * 0.45}
                onPress={() => {
                  handleAccept();
                }}
              />
            </View>
          )
        )}

        {/* Image */}
        {payment.imageUrl && (
          <Image source={{ uri: payment.imageUrl }} style={styles.coverImage} />
        )}
      </ScrollView>

      {/* Edit Amount Modal */}
      <Modal transparent visible={!!editingItem} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Item Amount</Text>
            <TextInput
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
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
