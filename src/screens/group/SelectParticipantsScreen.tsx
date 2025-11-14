// src/screens/SelectParticipantsScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import { mockContacts } from '../../../data/mockData';
import ContactItem from '../../components/group/ContactItem';
import Header from '../../components/Header';
import TabSwitch from '../../components/TabSwitch';
import AvatarList from '../../components/group/AvatarList';
import ActionButtons from '../../components/group/ActionButtons';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Contact } from '@/src/types';

type SelectParticipantsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type SelectParticipantsRouteProp = RouteProp<
  RootStackParamList,
  'SelectParticipants'
>;

const SelectParticipantsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Contacts');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const navigation = useNavigation<SelectParticipantsScreenNavigationProp>();
  const route = useRoute<SelectParticipantsRouteProp>();

  const { groupData } = route.params;

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'All Contacts' ||
      (activeTab === 'Favorites' && contact.isFavorite);

    return matchesSearch && matchesTab;
  });

  const toggleContact = (contact: Contact) => {
    setSelectedContacts(prev =>
      prev.find(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact],
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    console.log(groupData);
    navigation.navigate('GroupsScreen');
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <ContactItem
      contact={item}
      isSelected={selectedContacts.some(c => c.id === item.id)}
      onToggle={() => toggleContact(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Header title="Select Participants" showBack onBack={handleBack} />

      <TextInput
        style={styles.searchBar}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search contact"
        placeholderTextColor="#888"
      />

      {selectedContacts.length > 0 && (
        <AvatarList contacts={selectedContacts} />
      )}

      <TabSwitch
        tabs={['All Contacts', 'Favorites']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      <ActionButtons onCancel={handleBack} onSave={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 10,
  },
});

export default SelectParticipantsScreen;
