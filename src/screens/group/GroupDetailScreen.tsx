import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GroupDetailTopTabs from '@/src/navigation/GroupDetailTopTab';
import { GroupDetailInformation, RootStackParamList } from '@/src/types';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/src/utils/dimension';

type GroupDetailScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type GroupDetailScreenProp = RouteProp<RootStackParamList, 'GroupDetail'>;
const GroupDetailScreen: React.FC = () => {
  const route = useRoute<GroupDetailScreenProp>();
  const { groupId, group } = route.params;
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const [groupDetail, setGroupDetail] = useState<GroupDetailInformation>();

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchGroups = async () => {};

    fetchGroups();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={group?.groupName || 'Group Detail'}
        showBack={true}
        showMenu
        onBack={handleBack}
      />
      <View style={styles.groupAvatarContainer}>
        <Image
          source={{
            uri:
              group?.groupImage ||
              'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
          }}
          resizeMode="cover"
          style={styles.groupAvatar}
        />
      </View>
      <View style={styles.topTabContainer}>
        <GroupDetailTopTabs groupId={groupId} group={group} />
      </View>
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
  groupAvatarContainer: {
    alignItems: 'center',
    padding: 10,
  },
  groupAvatar: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  topTabContainer: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.2,
  },
});

export default GroupDetailScreen;
