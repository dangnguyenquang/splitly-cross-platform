import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { AddIcon } from '../../../components/ui/icon';
import GroupCard from '../../components/group/GroupCard';
import Header from '../../components/Header';
import EmptyState from '../../components/group/EmptyState';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, Group } from '@/src/types';
import { RootState } from '@/src/store/store';
import { getAllGroupsByUser } from '@/src/api/group.api';
import { Fab, FabIcon } from '@/components/ui/fab';
import { colors } from '@/src/constant/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header/index';

type GroupsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GroupsScreen: React.FC = () => {
  const navigation = useNavigation<GroupsScreenNavigationProp>();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );

  useEffect(() => {
    const fetchGroups = async () => {
      if (!token) return;

      setLoading(true);

      try {
        const data = await getAllGroupsByUser(token);

        if (Array.isArray(data)) {
          setGroups(data);
        } else {
          setGroups([]);
        }
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  const handleSelectGroup = (group: Group) => {
    console.log(group);
    navigation.navigate('GroupDetail', {
      groupId: group.groupId.toString(),
      group: group,
    });
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <GroupCard group={item} onPress={() => handleSelectGroup(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title='Groups'
        onLeftPress={() => navigation.goBack()}
        backgroundColor={"#FFFFFF"}
        titleColor="#050404ff"
        shadow={true}
      />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : groups.length === 0 ? (
        <EmptyState onCreateGroup={handleCreateGroup} />
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={groups}
            keyExtractor={(item, index) =>
              item?.groupId?.toString() ?? index.toString()
            }
            renderItem={renderGroup}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
