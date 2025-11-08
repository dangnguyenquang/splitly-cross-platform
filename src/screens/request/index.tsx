import React from 'react';
import {SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../Constant/theme';
import SectionDivider from '../../components/history/SectionDivider';
import MoneyRequestCard from '../../components/request/requestCard';
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

export default function RequestScreen() {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{flex:1}}>
      <CustomHeader
        title="Request"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Notifications pressed')}
        backgroundColor= {colors.background}
        titleColor="#050404ff"
        leftIcon={{ component: MaterialIcons, name: 'arrow-back', size: 28, color: '#000000ff' }}
      />
      <SectionList
        sections={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index, section }) => (
            <MoneyRequestCard ownerName="Tien Loc" amount="194,000 VND" requestPersonName='Hoai Bao'
                showDivider={index < section.data.length - 1}/>
        )}
        renderSectionHeader={({ section: { title } }) => (
            <SectionDivider title={title} />
        )}
       />
      {/* Floating Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: '#FFC107' }]}
          onPress={() => console.log('Request pressed')}>
          <MaterialIcons name="qr-code-scanner" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => console.log('Add pressed')}>
          <MaterialIcons name="add" size={28} color="#000" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
  },
  dividerSection:{
    flexDirection:'row',
    alignItems:'center',
  },
  container:{
    paddingRight:24,
    paddingLeft:24,
    marginBottom:10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },
});
