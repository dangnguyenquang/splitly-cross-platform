import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { getAllUserConnections } from '@/src/api/connection.api';
import AvoidKeyboard from '@/src/components/AvoidKeyboard';
import AlphabetIndex from '@/src/components/contacts/AlphabetIndex';
import ContactRow from '@/src/components/contacts/ContactRow';
import ContactsTabs from '@/src/components/contacts/ContactsTabs';
import SearchBarPreview from '@/src/components/contacts/SearchBarPreview';
import SearchOverlay from '@/src/components/contacts/SearchOverlay';
import useKeyboard from '@/src/components/contacts/useKeyboard';
import CustomHeader from '@/src/components/header/index';
import LoadingSpin from '@/src/components/LoadingSpin';
import { colors } from '@/src/constant/theme';
import { RootState } from '@/src/store/store';
import type { Connection, Contact, Navigation } from '@/src/types';
import { useNavigation } from '@react-navigation/native';
import { Feather } from 'lucide-react-native';

const TABS = ['All Contacts', 'Invitations Received'] as const;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const RIGHT_GUTTER = 15; // space reserved star vs alphabet bar
function ContactScreen(): React.ReactElement {
  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );
  const navigation = useNavigation<Navigation>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>('All Contacts');
  const [loading, setLoading] = useState(true);

  const [searchOpen, setSearchOpen] = useState(false);

  const keyboard = useKeyboard();

  useEffect(() => {
    let mounted = true;

    async function fetchConnections(): Promise<void> {
      try {
        setLoading(true);

        if (!token) {
          if (mounted) setContacts([]);
          return;
        }

        const connections: Connection[] = await getAllUserConnections(token);

        const mapped: Contact[] = connections.map(conn => ({
          id: conn.userId,
          name: conn.fullName || conn.username || 'Unknown',
          email: conn.email || '',
          avatar: conn.avatarUrl || '',
          isFavorite: !!conn.accepted,
          role: conn.role,
          accepted: conn.accepted,
        }));
        console.log('mapped', mapped);
        mapped.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', undefined, {
            sensitivity: 'base',
          }),
        );

        if (mounted) setContacts(mapped);
      } catch (e: any) {
        if (mounted) {
          Alert.alert('Error', e?.message ?? 'Failed to load contacts');
          setContacts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchConnections();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (activeTab === 'Invitations Received')
        return c.role === 'RECEIVER' && c.accepted === false;
      else if (activeTab === 'All Contacts') return c.accepted === true;
      return true;
    });
  }, [contacts, activeTab]);

  const letterToIndex = useMemo(() => {
    const map = new Map<string, number>();
    filteredContacts.forEach((c, idx) => {
      const first = (c.name || '').trim().charAt(0).toUpperCase();
      const key = first >= 'A' && first <= 'Z' ? first : null;
      if (key && !map.has(key)) map.set(key, idx);
    });
    return map;
  }, [filteredContacts]);

  const handleAcceptInvitation = (contactId: number) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === contactId ? { ...c, accepted: !c.accepted } : c,
      ),
    );
    // TODO: call API update favorite later if needed
  };

  const handlePressAdd = () => {
    console.log('Add', 'TODO: add contact');
    navigation.navigate('NewContact');
  };

const renderItem = ({ item }: { item: Contact }) => {
  const showAcceptAction = activeTab === 'Invitations Received'

  return (
    <ContactRow
      contact={item}
      showAcceptAction={showAcceptAction}
      onAccept={() => handleAcceptInvitation(item.id)}
      onPress={() =>
        navigation.navigate('ContactDetail', { contact: item })
      }
    />
  );
};


  // Search overlay covers everything; hide alphabet/fab while searching (matches screenshot)
  if (searchOpen) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <SearchOverlay
          contacts={contacts}
          onClose={() => setSearchOpen(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AvoidKeyboard>
        <View className="flex-1">
          <CustomHeader
            title="Contact"
            onLeftPress={() => console.log('Menu pressed')}
            onRightPress={() => console.log('More pressed')}
            titleColor="#050404ff"
            shadow={true}
            leftIcon={{
              type: 'image',
              source: require('@/assets/logo-rmbg.png'),
            }}
            rightIcon={{
              type: 'icon',
              component: MaterialIcons,
              name: 'more-vert',
              size: 28,
              color: '#111827',
            }}
          />

          <View className="px-4 pt-3">
            <SearchBarPreview onPress={() => setSearchOpen(true)} />
            <ContactsTabs
              tabs={[...TABS]}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
            />
          </View>

          <View className="flex-1">
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <LoadingSpin />
              </View>
            ) : (
              <FlatList
                data={filteredContacts}
                keyExtractor={item => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingBottom: 120,
                  paddingRight: RIGHT_GUTTER,
                }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* AlphabetIndex */}
          {!loading && (
            <AlphabetIndex
              letters={ALPHABET}
              hasLetter={(l: string) => letterToIndex.has(l)}
              keyboardHeight={keyboard.height}
              onPressLetter={(l: string) => {
                const idx = letterToIndex.get(l);
                if (idx == null) return;
              }}
            />
          )}

          {/* Floating add button */}
          <Pressable
            onPress={handlePressAdd}
            style={[
              {
                position: 'absolute',
                right: 18,
                bottom: 18 + (keyboard.visible ? keyboard.height : 0),
              },
            ]}
            className="h-14 w-14 items-center justify-center rounded-full bg-amber-400"
          >
            <MaterialIcons name="add" size={28} color="#111827" />
          </Pressable>
        </View>
      </AvoidKeyboard>
    </SafeAreaView>
  );
}

export default ContactScreen;
