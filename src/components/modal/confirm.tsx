import CustomButton from '@/src/components/CustomButton';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type ConfirmBottomSheetProps = {
  visible: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  disableBackdropClose?: boolean;
};

export default function ConfirmBottomSheet({
  visible,
  title = 'Confirm',
  description = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
  disableBackdropClose = false,
}: Readonly<ConfirmBottomSheetProps>) {
  const handleBackdropPress = () => {
    if (!disableBackdropClose) onCancel();
  };

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
        <Pressable
          className="bg-white rounded-t-3xl px-5 pt-4 pb-7"
          onPress={() => {}}
        >
          {/* Handle */}
          <View className="items-center">
            <View className="w-12 h-1.5 rounded-full bg-gray-200 mb-3" />
            <Text
              className={`text-2xl font-semibold ${danger ? 'text-red-500' : 'text-black'}  text-center`}
            >
              {title}
            </Text>
          </View>
          <View className="border-t border-slate-100 my-5"></View>
          <Text className="text-lg text-slate-800 font-semibold text-center mt-2 leading-5">
            {description}
          </Text>

          {/* Buttons */}
          <View className="flex-row mt-5">
            {/* Cancel */}
            <View className="flex-1 mr-2">
              <CustomButton
                title={cancelText}
                onPress={onCancel}
                type="secondary"
                width="100%"
                height={48}
                borderRadius={999}
                style={{ marginVertical: 0 }}
              />
            </View>

            {/* Confirm */}
            <View className="flex-1 ml-2">
              <CustomButton
                title={confirmText}
                onPress={onConfirm}
                type="primary"
                width="100%"
                height={48}
                borderRadius={999}
                style={{ marginVertical: 0 }}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
