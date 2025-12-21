import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const TotalScreen: React.FC = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Total</Text>
    </View>
  );
};

export default TotalScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
