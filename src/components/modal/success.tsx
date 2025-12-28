import { colors } from '@/src/constant/theme';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type SuccessModalProps = {
  visible: boolean;
  message?: string;
  onClose: () => void;
  disableBackdropClose?: boolean;
};

export default function SuccessModal({
  visible,
  message = 'Success!',
  onClose,
  disableBackdropClose = false,
}: Readonly<SuccessModalProps>) {
  function handleBackdropPress(): void {
    if (!disableBackdropClose) onClose();
  }

  return (
    <Modal
      transparent
      animationType="slide" // ✅ trượt từ dưới lên như ConfirmBottomSheet
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={handleBackdropPress}
      >
        {/* Sheet */}
        <Pressable
          className="bg-white rounded-t-3xl px-5 pt-4 pb-8"
          onPress={() => {}}
        >
          {/* Handle giống confirm */}
          <View className="items-center">
            <View className="w-12 h-1.5 rounded-full bg-gray-200 mb-5" />

            {/* Circle */}
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 74,
                height: 74,
                borderWidth: 2,
                borderColor: '#111827',
                backgroundColor: colors.primary,
              }}
            >
              <MaterialIcons name="check" size={34} color="#111827" />
            </View>

            <Text className="mt-4 text-center text-[14px] text-neutral-700 leading-5">
              {message}
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
