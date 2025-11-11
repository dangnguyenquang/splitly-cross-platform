import React from 'react';
import {StyleSheet, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import HistoryTopTabs from '../../navigation/historyTopTab';
import { colors } from '../../constant/theme';


export default function TransactionHistoryScreen() {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{flex:1}}>
      <CustomHeader
        title="Transaction History"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Notifications pressed')}
        backgroundColor= {colors.background}
        titleColor="#050404ff"
        leftIcon={{ component: MaterialIcons, name: 'arrow-back', size: 28, color: '#000000ff' }}
        rightIcon={{ component: MaterialIcons, name: 'search', size: 28, color: '#000000ff' }}
      />
      <View style={{ flex: 1 }}>
        <HistoryTopTabs />
      </View>
    </SafeAreaView>
  );
}

