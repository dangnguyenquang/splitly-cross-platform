import React from 'react';
import { View, SectionList } from 'react-native';
import CardItem from '../../components/history/HistoryCardItem';
import SectionDivider from '../../components/history/SectionDivider';
import { useNavigation } from '@react-navigation/native';

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

export function AllHistoryScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <SectionList
        sections={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item, index, section }) => (
          <CardItem
            username={item.username}
            avatarUrl={item.avatarUrl}
            time={item.time}
            amount={item.amount}
            type={item.type}
            showDivider={index < section.data.length - 1}
            onPress={() => navigation.navigate('HistoryDetailScreen' as never)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionDivider title={title} />
        )}
      />
    </View>
  );
}
