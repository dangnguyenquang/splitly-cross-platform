import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/constant/theme';
import Header from '@/src/components/Header';
import { SCREEN_WIDTH } from '@/src/utils/dimension';

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
  const { payment, group } = route.params;

  const acceptedCount =
    payment.consensusPayments?.filter(
      (c: any) => c.processAccepted || c.successAccepted,
    ).length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Payment Detail"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{payment.title}</Text>

        {/* Status */}
        <View style={styles.statusRow}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.status,
              payment.status === 'success' ? styles.success : styles.processing,
            ]}
          >
            {payment.status.toUpperCase()}
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.amountBox}>
          <Text style={styles.amount}>
            {payment.amount} {group?.currency || 'VND'}
          </Text>
          <Text style={styles.subAmount}>
            Estimated: {payment.estimatedAmount}
          </Text>
          <Text style={styles.subAmount}>
            Used fund: {payment.usedFundAmount}
          </Text>
        </View>

        {/* Paid by */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paid by</Text>
          <Text style={styles.value}>{payment.user.fullName}</Text>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>

          <FlatList
            data={payment.items}
            keyExtractor={item => item.itemId.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.itemName} x{item.quantity}
                </Text>
                <Text style={styles.itemAmount}>{item.amount}</Text>
              </View>
            )}
          />
        </View>

        {/* Consensus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Consensus ({acceptedCount}/{group?.numberOfMember})
          </Text>

          {payment.consensusPayments.map((c: any) => (
            <View key={c.userId} style={styles.consensusRow}>
              <Text style={styles.value}>{c.fullName}</Text>
              <Text
                style={[
                  styles.consensusStatus,
                  c.processAccepted || c.successAccepted
                    ? styles.accepted
                    : styles.pending,
                ]}
              >
                {c.processAccepted || c.successAccepted
                  ? 'Accepted'
                  : 'Pending'}
              </Text>
            </View>
          ))}
        </View>

        {/* Note */}
        {payment.paymentRequestNote && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Note</Text>
            <Text style={styles.value}>{payment.paymentRequestNote}</Text>
          </View>
        )}
        <Image source={{ uri: payment.imageUrl }} style={styles.coverImage} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentDetailScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: colors.secondary,
    marginRight: 8,
  },

  status: {
    fontSize: 14,
    fontWeight: '600',
  },

  success: {
    color: '#22C55E',
  },

  processing: {
    color: '#F59E0B',
  },

  amountBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },

  amount: {
    fontSize: 20,
    fontWeight: '700',
  },

  subAmount: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 4,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  value: {
    fontSize: 14,
    color: '#111',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },

  itemName: {
    fontSize: 14,
  },

  itemAmount: {
    fontSize: 14,
    fontWeight: '500',
  },

  consensusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  consensusStatus: {
    fontSize: 12,
    fontWeight: '600',
  },

  accepted: {
    color: '#22C55E',
  },

  pending: {
    color: '#9CA3AF',
  },
  coverImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 180,
    borderRadius: 12,
  },
});
