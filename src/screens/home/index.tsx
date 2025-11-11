import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header';
import { colors } from '../../constant/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [transactions, setTransaction] = useState<any>([])
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="Splitly"
        onLeftPress={() => console.log('Menu pressed')}
        onRightPress={() => navigation.navigate("Notifications" as never)}
        backgroundColor={colors.primary}
        titleColor="#050404ff"
        shadow={true}
        leftIcon={{ component: MaterialIcons, name: 'menu', size: 28, color: '#000000ff' }}
        rightIcon={{ component: MaterialIcons, name: 'notifications', size: 28, color: '#000000ff' }}
      />

      <View style={styles.moneyFunctionSection}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#000000ff', fontSize: 40 }}>10000000$</Text>
          <Text style={{ color: '#000000ff', fontSize: 12 }}>Available</Text>
        </View>
        <View style={styles.functionSection}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.functionCircle} onPress={() => navigation.navigate("Request" as never)}>
              <MaterialIcons
                name='arrow-outward'
                size={30}
                color={"#000000ff"}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 12 }}>
              Request
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.functionCircle} onPress={() => navigation.navigate("History" as never)}>
              <MaterialIcons
                name='history'
                size={30}
                color="#000000ff"
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 12 }}>
              History
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Activity</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { console.log("view all data") }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.secondary }}>View all</Text>
          <MaterialIcons name="chevron-right" size={25} color="#c5b2b2ff" />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsSection}>
        {transactions.length === 0 ? (
          <Text style={{ color: "#020101ff", fontSize: 20, fontWeight: 'bold' }}>There are no transactions</Text>
        ) : (
          <Text style={{ color: "#020101ff", fontSize: 20, fontWeight: 'bold' }}>Transactions available</Text>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  moneyFunctionSection: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    height: 230
  },
  functionSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 30,
  },
  functionCircle: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    borderBlockColor: "#000000ff", borderWidth: 1,
  },
  activitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  transactionsSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    color: '#0d0b0bff',
  }
});
