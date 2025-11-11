import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREEN_WIDTH } from '@/utils/dimensions';
import { StyleSheet, View } from 'react-native';
import CustomButton from '@/src/components/CustomButton';
import InputField from '@/src/components/InputField';
import UploadCover from '@/src/components/UploadCover';

type GroupDetailScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const [title, setTitle] = useState('Title');
  const [amount, setAmount] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<string>('');
  const [notes, setNotes] = useState('Notes');



  const handleBack = () => {
    navigation.goBack();
  };
  const handleUploadCover = () => {
    setCoverImage(
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={'Add New Expense'}
        showBack={true}
        showMenu
        onBack={handleBack}
      />
      <View>
        <InputField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter group title"
        />
        <InputField
          label="Amount"
          value={amount.toString()}
          onChangeText={text => setAmount(Number(text))}
          placeholder="Enter group title"
        />
        <InputField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes"
          multiline={true}
        />
        <InputField
          label="SplitSetup"
          value={notes}
          onChangeText={setNotes}
          placeholder="Split"
          multiline={true}
        />

        <UploadCover imageUri={coverImage} onPress={handleUploadCover} />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cancel"
          width={SCREEN_WIDTH * 0.4}
          height={50}
          borderRadius={30}
          type="secondary"
          onPress={() => navigation.goBack()}
        />
        <CustomButton
          title="Save"
          width={SCREEN_WIDTH * 0.4}
          height={50}
          borderRadius={30}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
});

export default AddExpenseScreen;
