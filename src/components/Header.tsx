// src/components/Header.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  showLogo?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  showMenu,
  showLogo,
  onBack,
  onMenu,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showLogo && (
          <Image
            source={require('@/assets/logo.png')}
            style={styles.logo}
          />
        )}
        {showBack && (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSection}>
        {showMenu && (
          <Pressable onPress={onMenu} style={styles.menuButton}>
            <Text style={styles.menuIcon}>⋮</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    width: 40,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  logo: {
    width: 32,
    height: 32,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 28,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Header;
