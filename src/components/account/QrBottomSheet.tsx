import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SCREEN_METRICS } from '@/src/constant/screensize';

type Props = {
  visible: boolean;
  onClose: () => void;
  qrValue: string;
};

export default function QrBottomSheet({ visible, onClose, qrValue }: Readonly<Props>) {
  const data = encodeURIComponent(qrValue || 'splitly');

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable className="bg-white rounded-t-3xl px-5 pt-4 pb-7" onPress={() => {}}>
          <View className="items-center">
            <View className="w-12 h-1.5 rounded-full bg-gray-200 mb-3" />
            <Text className="text-[16px] font-semibold text-black">My QR Code</Text>
          </View>

          <View className="items-center my-5">
            <Image
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${data}` }}
              style={styles.qrImage}
            />
          </View>

          <View className="flex-row">
            <TouchableOpacity className="flex-1 border border-[#F4B400] rounded-full py-3 items-center mr-2">
              <Text className="text-[#F4B400] font-semibold">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-[#F4B400] rounded-full py-3 items-center ml-2">
              <Text className="text-black font-semibold">Share</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  qrImage: {
    width: SCREEN_METRICS.width * 0.62,
    height: SCREEN_METRICS.width * 0.62,
    borderRadius: 14,
  },
});
