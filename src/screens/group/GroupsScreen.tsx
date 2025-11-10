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

type GroupsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;


const GroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    setGroups([])
  }, [])

  const navigation = useNavigation<GroupsScreenNavigationProp>()
  const handleSelectGroup = (group: Group) => {
    console.log(group)
    // navigation.navigate('GroupDetail', { groupId: group.id });
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <GroupCard group={item} onPress={() => handleSelectGroup(item)} />
  );

  return (
    <View style={styles.container}>
      <Header title="Groups" showLogo showMenu />

      {groups.length === 0 ? (
        <EmptyState onCreateGroup={handleCreateGroup} />
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          // keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

    </View>
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
});

export default GroupsScreen;