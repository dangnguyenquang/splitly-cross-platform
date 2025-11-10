// src/components/AvatarList.tsx
import React from 'react';
import { Image, StyleSheet, ScrollView } from 'react-native';
import { Contact } from '../../../types';

interface AvatarListProps {
  contacts: Contact[];
  maxDisplay?: number;
}

const AvatarList: React.FC<AvatarListProps> = ({ contacts, maxDisplay = 6 }) => {
  const displayContacts = contacts.slice(0, maxDisplay);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      {displayContacts.map((contact) => (
        <Image
          key={contact.id}
          source={{ uri: contact.avatar }}
          style={styles.avatar}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#fff',
  },
  container: {
    alignSelf: 'flex-start',
    flexGrow: 0,
  }
});

export default AvatarList;