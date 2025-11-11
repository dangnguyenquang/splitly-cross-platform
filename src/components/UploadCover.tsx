// src/components/UploadCover.tsx
import React from 'react';
import { Text, Pressable, StyleSheet, Image } from 'react-native';

interface UploadCoverProps {
  imageUri?: string;
  onPress: () => void;
}

const UploadCover: React.FC<UploadCoverProps> = ({ imageUri, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <>
          <Text style={styles.icon}>📤</Text>
          <Text style={styles.text}>Upload Cover Image</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default UploadCover;