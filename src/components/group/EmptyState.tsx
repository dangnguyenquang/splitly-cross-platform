// src/components/EmptyState.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface EmptyStateProps {
  onCreateGroup: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateGroup }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={[styles.clipboard, styles.clipboardBack]}>
          <View style={styles.clip} />
        </View>
        <View style={[styles.clipboard, styles.clipboardFront]}>
          <View style={styles.clip} />
        </View>
      </View>

      <Text style={styles.title}>Empty</Text>
      <Text style={styles.subtitle}>You haven't created a group yet</Text>

      <Pressable style={styles.button} onPress={onCreateGroup}>
        <Text style={styles.buttonIcon}>+</Text>
        <Text style={styles.buttonText}>Create a New Group</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  clipboard: {
    position: 'absolute',
    width: 140,
    height: 160,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  clipboardBack: {
    left: 0,
    top: 20,
    transform: [{ rotate: '-10deg' }],
  },
  clipboardFront: {
    right: 0,
    top: 0,
    backgroundColor: '#f0f0f0',
    transform: [{ rotate: '5deg' }],
  },
  clip: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 16,
    backgroundColor: '#FFC107',
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC107',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default EmptyState;
