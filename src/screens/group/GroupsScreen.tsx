// src/screens/GroupsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Group } from '../../../types';
import GroupCard from '../../components/group/GroupCard';
import Header from '../../components/Header';
import EmptyState from '../../components/group/EmptyState';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockGroups } from '@/data/mockData';

import { Fab, FabIcon } from '../../../components/ui/fab';
import { AddIcon } from '../../../components/ui/icon';
import { colors } from '@/src/constant/theme';
type GroupsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      setGroups(mockGroups);
    };

    fetchGroups();
  }, []);

  const navigation = useNavigation<GroupsScreenNavigationProp>();
  const handleSelectGroup = (group: Group) => {
    console.log(group);
    navigation.navigate('GroupDetail', { groupId: group.id, group: group });
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <GroupCard group={item} onPress={() => handleSelectGroup(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Groups" showLogo showMenu />

      {groups.length === 0 ? (
        <EmptyState onCreateGroup={handleCreateGroup} />
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={groups}
            renderItem={renderGroup}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
          <Fab
            size="lg"
            placement="bottom right"
            isHovered={false}
            isDisabled={false}
            isPressed={false}
            onPress={() => navigation.navigate('CreateGroup')}
            style={styles.fabButton}
          >
            <FabIcon as={AddIcon} style={styles.fabIcon} />
          </Fab>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingVertical: 16,
  },
  fabButton: {
    backgroundColor: colors.primary,
    color: colors.primary,
    width: 60,
    height: 60,
  },
  fabIcon: {
    color: 'black',
  },
});

export default GroupsScreen;
