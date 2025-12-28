import AvoidKeyboard from '@/src/components/AvoidKeyboard';
import ContactRow from '@/src/components/contacts/ContactRow';
import SearchHistoryHeader from '@/src/components/contacts/SearchHistoryHeader';
import useSearchHistory from '@/src/components/contacts/useSearchHistory';
import type { Contact, Navigation } from '@/src/types';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';

type Props = {
  contacts: Contact[];
  onClose: () => void;
};

function SearchOverlay(props: Readonly<Props>): React.ReactElement {
  const [q, setQ] = useState('');
  const history = useSearchHistory();
  const navigation = useNavigation<Navigation>();

  useEffect(() => {
    // pre-warm history on open
    history.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];

    return props.contacts.filter(c => {
      return (
        (c.name || '').toLowerCase().includes(query) ||
        (c.email || '').toLowerCase().includes(query)
      );
    });
  }, [q, props.contacts]);

  const data: Contact[] = q.trim().length === 0 ? history.items : results;

  const handlePick = (c: Contact) => {
    history.add(c);
    // TODO: navigate to contact detail if you want
  };

  return (
    <AvoidKeyboard>
      <View className="flex-1 bg-white">
        {/* Top search bar like screenshot */}
        <View className="px-4 pt-2">
          <View className="flex-row items-center">
            <Pressable onPress={props.onClose} hitSlop={10} className="mr-2">
              <MaterialIcons name="arrow-back" size={22} color="#111827" />
            </Pressable>

            <View className="flex-1 flex-row items-center rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
              <MaterialIcons name="search" size={20} color="#6B7280" />
              <TextInput
                autoFocus
                value={q}
                onChangeText={text => {
                  setQ(text);
                  // TODO: debounce + call API search later if server-side
                }}
                placeholder="Search"
                placeholderTextColor="#9CA3AF"
                className="ml-2 flex-1 text-[15px] text-neutral-900"
                returnKeyType="search"
              />
            </View>
          </View>
        </View>

        {/* Recent searches header (only when q empty) */}
        {q.trim().length === 0 && (
          <SearchHistoryHeader
            onClear={() => history.clear()}
            disabled={history.items.length === 0}
          />
        )}

        <FlatList
          data={data}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <ContactRow
              contact={item}
              onPress={() => {
                handlePick(item);
                navigation.navigate('ContactDetail', { contact: item });
              }}
              variant="search"
            />
          )}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </AvoidKeyboard>
  );
}

export default SearchOverlay;
