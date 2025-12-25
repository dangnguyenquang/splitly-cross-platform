import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import AccountTopBar from '@/src/components/account/AccountTopBar';
import MenuList, {
  ACCOUNT_MENU,
  AccountMenuKey,
} from '@/src/components/account/MenuList';
import QrBottomSheet from '@/src/components/account/QrBottomSheet';
import UpgradeCard from '@/src/components/account/UpgradeCard';
import UserInfoRow from '@/src/components/account/UserInfoRow';
import { logOutFail, logOutStart, logOutSuccess } from '@/src/store/authSlice';
import { RootState } from '@/src/store/store';
import type { RootStackParamList } from '@/src/types';
import ConfirmBottomSheet from '@/src/components/modal/confirm';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const [showQR, setShowQR] = useState(false);
  const dispatch = useDispatch();
  const qrValue = useMemo(() => user?.email ?? 'splitly', [user?.email]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const openPersonal = () => {
    navigation.navigate('PersonalInfoDetail', { personalInfo: user });
  };
  const navigate = useNavigation<NavigationProp>();

  const onSelectMenu = (key: AccountMenuKey) => {
    switch (key) {
      case 'personal':
        openPersonal();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    dispatch(logOutStart());
    try {
      setShowLogoutConfirm(false)
      dispatch(logOutSuccess());
    } catch (error) {
      console.log('err', error);
      dispatch(logOutFail());
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AccountTopBar
          title="Account"
          left={
            <Image
              source={require('@/assets/logo.png')}
              style={{ width: 40, height: 40 }}
            />
          }
        />

        <ScrollView className="px-4 pb-8" showsVerticalScrollIndicator={false}>
          <UserInfoRow
            fullName={user?.fullName}
            email={user?.email}
            avatarUrl={user?.userImage}
            onPress={openPersonal}
            onPressQR={() => setShowQR(true)}
          />

          <UpgradeCard
            title="Upgrade Plan to Unlock More!"
            desc="Enjoy all the benefits and explore more possibilities"
            onPress={() => {
              // navigation.navigate('UpgradePlan');
            }}
          />

          <MenuList items={ACCOUNT_MENU} onSelect={onSelectMenu} />

          <Pressable
            className="mt-4 flex-row items-center px-4 py-4 bg-white rounded-2xl"
            onPress={() => setShowLogoutConfirm(true)}
          >
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text className="ml-3 text-[14px] text-[#EF4444] font-semibold">
              Logout
            </Text>
          </Pressable>
        </ScrollView>
      </ScrollView>

      <QrBottomSheet
        visible={showQR}
        onClose={() => setShowQR(false)}
        qrValue={qrValue}
      />
      <ConfirmBottomSheet
        visible={showLogoutConfirm}
        title="Logout"
        description="Are you sure want to logout?"
        cancelText="Cancel"
        confirmText="Yes, Logout"
        danger
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}
