import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header';
import { colors } from '../../constant/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
  const [transactions, setTransaction] = useState<any>([])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="Splitly"
        onLeftPress={() => console.log('Menu pressed')}
        onRightPress={() => console.log('Notifications pressed')}
        backgroundColor={colors.primary}
        titleColor="#050404ff"
        shadow={true}
        leftIcon={{ component: MaterialIcons, name: 'menu', size: 28, color: '#000000ff' }}
        rightIcon={{ component: MaterialIcons, name: 'notifications', size: 28, color: '#000000ff' }}
      />

      <View style={styles.moneyFunctionSection}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#000000ff', fontSize: 60 }}>10000000$</Text>
          <Text style={{ color: '#000000ff', fontSize: 30 }}>Available</Text>
        </View>
        <View style={styles.functionSection}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.functionCircle} onPress={() => console.log('L pressed')}>
              <MaterialIcons
                name='arrow-outward'
                size={30}
                color={"#000000ff"}
              />
            </TouchableOpacity>
            <Text>
              Request
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.functionCircle} onPress={() => console.log('L pressed')}>
              <MaterialIcons
                name='history'
                size={30}
                color="#000000ff"
              />
            </TouchableOpacity>
            <Text>
              History
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Activity</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { console.log("view all data") }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#d3ceceff' }}>View all</Text>
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
    height: 300
  },
  functionSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 30
  },
  functionCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffffff',
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
