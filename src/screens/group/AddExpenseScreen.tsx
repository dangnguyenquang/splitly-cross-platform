import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  TextInput,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREEN_WIDTH } from '@/src/utils/dimension';

/* Redux */
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';

/* Components */
import Header from '../../components/Header';
import InputField from '@/src/components/InputField';
import CustomButton from '@/src/components/CustomButton';
import PeopleMultiSelect from '@/src/components/group/peopleMultiSelector';
import CategorySelector from '@/src/components/group/categorySelector';

/* APIs */
import { getGroupUsers } from '@/src/api/group.api';
import { getTags, Tag } from '@/src/api/tag.api';
import { createPaymentRequest } from '@/src/api/payment.api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  launchImageLibrary,
} from 'react-native-image-picker';
import { uploadGroupImage } from '@/src/api/image.api';
import { RootStackParamList } from '@/src/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'AddExpense'>;

interface GroupUser {
  userId: number;
  fullName: string;
}

interface ExpenseItem {
  itemName: string;
  quantity: number;
  amount: number;
}

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { group, groupId } = route.params;
  const numericGroupId = Number(groupId);

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );

  /* ===== BASIC INFO ===== */
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
  const [uri, setURI] = useState('');

  /* ===== ITEMS ===== */
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemAmount, setItemAmount] = useState('');

  /* ===== USERS & TAGS ===== */
  const [participants, setParticipants] = useState<GroupUser[]>([]);
  const [categories, setCategories] = useState<Tag[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    if (!groupId || !token) return;

    const fetchAll = async () => {
      try {
        setLoadingUsers(true);
        setLoadingCategories(true);
        setParticipants(await getGroupUsers(numericGroupId, token));
        setCategories(await getTags(token));
      } finally {
        setLoadingUsers(false);
        setLoadingCategories(false);
      }
    };

    fetchAll();
  }, [groupId, token]);

  /* ===== IMAGE ===== */
  const handlePickAvatar = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.assets?.[0]?.uri) return;

    setURI(result.assets[0].uri);
    await uploadGroupImage(result.assets[0].uri, token!, groupId);
  };

  /* ===== ITEMS ===== */
  const totalAmount = items.reduce(
    (sum, i) => sum + i.amount * i.quantity,
    0,
  );

  const addItem = () => {
    if (!itemName || !itemAmount) {
      Alert.alert('Missing item info');
      return;
    }

    setItems(prev => [
      ...prev,
      {
        itemName,
        quantity: Number(itemQuantity),
        amount: Number(itemAmount),
      },
    ]);

    setItemName('');
    setItemQuantity('1');
    setItemAmount('');
    setItemModalVisible(false);
  };

  /* ===== SAVE ===== */
  const handleSave = async () => {
    if (!title || !categoryId || items.length === 0) {
      Alert.alert('Missing fields');
      return;
    }

    const tag = categories.find(c => String(c.tagId) === categoryId);
    if (!tag) return;

    const payload = {
      title,
      tag: {
        tagId: String(tag.tagId),
        tagName: tag.tagName,
      },
      items: items.map(i => ({
        ...i,
        priceQuotation: i.amount,
      })),
      consensusPayments: selectedPeople.map(userId => ({ userId })),
      estimatedAmount: totalAmount,
      imageUrl: uri,
      paymentRequestNote: note,
      usedFundAmount: 0,
    };

    await createPaymentRequest(payload, token!, numericGroupId);
    navigation.goBack();
  };

  /* ===== RENDER ===== */
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Payment Request" showBack onBack={navigation.goBack} />

      <ScrollView>
        <InputField label="Title" value={title} onChangeText={setTitle} />

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>

          {items.map((i, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text>{i.itemName} x{i.quantity}</Text>
              <Text>{i.amount}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() => setItemModalVisible(true)}
          >
            <Text style={styles.addItemText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.totalText}>
          Total: {totalAmount} {group?.currency}
        </Text>

        {loadingCategories ? <ActivityIndicator /> : (
          <CategorySelector
            categories={categories}
            selectedCategoryId={categoryId}
            onSelect={setCategoryId}
          />
        )}

        <PeopleMultiSelect
          data={participants.map(p => ({
            label: p.fullName,
            value: p.userId,
          }))}
          value={selectedPeople}
          onChange={setSelectedPeople}
        />

        <TouchableOpacity onPress={handlePickAvatar}>
          {uri ? (
            <Image source={{ uri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <CustomButton title="Save" onPress={handleSave} />
        </View>
      </ScrollView>

      {/* ===== ITEM MODAL ===== */}
      <Modal visible={itemModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Item</Text>

            <TextInput
              placeholder="Item name"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />

            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={itemQuantity}
              onChangeText={setItemQuantity}
              style={styles.input}
            />

            <TextInput
              placeholder="Estimated amount for each item"
              keyboardType="numeric"
              value={itemAmount}
              onChangeText={setItemAmount}
              style={styles.input}
            />

            <CustomButton title="Add" onPress={addItem} style={{alignSelf:'center'}} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  addItemBtn: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  addItemText: { fontWeight: '600' },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  coverPlaceholder: {
    width: SCREEN_WIDTH * 0.8,
    height: 180,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  coverImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 180,
    alignSelf: 'center',
    borderRadius: 12,
  },
  buttonContainer: { marginVertical: 20, alignItems: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
});
