import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CategoryOption, CategoryType } from '../../../types';

interface CategoryPillsProps {
  categories: CategoryOption[];
  selectedCategory: CategoryType;
  onSelect: (category: CategoryType) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.pillsContainer}>
        {categories.map(category => (
          <Pressable
            key={category.label}
            style={[
              styles.pill,
              selectedCategory === category.label && styles.selectedPill,
            ]}
            onPress={() => onSelect(category.label)}
          >
            <Text style={styles.icon}>{category.icon}</Text>
            <Text
              style={[
                styles.pillText,
                selectedCategory === category.label && styles.selectedPillText,
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#fff',
    gap: 6,
  },
  selectedPill: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  icon: {
    fontSize: 18,
  },
  pillText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedPillText: {
    fontWeight: '600',
    color: '#000',
  },
});

export default CategoryPills;
