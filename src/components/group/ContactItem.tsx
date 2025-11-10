// src/components/ContactItem.tsx
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Contact } from '../../../types';

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onToggle: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isSelected, onToggle }) => {
  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <Image source={{ uri: contact.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.email}>{contact.email}</Text>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  checkmark: {
    width: 28,
    height: 28,
  },
  checkmarkText: {
    fontSize: 24,
    color: '#000',
  },
});

export default ContactItem;