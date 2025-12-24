import React, { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CustomHeader from '../../components/header/index';
import { SCREEN_METRICS } from '@/src/constant/screensize';
import { RootStackParamList } from '@/src/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import FastImage from 'react-native-fast-image';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const [showQR, setShowQR] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.login.currentUser);

  const handleOpenPersonalInfo = () => {
    navigation.navigate('PersonalInfoDetail', {
      personalInfo: user,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <CustomHeader
        title="Account"
        rightIcon={{
          component: MaterialIcons,
          name: 'qr-code',
          size: 22,
          color: '#070707',
        }}
        onRightPress={() => setShowQR(true)}
        backgroundColor="#fff"
        titleColor="#070707"
        shadow
      />

      {/* CONTENT */}
      <View style={styles.content}>
        {/* USER INFO */}
        <TouchableOpacity
          style={styles.userRow}
          activeOpacity={0.7}
          onPress={handleOpenPersonalInfo}
        >
          <FastImage
            style={styles.avatar}
            source={{ uri: user?.userImage }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          <MaterialIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        {/* UPGRADE */}
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>
            ⭐ Upgrade plan to unlock more
          </Text>
          <Text style={styles.upgradeDesc}>
            Enjoy all the benefits and explore more
          </Text>
        </View>
      </View>

      {/* QR BOTTOM SHEET */}
      <Modal
        transparent
        animationType="slide"
        visible={showQR}
        onRequestClose={() => setShowQR(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowQR(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>My QR Code</Text>

            <View style={styles.qrWrapper}>
              <Image
                source={{
                  uri:
                    user?.userImage ||
                    'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Example',
                }}
                style={styles.qrImage}
              />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  userEmail: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  upgradeCard: {
    backgroundColor: '#F4B400',
    borderRadius: 12,
    padding: 16,
  },

  upgradeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  upgradeDesc: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },

  qrWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },

  qrImage: {
    width: SCREEN_METRICS.width * 0.65,
    height: SCREEN_METRICS.width * 0.65,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 24,
  },

  saveButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F4B400',
    borderRadius: 24,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },

  saveText: {
    color: '#F4B400',
    fontWeight: '600',
  },

  shareButton: {
    flex: 1,
    backgroundColor: '#F4B400',
    borderRadius: 24,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
  },

  shareText: {
    color: '#000',
    fontWeight: '600',
  },
});
