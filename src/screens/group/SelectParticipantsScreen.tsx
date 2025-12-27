// src/screens/SelectParticipantsScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import ContactItem from '../../components/group/ContactItem';
import Header from '../../components/Header';
import TabSwitch from '../../components/TabSwitch';
import AvatarList from '../../components/group/AvatarList';
import ActionButtons from '../../components/group/ActionButtons';

import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  RootStackParamList,
  Contact,
  CreateGroupRequest,
  Connection,
} from '@/src/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  createGroup,
  getAllConnectionsOfCurrentUsers,
} from '@/src/api/group.api';
import axios from 'axios';
import { RootState } from '@/src/store/store';
import { uploadGroupImage } from '@/src/api/image.api';
import { setCurrentGroup } from '@/src/store/groupSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

type SelectParticipantsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const SelectParticipantsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Contacts');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const currentGroup = useSelector(
    (state: RootState) => state.group.currentGroup,
  );
  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation<SelectParticipantsScreenNavigationProp>();
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchConnections = async () => {
      try {
        const connections: Connection[] =
          await getAllConnectionsOfCurrentUsers(token);

        const mappedContacts: Contact[] = connections.map(conn => ({
          id: conn.userId,
          name: conn.fullName || conn.username,
          email: conn.email,
          avatar: conn.avatarUrl,
          isFavorite: conn.accepted,
        }));

        setContacts(mappedContacts);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [token]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return contacts.filter(contact => {
      const matchesSearch =
        contact.name.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q);

      const matchesTab =
        activeTab === 'All Contacts' ||
        (activeTab === 'Favorites' && contact.isFavorite);

      return matchesSearch && matchesTab;
    });
  }, [contacts, searchQuery, activeTab]);

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

  const handleSave = async () => {
    if (saving) return; // ⛔ prevent double submit

    console.log('================ CREATE GROUP =================');

    console.log('[1] Selected contacts:', selectedContacts);

    // 1️⃣ Validate participants
    if (selectedContacts.length === 0) {
      Alert.alert('Validation', 'Please select at least one participant');
      return;
    }

    console.log('[2] Current group from Redux:', currentGroup);

    // 2️⃣ Validate auth
    if (!token) {
      Alert.alert('Auth error', 'Missing token');
      return;
    }

    const payload: CreateGroupRequest = {
      groupName: currentGroup?.groupName || 'Group Name',
      description: currentGroup?.description || '',
      category: currentGroup?.category || 'Other',
      currency: currentGroup?.currency || 'USD',
      emailList: selectedContacts.map(c => c.email),
    };

    console.log('[3] CreateGroup payload:', payload);

    try {
      setSaving(true); // 🔒 lock UI actions

      // 3️⃣ Create group
      console.log('[4] Calling createGroup API...');
      const group = await createGroup(dispatch, payload, token, navigation);

      console.log('[5] Group created successfully:', group);

      const groupId = group.groupId;
      console.log('[6] Created groupId:', groupId);

      // 4️⃣ Upload image (optional)
      let uploadedImageUrl = '';

      if (currentGroup?.groupImage) {
        console.log('[7] Uploading group image:', currentGroup.groupImage);

        uploadedImageUrl = await uploadGroupImage(
          currentGroup.groupImage,
          token,
          groupId,
        );

        console.log('[8] Image uploaded successfully:', uploadedImageUrl);
      }

      // 5️⃣ Update Redux AFTER everything succeeds
      dispatch(
        setCurrentGroup({
          ...group,
          groupImage: uploadedImageUrl || currentGroup?.groupImage || '',
        }),
      );

      console.log(
        '=============== GROUP CREATED SUCCESSFULLY ================',
      );

      // Navigate ONLY AFTER success
      navigation.replace('MainApp', {
        screen: 'Group', // match your BottomTab
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          '[API ERROR] createGroup Axios error:',
          error.response?.data || error.message,
        );
      } else {
        console.error('[API ERROR] createGroup unknown error:', error);
      }

      Alert.alert('Error', 'Failed to create group');
    } finally {
      setSaving(false); // 🔓 unlock even if error
    }
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <ContactItem
      contact={item}
      isSelected={selectedContacts.some(c => c.id === item.id)}
      onToggle={() => toggleContact(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
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
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
      <ActionButtons
        onCancel={handleBack}
        onSave={handleSave}
        saveText="Create group"
      />
    </SafeAreaView>
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
