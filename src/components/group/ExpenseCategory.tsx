import React, { JSX, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/Dimensions';
import CustomButton from '@/src/components/CustomButton';
import { X, Search, Check } from 'lucide-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Category = {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  group: string;
};

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (id: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedId, setTempSelectedId] = useState(
    selectedCategoryId || '',
  );
  const [search, setSearch] = useState('');

  const groupedCategories = categories.reduce(
    (acc, cat) => {
      if (!acc[cat.group]) acc[cat.group] = [];
      acc[cat.group].push(cat);
      return acc;
    },
    {} as Record<string, Category[]>,
  );

  const handleSave = () => {
    onSelect(tempSelectedId);
    setModalVisible(false);
  };

  const filteredCategories = Object.keys(groupedCategories).reduce(
    (acc, group) => {
      const filtered = groupedCategories[group].filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      );
      if (filtered.length) acc[group] = filtered;
      return acc;
    },
    {} as Record<string, Category[]>,
  );

  return (
    <>
      <Text style={styles.label}>Category</Text>
      {/* Field that opens modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        style={styles.categoryField}
      >
        <Text style={styles.categoryFieldText}>
          {categories.find(c => c.id === selectedCategoryId)?.name ||
            'Category'}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={30} color="#706b6bff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Category</Text>
            <Search size={22} color="#333" />
          </View>

          {/* Search Bar */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search category..."
            value={search}
            onChangeText={setSearch}
          />

          {/* Category List */}
          <FlatList
            data={Object.keys(filteredCategories)}
            keyExtractor={group => group}
            renderItem={({ item: group }) => (
              <View style={styles.groupContainer}>
                <Text style={styles.groupTitle}>{group}</Text>
                {filteredCategories[group].map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryItem}
                    onPress={() => setTempSelectedId(cat.id)}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: cat.color },
                      ]}
                    >
                      {cat.icon}
                    </View>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    {tempSelectedId === cat.id && (
                      <Check size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            showsVerticalScrollIndicator={false}
            // style={{ marginBottom: 20 }}
          />

          {/* Bottom Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancel"
              width={SCREEN_WIDTH * 0.4}
              height={45}
              borderRadius={30}
              type="secondary"
              onPress={() => setModalVisible(false)}
            />
            <CustomButton
              title="OK"
              width={SCREEN_WIDTH * 0.4}
              height={45}
              borderRadius={30}
              onPress={handleSave}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  categoryField: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryFieldText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#fff',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  groupContainer: {
    marginTop: 10,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});

export default CategorySelector;
