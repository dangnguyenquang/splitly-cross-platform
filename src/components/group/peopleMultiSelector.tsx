import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Apply to People</Text>

      <MultiSelect
        data={data.map(item => ({
          ...item,
          value: String(item.value), // 🔴 convert to string for library
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select people"
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        /** 🔴 MultiSelect requires string[] */
        value={value.map(String)}
        /** 🔴 onChange also returns string[] */
        onChange={(selectedValues: string[]) => {
          onChange(selectedValues.map(Number)); // convert back to number[]
        }}
      />
    </View>
  );
};

export default PeopleMultiSelect;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  selectedText: {
    fontSize: 14,
    color: '#333',
  },
});
