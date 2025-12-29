import { SCREEN_WIDTH } from '@/src/utils/dimension';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Redux */
import { RootState } from '@/src/store/store';
import { useSelector } from 'react-redux';

/* Components */
import CustomButton from '@/src/components/CustomButton';
import CategorySelector from '@/src/components/group/categorySelector';
import PeopleMultiSelect from '@/src/components/group/peopleMultiSelector';
import InputField from '@/src/components/InputField';
import Header from '../../components/Header';

/* APIs */
import { getGroupUsers } from '@/src/api/group.api';
import { uploadGroupImage } from '@/src/api/image.api';
import { createPaymentRequest } from '@/src/api/payment.api';
import { getTags, Tag } from '@/src/api/tag.api';
import { RootStackParamList } from '@/src/types';

import MaterialIcons from '@react-native-vector-icons/material-icons';
import Feather from '@react-native-vector-icons/feather';
import { launchImageLibrary } from 'react-native-image-picker';

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
  const { groupId } = route.params;
  const numericGroupId = Number(groupId);

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );
  const currentUserId = useSelector(
    (state: RootState) => state.auth.login.currentUser?.userId,
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

        const users = await getGroupUsers(numericGroupId, token);

        // 🚫 remove current user from participant list
        const filteredUsers = users.filter(
          (user: GroupUser) => user.userId !== currentUserId,
        );

        setParticipants(filteredUsers);
        setCategories(await getTags(token));
      } finally {
        setLoadingUsers(false);
        setLoadingCategories(false);
      }
    };

    fetchAll();
  }, [groupId, token, currentUserId]);

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

    closeItemModal();
  };

  const removeItem = (index: number) => {
    Alert.alert(
      'Remove item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setItems(prev => prev.filter((_, i) => i !== index));
          },
        },
      ],
    );
  };

  const closeItemModal = () => {
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

        {/* ===== ITEMS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>

          {items.map((i, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.itemRow}
              onLongPress={() => removeItem(idx)}
              activeOpacity={0.7}
            >
              <Text>
                {i.itemName} x{i.quantity}
              </Text>

              <View style={styles.itemRight}>
                <Text>{i.amount}</Text>
                <Feather name="trash-2" size={16} color="#ef4444" />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() => setItemModalVisible(true)}
          >
            <Text style={styles.addItemText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.totalText}>
          Total <Feather name="dollar-sign" size={18} /> {totalAmount}
        </Text>

        {loadingCategories ? (
          <ActivityIndicator />
        ) : (
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

      {/* ===== ITEM MODAL (CLICK OUTSIDE TO CLOSE) ===== */}
      <Modal visible={itemModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeItemModal}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={() => {}}
          >
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
              placeholder="How much?"
              keyboardType="numeric"
              value={itemAmount}
              onChangeText={setItemAmount}
              style={styles.input}
            />

            <CustomButton title="Add" onPress={addItem} style={{alignSelf:'center'}} />
          </TouchableOpacity>
        </TouchableOpacity>
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
    paddingVertical: 8,
    alignItems: 'center',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  addItemBtn: {
    marginTop: 10,
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
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, alignSelf:'center' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
});
