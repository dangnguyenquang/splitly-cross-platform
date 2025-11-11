// src/components/ActionButtons.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  cancelText?: string;
  saveText?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSave,
  cancelText = 'Cancel',
  saveText = 'Continue',
}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>{cancelText}</Text>
      </Pressable>

      <Pressable style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>{saveText}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFC107',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: '#FFC107',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default ActionButtons;
