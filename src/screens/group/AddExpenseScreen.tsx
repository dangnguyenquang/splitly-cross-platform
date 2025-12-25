import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/src/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SCREEN_WIDTH } from '@/src/utils/dimension';

/* Redux */
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';

/* Components */
import Header from '../../components/Header';
import InputField from '@/src/components/InputField';
import UploadCover from '@/src/components/UploadCover';
import CustomButton from '@/src/components/CustomButton';
import PeopleMultiSelect from '@/src/components/group/peopleMultiSelector';
import CategorySelector from '@/src/components/group/categorySelector';

/* APIs */
import { getGroupUsers } from '@/src/api/group.api';
import { getTags, Tag } from '@/src/api/tag.api';
import { createPaymentRequest } from '@/src/api/payment.api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { uploadGroupImage } from '@/src/api/image.api';

/* Static icons for categories */
const categoryIconMap: Record<string, string> = {
  Food: '🍔',
  Travel: '🚌',
  Music: '🎵',
  Movie: '🎬',
  Sport: '🏀',
  Games: '🎮',
  'Dining out': '🍽️',
  Liquor: '🍷',
  Market: '🛒',
  Utilities: '💡',
  Default: '💸',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'AddExpense'>;

interface GroupUser {
  userId: number;
  fullName: string;
}

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { group, groupId } = route.params;
  const numericGroupId = Number(groupId);

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );

  /* ===== STATE ===== */
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState('');

  const [participants, setParticipants] = useState<GroupUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [categories, setCategories] = useState<Tag[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [uri, setURI] = useState<string>('');
  /* ===== FETCH USERS & TAGS ON MOUNT ===== */
  useEffect(() => {
    if (!groupId || !token) return;

    const fetchGroupUsers = async () => {
      try {
        setLoadingUsers(true);
        const users = await getGroupUsers(numericGroupId, token);
        setParticipants(users);
      } catch (error) {
        console.error('Fetch group users failed:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchTags = async () => {
      try {
        setLoadingCategories(true);
        const tags = await getTags(token);
        setCategories(tags);
      } catch (error) {
        console.error('Fetch tags failed:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchGroupUsers();
    fetchTags();
  }, [groupId, token]);

  /* ===== PEOPLE OPTIONS ===== */
  const peopleOptions = participants.map(u => ({
    label: u.fullName,
    value: u.userId,
  }));
  const handlePickAvatar = async () => {
    Alert.alert(
      'Select Image',
      'Choose image source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await launchCamera({
              mediaType: 'photo',
              quality: 0.8,
              saveToPhotos: true,
            });

            processImageResult(result.assets?.[0]);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await launchImageLibrary({
              mediaType: 'photo',
              quality: 0.8,
            });

            processImageResult(result.assets?.[0]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const processImageResult = async (asset?: Asset) => {
    if (!asset?.uri) return;

    // Immediately show preview
    setURI(asset.uri);

    try {
      await uploadGroupImage(asset.uri, token!, groupId);
    } catch (err) {
      Alert.alert('Upload failed', 'Unable to upload image');
      console.error(err);
    }
  };
  /* ===== SAVE ===== */
  const handleSave = async () => {
    if (!title || !amount || !categoryId) {
      Alert.alert('Missing fields');
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount');
      return;
    }

    const selectedCategory = categories.find(
      c => String(c.tagId) === categoryId,
    );

    if (!selectedCategory) {
      Alert.alert('Invalid category');
      return;
    }

    const payload = {
      title,
      tag: {
        tagId: String(selectedCategory.tagId),
        tagName: selectedCategory.tagName,
      },
      items: [
        {
          itemName: title,
          quantity: 1,
          priceQuotation: numericAmount,
          amount: numericAmount,
        },
      ],
      consensusPayments: selectedPeople.map(userId => ({ userId })),
      estimatedAmount: numericAmount,
      imageUrl: uri || '',
      paymentRequestNote: note,
      usedFundAmount: 0,
    };

    const res = await createPaymentRequest(payload, token!, numericGroupId);
    if (!res) {
      Alert.alert('Create payment request failed');
      return;
    }
    console.log('CREATE PAYMENT REQUEST:', payload);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Payment Request" showBack onBack={navigation.goBack} />

      <ScrollView>
        <InputField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Expense title"
        />

        <InputField
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder={`Amount (${group?.currency || 'VND'})`}
        />

        {loadingCategories ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : (
          <CategorySelector
            categories={categories}
            selectedCategoryId={categoryId} // still a string
            onSelect={setCategoryId} // string
          />
        )}

        <InputField
          label="Notes"
          value={note}
          onChangeText={setNote}
          placeholder="Payment note"
          multiline
        />

        {loadingUsers ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : (
          <PeopleMultiSelect
            data={peopleOptions}
            value={selectedPeople}
            onChange={setSelectedPeople}
          />
        )}
        <View style={styles.coverContainer}>
          {uri ? (
            // Show selected image
            <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8}>
              <Image source={{ uri }} style={styles.coverImage} />
              <View style={styles.cameraOverlay}>
                <MaterialIcons name="camera-alt" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          ) : (
            // Show placeholder
            <TouchableOpacity
              onPress={handlePickAvatar}
              style={styles.coverPlaceholder}
              activeOpacity={0.8}
            >
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
            </TouchableOpacity>
          )}
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
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
  },
  coverContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },

  coverPlaceholder: {
    width: SCREEN_WIDTH * 0.8,
    height: 180,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },

  coverImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 180,
    borderRadius: 12,
  },

  cameraOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 18,
  },
});
