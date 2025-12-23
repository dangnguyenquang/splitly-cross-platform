import React from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header/index';
import { colors } from '../../constant/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import SectionDivider from '../../components/history/SectionDivider';
import NotificationItem from '../../components/notifications/NotificationCard';
const DATA = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        username: 'Loc Nguyen',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        time: '09:41 PM',
        amount: '100000 VND',
        type: 'Pay',
      },
      {
        id: '2',
        username: 'Minh Tran',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        time: '03:20 PM',
        amount: '250000 VND',
        type: 'Receive',
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '3',
        username: 'Khoa Le',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        time: '07:55 PM',
        amount: '50000 VND',
        type: 'Pay',
      },
      {
        id: '4',
        username: 'Nhi Pham',
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        time: '02:15 PM',
        amount: '75000 VND',
        type: 'Receive',
      },
      {
        id: '5',
        username: 'Thao Dang',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        time: '11:30 AM',
        amount: '120000 VND',
        type: 'Pay',
      },
    ],
  },
  {
    title: 'A day before yesterday',
    data: [
      {
        id: '6',
        username: 'Hung Pham',
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        time: '05:10 PM',
        amount: '200000 VND',
        type: 'Receive',
      },
      {
        id: '7',
        username: 'Tuan Nguyen',
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
        time: '10:25 AM',
        amount: '90000 VND',
        type: 'Pay',
      },
    ],
  },
];
export default function NotificationScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="Notification"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Notifications pressed')}
        backgroundColor={colors.background}
        titleColor="#050404ff"
        shadow={true}
        leftIcon={{
          component: MaterialIcons,
          name: 'arrow-back',
          size: 28,
          color: '#000000ff',
        }}
        rightIcon={{
          component: MaterialIcons,
          name: 'settings',
          size: 26,
          color: '#000000ff',
        }}
      />
      <SectionList
        sections={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item, index, section }) => (
          <NotificationItem
            title="New update available"
            description="Update splitly and enjoy new features, please press to see new updates"
            time="9:45 PM"
            index={index}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionDivider title={title} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
