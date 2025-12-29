import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../../constant/theme'; // Assuming this exists
import { formatDate } from '@/src/utils/date';
import Feather from '@react-native-vector-icons/feather';

interface MoneyRequestCardProps {
  ownerName?: string;
  amount?: string;
  action?: string;
  showDivider?: boolean;
  requestPersonName?: string;
  handleOnPressRequestButton?: () => void;
  handleOnPressConfirmButton?: () => void;
  type: 'pay' | 'receive';
  ownerAvatar?: string;
  requestPersonAvatar?: string;
  createdAt?: Date
}

const MoneyRequestCard: React.FC<MoneyRequestCardProps> = ({
  ownerName = 'Lucian Nguyen',
  requestPersonName = 'Lucian Nguyen',
  action = 'owes',
  amount = '194,000đ',
  handleOnPressRequestButton,
  handleOnPressConfirmButton,
  type,
  ownerAvatar,
  requestPersonAvatar,
  createdAt,
}) => {
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  const handleOpenConfirmModal = () => {
    setConfirmModalVisible(true);
  };

  const handleConfirmAction = () => {
    setConfirmModalVisible(false);
    if (handleOnPressConfirmButton) {
      handleOnPressConfirmButton();
    }
  };
  return (
    <View style={styles.cardContainer}>
      <View style={styles.infoRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatar}>
            <Image
              source={{ uri: type === "pay" ? ownerAvatar : requestPersonAvatar }}
              style={styles.avatarImage}
            />
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.headerText}>
            <Text style={styles.nameHighlight}>{ownerName}</Text>
            <Text style={styles.actionText}> {action} </Text>
            <Text style={styles.nameHighlight}>{requestPersonName}</Text>
          </Text>
          <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
        </View>

        <Text style={[
          styles.amountText,
          { color: type === 'pay' ? '#FF6B6B' : '#4CAF50' }
        ]}>
          <Feather name="dollar-sign" size={12} color={type === 'pay' ? '#FF6B6B' : '#4CAF50'} />{amount}
        </Text>
      </View>

      <View style={styles.actionRow}>
        {type === 'receive' ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleOnPressRequestButton}
            >
              <Text style={styles.secondaryButtonText}>Remind</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleOpenConfirmModal}
            >
              <Text style={styles.primaryButtonText}>Confirm Paid</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.payActionButton]}
            onPress={handleOnPressRequestButton}
          >
            <Text style={styles.primaryButtonText}>Already paid?</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isConfirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setConfirmModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <Feather name="check-circle" size={40} color={colors.primary} />
                </View>

                <Text style={styles.modalTitle}>Confirm Payment</Text>
                <Text style={styles.modalMessage}>
                  Have you received <Text style={{ fontWeight: '700' }}>{amount}</Text> from <Text style={{ fontWeight: '700' }}>{requestPersonName}</Text>?
                </Text>

                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={() => setConfirmModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalConfirmButton]}
                    onPress={handleConfirmAction}
                  >
                    <Text style={styles.modalConfirmText}>Yes, Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MoneyRequestCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  nameHighlight: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actionText: {
    color: '#888',
    fontWeight: '400',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  payActionButton: {
    backgroundColor: colors.primary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
  },
  modalConfirmButton: {
    backgroundColor: colors.primary,
  },
  modalCancelText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  modalConfirmText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});