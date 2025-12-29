import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';

interface Option {
  label: string;
  value: number; // userId
}

interface Props {
  data: Option[];
  value: number[]; // selected userIds
  onChange: (value: number[]) => void;
}

const PeopleMultiSelect: React.FC<Props> = ({ data, value, onChange }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Apply to people</Text>

      <MultiSelect
        data={data.map(item => ({
          ...item,
          value: String(item.value), // library requires string
        }))}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select participants' : '...'}
        search
        searchPlaceholder="Search people..."
        style={[
          styles.dropdown,
          isFocus && styles.dropdownFocus,
        ]}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        inputSearchStyle={styles.searchInput}
        iconStyle={styles.icon}
        value={value.map(String)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(selectedValues: string[]) => {
          onChange(selectedValues.map(Number));
        }}
      />
    </View>
  );
};

export default PeopleMultiSelect;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937', // slate-800
  },

  dropdown: {
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },

  dropdownFocus: {
    borderColor: '#3b82f6', // blue-500
  },

  dropdownContainer: {
    borderRadius: 12,
  },

  placeholder: {
    fontSize: 14,
    color: '#9ca3af', // gray-400
  },

  selectedText: {
    fontSize: 14,
    color: '#111827', // gray-900
    fontWeight: '500',
  },

  searchInput: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
    color: '#111827',
  },

  icon: {
    width: 22,
    height: 22,
  },
});
