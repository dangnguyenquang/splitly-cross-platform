import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header/index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constant/theme';
import SectionDivider from '../../components/history/SectionDivider';
// import MoneyRequestCard from '../../components/request/RequestCard';
import CustomButton from '../../components/CustomButton';
import MoneyRequestCard from '@/src/components/request/RequestCard';
import Divider from '@/src/components/request/Divider';
// import Divider from '../../components/request/Divider';
// import { Button, ButtonText } from "../../../components/ui/button"

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
const { width, height } = Dimensions.get('window');
export default function RequestScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] =
    useState<boolean>(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="Request"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Notifications pressed')}
        backgroundColor={colors.background}
        titleColor="#050404ff"
        leftIcon={{
          component: MaterialIcons,
          name: 'arrow-back',
          size: 28,
          color: '#000000ff',
        }}
      />
      <SectionList
        sections={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item, index, section }) => (
          <MoneyRequestCard
            ownerName="Tien Loc"
            amount="194,000 VND"
            requestPersonName="Hoai Bao"
            showDivider={index < section.data.length - 1}
            handleOnPressRequestButton={() => setModalVisible(true)}
            type={"receive"}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionDivider title={title} />
        )}
      />
      {/* two floating button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: '#FFC107' }]}
          onPress={() => console.log('Request pressed')}
        >
          <MaterialIcons name="qr-code-scanner" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => console.log('Add pressed')}
        >
          <MaterialIcons name="add" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '600',
                  alignSelf: 'center',
                  padding: 20,
                }}
              >
                Request
              </Text>
              <Divider />
              <View
                style={{
                  width: 380,
                  height: 137,
                  borderRadius: 12,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 24,
                  margin: 24,
                  backgroundColor: '#F5F5F5',
                }}
              >
                <Text style={{ fontSize: 16 }}>Amount</Text>
                <Text style={{ fontSize: 40 }}>100,000 VND</Text>
                <Text style={{ fontSize: 12 }}>
                  Your available balance: 100,000 VND
                </Text>
              </View>
              <SectionDivider title={'Request to'} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 20,
                  margin: 20,
                }}
              >
                <View style={styles.avatar}>
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=7' }}
                    style={styles.avatar}
                  />
                </View>
                <View>
                  <Text style={{ color: 'black', fontWeight: 'bold' }}>
                    Lucian Nguyen
                  </Text>
                  <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>
                    lucian.nguyen@gmail.com
                  </Text>
                </View>
              </View>
              <Divider />
              <View style={{ padding: 24 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 24 }}
                >
                  Notes(Optional)
                </Text>
                <Text
                  style={{
                    backgroundColor: '#F5F5F5',
                    width: '100%',
                    height: 87,
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  Having break first at HCM
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 20,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <CustomButton
                  title={'Cancel'}
                  width={180}
                  height={54}
                  type="secondary"
                  onPress={() => setModalVisible(!modalVisible)}
                />
                <CustomButton
                  title={'Request'}
                  width={180}
                  height={54}
                  onPress={() => {
                    setModalVisible(false); // close the request modal
                    setSuccessModalVisible(true); // open success modal
                  }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSuccessModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.successModalView}>
              <View
                style={{
                  height: 85,
                  width: 85,
                  borderRadius: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  borderWidth: 1,
                  borderColor: 'black',
                }}
              >
                <MaterialIcons name="check" size={30} color={'#000000ff'} />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  marginVertical: 10,
                  fontSize: 32,
                  fontWeight: 'bold',
                }}
              >
                Your request has been sent successfully.
                {/* <Paragraph>Paragraph</Paragraph> */}
              </Text>
              {/* <CustomButton
                title="OK"
                width={180}
                height={54}
                onPress={() => setSuccessModalVisible(false)}
              /> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: width,
    height: 690,
    backgroundColor: 'white',
    shadowColor: '#ffececff',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    position: 'relative',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  successModalView: {
    width: width,
    backgroundColor: 'white',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 30,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
