import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

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
              className={`text-[16px] font-semibold ${danger ? 'text-red-500' : 'text-black'}  text-center`}
            >
              {title}
            </Text>
          </View>

          <Text className="text-[13px] text-gray-500 text-center mt-2 leading-5">
            {description}
          </Text>

          <View className="flex-row mt-5">
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              className="flex-1 border border-gray-200 rounded-full py-3 items-center mr-2"
            >
              <Text className="text-[14px] text-black font-semibold">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.85}
              className={`flex-1 rounded-full py-3 items-center ml-2 bg-[#F4B400]
              `}
            >
              <Text
                className={`text-[14px] font-semibold text-black`}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
