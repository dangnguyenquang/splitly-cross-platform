// src/screens/NewGroupScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CategoryType } from '../../../types';
import Header from '../../components/Header';
import UploadCover from '../../components/UploadCover';
import InputField from '../../components/InputField';
import CategoryPills from '../../components/group/CategoryPills';
import { categories } from '../../../data/mockData';
import ActionButtons from '../../components/group/ActionButtons';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

type NewGroupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NewGroupScreen: React.FC = () => {
  const [coverImage, setCoverImage] = useState<string>('');
  const [title, setTitle] = useState('Trip to France');
  const [description, setDescription] = useState('Holiday with old school friends');
  const [currency, setCurrency] = useState('USD');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Trip');

  const navigation = useNavigation<NewGroupScreenNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    const groupData = {
      title,
      description,
      currency,
      category: selectedCategory,
      coverImage,
    };

    navigation.navigate("SelectParticipants", { groupData: groupData })

  };

  const handleUploadCover = () => {
    setCoverImage('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800');
  };

  return (
    <View style={styles.container}>
      <Header title="New Group" showBack onBack={handleBack} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <UploadCover imageUri={coverImage} onPress={handleUploadCover} />

        <InputField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter group title"
        />

        <InputField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />

        <InputField
          label="Currency"
          value={currency}
          onChangeText={setCurrency}
          placeholder="USD"
        />

        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <View style={styles.spacing} />
      </ScrollView>

      <ActionButtons onCancel={handleBack} onSave={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  spacing: {
    height: 20,
  },
});

export default NewGroupScreen;