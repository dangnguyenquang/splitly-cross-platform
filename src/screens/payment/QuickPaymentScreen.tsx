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

import { RootState } from '@/src/store/store';
import { useSelector } from 'react-redux';

import CustomButton from '@/src/components/CustomButton';
import CategorySelector from '@/src/components/group/categorySelector';
import PeopleMultiSelect from '@/src/components/group/peopleMultiSelector';
import Header from '@/src/components/Header';

import { getGroupUsers, getAllGroupsByUser } from '@/src/api/group.api';
import { uploadGroupImage } from '@/src/api/image.api';
import { createPaymentRequest } from '@/src/api/payment.api';
import { getTags, Tag } from '@/src/api/tag.api';
import { RootStackParamList } from '@/src/types';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { launchImageLibrary } from 'react-native-image-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'QuickPayment'>;

export interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
}

export interface BillData {
  merchantName: string | null;
  merchantAddress: string | null;
  billDate: string;
  billDateTime: string;
  billNumber: string;
  taxId: string | null;
  items: BillItem[];
  subtotal: number;
  tax: number | null;
  discount: number | null;
  serviceCharge: number | null;
  total: number;
  currency: string;
  paymentMethod: string | null;
  rawText: string;
  confidence: number;
}

interface GroupUser {
  userId: number;
  fullName: string;
}

interface Group {
  groupId: number;
  groupName: string;
  currency: string;
}

interface ExpenseItem {
  itemName: string;
  quantity: number;
  amount: number;
}

const QuickPaymentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { bill, billImageUrl } = route.params ?? {};

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );

  const [title, setTitle] = useState(bill?.merchantName || '');
  const [note, setNote] = useState(
    bill?.billNumber ? `Bill #${bill.billNumber} - ${bill.billDateTime}` : ''
  );
  const [categoryId, setCategoryId] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
  const [uri, setURI] = useState(billImageUrl || '');

  const [items, setItems] = useState<ExpenseItem[]>(
    bill?.items.map(item => ({
      itemName: item.name,
      quantity: item.quantity,
      amount: item.unitPrice,
    })) || []
  );
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemAmount, setItemAmount] = useState('');

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [participants, setParticipants] = useState<GroupUser[]>([]);
  const [categories, setCategories] = useState<Tag[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [groupSelectorVisible, setGroupSelectorVisible] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchGroups = async () => {
      setLoadingGroups(true);
      try {
        const fetchedGroups = await getAllGroupsByUser(token);
        
        // Transform API
        const formattedGroups = fetchedGroups.map((group: any) => ({
          groupId: group.groupId,
          groupName: group.groupName,
          currency: group.currency || 'VND',
        }));
        
        setGroups(formattedGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        Alert.alert('Error', 'Failed to load groups. Please try again.');
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [token]);

  useEffect(() => {
    if (!selectedGroupId || !token) return;

    const fetchData = async () => {
      try {
        setLoadingUsers(true);
        setLoadingCategories(true);
        
        const [users, tags] = await Promise.all([
          getGroupUsers(selectedGroupId, token),
          getTags(token),
        ]);
        
        // Transform users
        const formattedUsers = users.map((user: any) => ({
          userId: user.userId,
          fullName: user.fullName || user.username || `User ${user.userId}`,
        }));
        
        setParticipants(formattedUsers);
        setCategories(tags);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load group members and categories. Please try again.');
      } finally {
        setLoadingUsers(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, [selectedGroupId, token]);

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    setSelectedPeople([]);
    setGroupSelectorVisible(false);
  };

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.assets?.[0]?.uri) return;

    setURI(result.assets[0].uri);
   
    if (selectedGroupId) {
      await uploadGroupImage(result.assets[0].uri, token!, selectedGroupId.toString());
    }
  };


  const totalAmount = items.reduce((sum, i) => sum + i.amount * i.quantity, 0);

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

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };


  const handleCreatePayment = async () => {
    if (!selectedGroupId) {
      Alert.alert('Missing Group', 'Please select a group first');
      return;
    }

    if (!title || !categoryId || items.length === 0) {
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return;
    }

    if (selectedPeople.length === 0) {
      Alert.alert('Missing Participants', 'Please select at least one person');
      return;
    }

    try {
      const tag = categories.find(c => String(c.tagId) === categoryId);
      if (!tag) return;

      const payload = {
        title,
        tag: {
          tagId: String(tag.tagId),
          tagName: tag.tagName,
        },
        items: items.map(i => ({
          itemName: i.itemName,
          quantity: i.quantity,
          amount: i.amount,
          priceQuotation: i.amount,
        })),
        consensusPayments: selectedPeople.map(userId => ({ userId })),
        estimatedAmount: totalAmount,
        imageUrl: uri,
        paymentRequestNote: note,
        usedFundAmount: 0,
      };

      await createPaymentRequest(payload, token!, selectedGroupId);
      Alert.alert('Success', 'Payment request created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create payment request');
      console.log("Error: ", error);
    }
  };

  const selectedGroup = groups.find(g => g.groupId === selectedGroupId);


  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Quick Payment" showBack onBack={navigation.goBack} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View className="px-4 pt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Title <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            style={styles.input}
          />
        </View>

        {/* Group Selection */}
        <View className="px-4 mt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Select Group <Text className="text-red-500">*</Text>
          </Text>

          {loadingGroups ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <TouchableOpacity
              onPress={() => setGroupSelectorVisible(!groupSelectorVisible)}
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <View className="flex-row items-center flex-1">
                <MaterialIcons name="group" size={20} color="#3B82F6" />
                <Text className="ml-2 text-base text-gray-800">
                  {selectedGroup?.groupName || 'Choose a group'}
                </Text>
              </View>
              <MaterialIcons
                name={
                  groupSelectorVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
                }
                size={24}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}

          {/* Group Dropdown */}
          {groupSelectorVisible && (
            <View className="mt-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {groups.map(group => (
                <TouchableOpacity
                  key={group.groupId}
                  onPress={() => handleSelectGroup(group.groupId)}
                  className={`p-3 border-b border-gray-100 ${
                    selectedGroupId === group.groupId ? 'bg-blue-50' : ''
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-gray-800">
                      {group.groupName}
                    </Text>
                    {selectedGroupId === group.groupId && (
                      <MaterialIcons name="check-circle" size={18} color="#3B82F6" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Items Section */}
        <View className="px-4 mt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Items <Text className="text-red-500">*</Text>
          </Text>

          <View className="bg-gray-50 rounded-xl p-3">
            {items.length === 0 ? (
              <Text className="text-center text-gray-400 py-4">No items added</Text>
            ) : (
              items.map((item, idx) => (
                <View
                  key={item.itemName}
                  className={`flex-row items-center justify-between py-2 ${
                    idx < items.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-800">
                      {item.itemName} x{item.quantity}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                      {item.amount.toLocaleString()} × {item.quantity}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm font-semibold text-gray-800 mr-2">
                      {(item.amount * item.quantity).toLocaleString()}
                    </Text>
                    <TouchableOpacity onPress={() => removeItem(idx)}>
                      <MaterialIcons name="close" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity
              onPress={() => setItemModalVisible(true)}
              className="mt-2 p-3 bg-white rounded-lg border border-dashed border-gray-300 items-center"
            >
              <Text className="text-sm font-semibold text-blue-600">+ Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Amount */}
        <View className="px-4 mt-3">
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-gray-700">Total</Text>
              <Text className="text-xl font-bold text-blue-600">
                {totalAmount.toLocaleString()} {selectedGroup?.currency || 'VND'}
              </Text>
            </View>
          </View>
        </View>

        {/* Category Selector */}
        {selectedGroupId && (
          <View className="px-4 mt-4">
            {loadingCategories ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <CategorySelector
                categories={categories}
                selectedCategoryId={categoryId}
                onSelect={setCategoryId}
              />
            )}
          </View>
        )}

        {/* People Selector */}
        {selectedGroupId && (
          <View className="px-4 mt-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Apply to People <Text className="text-red-500">*</Text>
            </Text>

            {loadingUsers ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <PeopleMultiSelect
                data={participants.map(p => ({
                  label: p.fullName,
                  value: p.userId,
                }))}
                value={selectedPeople}
                onChange={setSelectedPeople}
              />
            )}
          </View>
        )}

        {/* Image Upload */}
        <View className="px-4 mt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Receipt Image
          </Text>
          <TouchableOpacity onPress={handlePickImage}>
            {uri ? (
              <Image source={{ uri }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <MaterialIcons name="camera-alt" size={32} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 text-sm">Add receipt image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View className="px-4 py-6 items-center">
          <CustomButton
            title="Create Payment Request"
            onPress={handleCreatePayment}
          />
        </View>
      </ScrollView>

      {/* Item Modal */}
      <Modal visible={itemModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Add Item</Text>
              <TouchableOpacity onPress={() => setItemModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Item name"
              value={itemName}
              onChangeText={setItemName}
              style={styles.modalInput}
            />

            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={itemQuantity}
              onChangeText={setItemQuantity}
              style={styles.modalInput}
            />

            <TextInput
              placeholder="Unit price"
              keyboardType="numeric"
              value={itemAmount}
              onChangeText={setItemAmount}
              style={styles.modalInput}
            />

            <CustomButton
              title="Add Item"
              onPress={addItem}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default QuickPaymentScreen;

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  coverPlaceholder: {
    width: SCREEN_WIDTH * 0.9,
    height: 180,
    backgroundColor: '#F9FAFB',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  coverImage: {
    width: SCREEN_WIDTH * 0.9,
    height: 180,
    alignSelf: 'center',
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
});