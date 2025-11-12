import React, { useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREEN_WIDTH } from '@/utils/Dimensions';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '@/src/components/CustomButton';
import InputField from '@/src/components/InputField';
import UploadCover from '@/src/components/UploadCover';
import { MultiSelect } from 'react-native-element-dropdown';
import constructPeopleOptions from '@/utils/AddExpenseUtils';
import CategorySelector from '@/src/components/group/ExpenseCategory';
import { categoryList } from '@/data/mockCategoryData';

type AddExpenseScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type AddExpenseScreenProp = RouteProp<RootStackParamList, 'AddExpense'>;

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<AddExpenseScreenNavigationProp>();
  const route = useRoute<AddExpenseScreenProp>();

  const { group } = route.params;
  const [title, setTitle] = useState('Title');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('Notes');
  const [coverImage, setCoverImage] = useState<string>('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const peopleOptions = constructPeopleOptions(group);
  const [categoryId, setCategoryId] = useState<string>('');

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
      <ScrollView showsVerticalScrollIndicator={false}>
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
            placeholder="Enter amount in USD"
          />
          <CategorySelector
            categories={categoryList}
            selectedCategoryId={categoryId}
            onSelect={setCategoryId}
          />
          <InputField
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter notes"
            multiline={true}
          />
          <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
            <Text style={styles.label}>Apply to People</Text>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={peopleOptions}
              labelField="label"
              valueField="value"
              placeholder="Select people"
              value={selectedPeople}
              onChange={item => {
                setSelectedPeople(item);
              }}
              selectedStyle={styles.selectedStyle}
            />
          </View>
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
      </ScrollView>
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
    alignItems: 'flex-start',
    marginTop: 20,
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});

export default AddExpenseScreen;
