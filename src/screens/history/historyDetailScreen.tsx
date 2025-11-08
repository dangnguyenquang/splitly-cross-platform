import React from "react";
import { View, StyleSheet, SectionList, Image, Text } from "react-native";
import { colors } from "../../Constant/theme";
import CardItem from "../../components/history/HistoryCardItem";
import SectionDivider from "../../components/history/SectionDivider";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

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
    const navigation = useNavigation()
    return (
        <SafeAreaView>
            <CustomHeader
                title="History Detail screen"
                onLeftPress={() => navigation.goBack()}
                onRightPress={() =>  {}}
                backgroundColor= {colors.primary}
                titleColor="#050404ff"
                shadow={true}
                leftIcon={{ component: MaterialIcons, name: 'arrow-back', size: 28, color: '#000000ff' }}
                rightIcon={{ component: MaterialIcons, name: 'more-vert', size: 28, color: '#000000ff' }}
            />
            <View style={{alignItems:'center',gap:20,height:300,backgroundColor:colors.primary}}>
                <View style={styles.avatar}>
                    <Image
                    source={{ uri: "https://i.pravatar.cc/150?img=7" }}
                    style={styles.avatar}
                    />
                </View>
                <Text style={{fontSize:40}}>100,000 VND</Text>
                <Text style={{fontSize:24,fontWeight:'bold'}}>Tien Loc vuive</Text>
                <Text style={{fontSize:20}}>loc@gmail.com</Text>
            </View>
            <View>

            </View>
            <CustomButton
            title="View Receipt"
            type="secondary"
            width={400}
            height={50}
            borderRadius={30}
            onPress={() => {}}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
  },
  avatar:{
    width:106,
    height:106,
    borderRadius:50
  }
});
