import { colors } from '@/src/constant/theme';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import CustomButton from '@/src/components/CustomButton';

type ErrorModalProps = {
  visible: boolean;
  message?: string;

  cancelText?: string;
  onCancel: () => void;

  confirmText?: string;
  onConfirm?: () => void;

  disableBackdropClose?: boolean;
};

export default function ErrorModal({
  visible,
  message = 'Something went wrong',
  cancelText = 'Cancel',
  confirmText = 'Retry',
  onCancel,
  onConfirm,
  disableBackdropClose = false,
}: Readonly<ErrorModalProps>) {
  function handleBackdropPress() {
    if (!disableBackdropClose) onCancel();
  }

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
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
          <View className="items-center">
            {/* Handle */}
            <View className="w-12 h-1.5 rounded-full bg-gray-200 mb-5" />

            {/* Circle icon – giữ style giống success */}
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
              <MaterialIcons
                name="error-outline"
                size={34}
                color="#111827"
              />
            </View>

            {/* Message */}
            <Text className="mt-4 text-center text-[14px] text-neutral-700 leading-5">
              {message}
            </Text>

            {/* Actions – 2 buttons ngang */}
            <View className="mt-6 w-full flex-row gap-3">
              <CustomButton
                title={cancelText}
                onPress={onCancel}
                type="secondary"
                width="50%"
                height={48}
                borderRadius={999}
                style={{ marginVertical: 0 }}
              />

              {onConfirm && (
                <CustomButton
                  title={confirmText}
                  onPress={onConfirm}
                  type="primary"
                  width="50%"
                  height={48}
                  borderRadius={999}
                  style={{ marginVertical: 0 }}
                />
              )}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
