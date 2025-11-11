import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../constant/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import Divider from '../../components/request/divider';
import Clipboard from '@react-native-clipboard/clipboard';
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

export function HistoryDetailScreen() {
  const navigation = useNavigation();
  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', `${label} copied to clipboard.`);
  };
  return (
    <SafeAreaView>
      <CustomHeader
        title="Pay"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => {}}
        backgroundColor={colors.primary}
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
          name: 'more-vert',
          size: 28,
          color: '#000000ff',
        }}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: 'center',
            gap: 20,
            height: 300,
            backgroundColor: colors.primary,
          }}
        >
          <View style={styles.avatar}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=7' }}
              style={styles.avatar}
            />
          </View>
          <Text style={{ fontSize: 40 }}>100,000 VND</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            Tien Loc vuive
          </Text>
          <Text style={{ fontSize: 20 }}>loc@gmail.com</Text>
        </View>
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.leftText}>You have paid</Text>
            <Text style={styles.rightText}>100000vnd</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.leftText}>To</Text>
            <Text style={styles.rightText}>Lionel Messi</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.leftText}>Email</Text>
            <Text style={styles.rightText}>loc@gmail.com</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.leftText}>Date</Text>
            <Text style={styles.rightText}>Sep 20, 2025 09:41 AM</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.leftText}>Transaction ID</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.rightText}>122819289100000</Text>
              <TouchableOpacity
                onPress={() => handleCopy('122819289100000', 'Transaction ID')}
              >
                <MaterialIcons name="content-copy" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reference ID */}
          <View style={styles.textContainer}>
            <Text style={styles.leftText}>Reference ID</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.rightText}>HUBWBWWH</Text>
              <TouchableOpacity
                onPress={() => handleCopy('HUBWBWWH', 'Reference ID')}
              >
                <MaterialIcons name="content-copy" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Divider />
        <View
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            paddingTop: 18,
          }}
        >
          <Text style={styles.leftText}>Notes</Text>
          <Text style={styles.rightText}>Pay for dinner</Text>
        </View>
        <View style={{ padding: 24, alignSelf: 'center' }}>
          <CustomButton
            title="View Receipt"
            type="secondary"
            width={400}
            height={50}
            borderRadius={30}
            onPress={() => navigation.navigate('ReceiptScreen' as never)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
  },
  avatar: {
    width: 106,
    height: 106,
    borderRadius: 50,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  leftText: {
    color: colors.secondary,
    fontSize: 20,
  },
  rightText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  copyText: {
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
  },
});
