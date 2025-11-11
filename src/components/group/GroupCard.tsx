import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Group } from '../../../types';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.coverImage}>
        {group.coverImage ? (
          <Image source={{ uri: group.coverImage }} style={styles.cover} />
        ) : (
          <View style={styles.placeholderCover} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{group.title}</Text>

        <View style={styles.avatarContainer}>
          {group &&
            group.participants &&
            group.participants
              .slice(0, 6)
              .map((participant, index) => (
                <Image
                  key={participant.id}
                  source={{ uri: participant.avatar }}
                  style={[
                    styles.avatar,
                    { marginLeft: index > 0 ? -12 : 0, zIndex: 6 - index },
                  ]}
                />
              ))}
        </View>
      </View>

      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cover: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#999',
  },
});

export default GroupCard;
