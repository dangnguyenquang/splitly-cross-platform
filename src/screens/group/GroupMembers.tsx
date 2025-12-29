import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Feather from '@react-native-vector-icons/feather';

import { RootState } from '@/src/store/store';
import { colors } from '@/src/constant/theme';
import { GroupUserDTO, RootStackParamList } from '@/src/types';
import { getGroupUsers, inviteUserToGroup } from '@/src/api/group.api';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80';

type GroupMembersRouteProp = RouteProp<
  RootStackParamList,
  'GroupMember'
>;

const GroupMembersScreen: React.FC = () => {
  const route = useRoute<GroupMembersRouteProp>();
  const navigation = useNavigation();
  const { group } = route.params;

  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );
  const currentUserId = useSelector(
    (state: RootState) => state.auth.login.currentUser?.userId,
  );

  const [members, setMembers] = useState<GroupUserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /** =======================
   *  INVITE MODAL STATE
   ======================= */
  const [inviteVisible, setInviteVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  /** =======================
   *  PERMISSION
   ======================= */
  const isAdmin = useMemo(() => {
    return members.some(
      m =>
        m.userId === currentUserId &&
        m.roles?.some(r => r.roleName === 'ADMIN'),
    );
  }, [members, currentUserId]);

  /** =======================
   *  FETCH MEMBERS
   ======================= */
  const fetchMembers = async () => {
    if (!token || !group?.groupId) return;

    try {
      setLoading(true);
      const res = await getGroupUsers(group.groupId, token);
      setMembers(res ?? []);
    } catch (error) {
      console.error('❌ Fetch group members failed:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [group?.groupId, token]);

  const onRefresh = useCallback(async () => {
    if (!token) return;

    try {
      setRefreshing(true);
      const res = await getGroupUsers(group?.groupId, token);
      setMembers(res ?? []);
    } catch (error) {
      console.error('❌ Refresh members failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [group?.groupId, token]);

  /** =======================
   *  INVITE HANDLER
   ======================= */
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter email');
      return;
    }

    try {
      setInviting(true);
      await inviteUserToGroup(group?.groupId, inviteEmail.trim(), token!);
      Alert.alert('Success', 'Invitation sent');
      setInviteVisible(false);
      setInviteEmail('');
    } catch (err: any) {
      Alert.alert(
        'Invite failed',
        err?.response?.data?.message ?? 'Something went wrong',
      );
    } finally {
      setInviting(false);
    }
  };

  /** =======================
   *  RENDER MEMBER
   ======================= */
  const renderMember = ({ item }: { item: GroupUserDTO }) => {
    const roleName = item.roles?.[0]?.roleName ?? 'MEMBER';
    const isAdminMember = roleName === 'ADMIN';

    return (
      <View style={styles.memberCard}>
        <Image
          source={{ uri: item.userImage || DEFAULT_AVATAR }}
          style={styles.avatar}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>

        <View
          style={[
            styles.roleBadge,
            isAdminMember ? styles.adminBadge : styles.memberBadge,
          ]}
        >
          <Text style={styles.roleText}>{roleName}</Text>
        </View>
      </View>
    );
  };

  /** =======================
   *  UI
   ======================= */
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={26} />
          </TouchableOpacity>

          <Image
            source={{ uri: group?.groupImage || DEFAULT_AVATAR }}
            style={styles.groupAvatar}
          />
          <Text style={styles.groupName}>{group?.groupName}</Text>
        </View>

        {isAdmin && (
          <Feather
            name="user-plus"
            size={22}
            color={colors.primary}
            onPress={() => setInviteVisible(true)}
          />
        )}
      </View>

      {/* CONTENT */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : members.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No members found</Text>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={item => item.userId.toString()}
          renderItem={renderMember}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* INVITE MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={inviteVisible}
        onRequestClose={() => setInviteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Invite member</Text>

            <TextInput
              placeholder="Enter email"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setInviteVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inviteBtn}
                onPress={handleInvite}
                disabled={inviting}
              >
                {inviting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.inviteText}>Invite</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupMembersScreen;

/* =======================
 *  STYLES
 ======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  groupAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  groupName: { fontSize: 17, fontWeight: '700' },

  listContent: { padding: 16 },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  email: { fontSize: 13, color: colors.secondary },

  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  adminBadge: { backgroundColor: '#F97316' },
  memberBadge: { backgroundColor: '#3B82F6' },
  roleText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.secondary },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  cancel: { fontSize: 15, color: colors.secondary },
  inviteBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  inviteText: { color: '#fff', fontWeight: '700' },
});
