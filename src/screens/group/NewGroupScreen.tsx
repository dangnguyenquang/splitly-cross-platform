import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../../components/Header';
import UploadCover from '../../components/UploadCover';
import InputField from '../../components/InputField';
import CategoryPills from '../../components/group/CategoryPills';
import { categories } from '../../../data/mockData';
import ActionButtons from '../../components/group/ActionButtons';
import { launchImageLibrary } from 'react-native-image-picker';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CategoryType, Group } from '@/src/types';
import { setCurrentGroup } from '@/src/store/groupSlice';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

type NewGroupScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const NewGroupScreen: React.FC = () => {
  const [coverImage, setCoverImage] = useState<string>('');
  const [title, setTitle] = useState('Trip to France');
  const [description, setDescription] = useState(
    'Holiday with old school friends',
  );
  const [currency, setCurrency] = useState('USD');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>('Trip');
  const dispatch = useDispatch();
  const navigation = useNavigation<NewGroupScreenNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }

    const groupData: Group = {
      groupId: 0,
      groupName: title,
      description,
      currency,
      category: selectedCategory,
      groupImage: coverImage,
    };
    dispatch(setCurrentGroup(groupData));
    navigation.navigate('SelectParticipants', { groupData });
  };

  const handleUploadCover = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Image picker error');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      if (asset.uri) {
        setCoverImage(asset.uri);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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
