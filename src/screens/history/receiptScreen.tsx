import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../../constant/theme';
import Divider from '../../components/request/divider';


export default function ReceiptScreen() {
  const navigation = useNavigation()
    const handleCopy = (text: string, label: string) => {
        Clipboard.setString(text);
        Alert.alert('Copied!', `${label} copied to clipboard.`);
    };

  return (
    <SafeAreaView style={{flex:1}}>
      <CustomHeader
        title="Receipt"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Notifications pressed')}
        backgroundColor= {colors.background}
        titleColor="#050404ff"
        leftIcon={{ component: MaterialIcons, name: 'arrow-back', size: 28, color: '#000000ff' }}
        rightIcon={{ component: MaterialIcons, name: 'download', size: 28, color: '#000000ff' }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom:0 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        accessibilityShowsLargeContentViewer={false}
      >
      <View style={{flex:1,borderColor:'black',borderWidth:10}}>
        <Text style={{alignSelf:'center',fontSize:24,fontWeight:'bold',padding:10}}>Splitly</Text>
        <Divider/>
        <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#dddddddd',width:'80%',height:106,margin:20,alignSelf:'center',borderRadius:10}}>
            <Text style={{fontSize:20}}>Amount</Text>
            <Text style={{fontSize:40,fontWeight:'bold'}}>100,000VND</Text>
        </View>
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Sender</Text>
                    <Text style={styles.rightText}>Neymar</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Email</Text>
                    <Text style={styles.rightText}>loc@gmail.com</Text>
                </View>
                <Divider/>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Receipient</Text>
                    <Text style={styles.rightText}>Lionel Messi</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Email</Text>
                    <Text style={styles.rightText}>loc@gmail.com</Text>
                </View>
                <Divider/>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Group</Text>
                    <Text style={styles.rightText}>Dinner delight</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Amount paid</Text>
                    <Text style={styles.rightText}>200,000 VND</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Date</Text>
                    <Text style={styles.rightText}>Sep 20, 2025 09:41 AM</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Transaction ID</Text>
                    <View style={styles.valueContainer}>
                    <Text style={styles.rightText}>122819289100000</Text>
                    <TouchableOpacity onPress={() => handleCopy('122819289100000', 'Transaction ID')}>
                        <MaterialIcons name="content-copy" size={18} color="#555" />
                    </TouchableOpacity>
                    </View>
                </View>

                {/* Reference ID */}
                <View style={styles.textContainer}>
                    <Text style={styles.leftText}>Reference ID</Text>
                    <View style={styles.valueContainer}>
                    <Text style={styles.rightText}>HUBWBWWH</Text>
                    <TouchableOpacity onPress={() => handleCopy('HUBWBWWH', 'Reference ID')}>
                        <MaterialIcons name="content-copy" size={18} color="#555" />
                    </TouchableOpacity>
                    </View>
                </View>
                <Divider/>
                <View style={{justifyContent:'space-between',paddingHorizontal:24, paddingVertical:10}}>
                        <Text style={styles.leftText}>Notes</Text>
                        <Text style={styles.rightText}>Pay for dinner</Text>
                </View>
                <Divider/>
                <View style={{paddingHorizontal:24,alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:20}}>The receipt is proof of transaction</Text>
                        <Text style={styles.rightText}>www.roomxpense.com</Text>
                </View>
            </View>
            
      </View>
      </ScrollView>    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
  },
  avatar:{
    width:106,
    height:106,
    borderRadius:50
  },
  textContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:24,
    paddingVertical:10
  },
  leftText:{
    color:colors.secondary,
    fontSize:20
  },
  rightText:{
    color:'black',
    fontSize:20,
    fontWeight:'bold'
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
