import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/src/constant/theme';

interface Category {
  tagId: number;
  tagName: string;
}

interface Props {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (id: string) => void;
}

const CategorySelector: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>

      <View style={styles.row}>
        {categories.map(cat => {
          const active = selectedCategoryId === String(cat.tagId);

          return (
            <TouchableOpacity
              key={cat.tagId}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(String(cat.tagId))}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat.tagName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: '#555',
  },
  chipTextActive: {
    color: '#000',
    fontWeight: '600',
  },
});
