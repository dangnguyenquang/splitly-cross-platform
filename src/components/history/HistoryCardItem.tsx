import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CardItem: React.FC<CardItemProps> = ({
  username,
  showDivider = true,
  avatarUrl = 'https://i.pravatar.cc/150?img=1',
  time = '09:41 PM',
  amount = '100000vnd',
  type = 'Pay',
  onPress = () => {},
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View style={styles.item}>
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>

        <View>
          <Text style={{ fontSize: 20, fontWeight: '300' }}>{username}</Text>
          <Text style={styles.underText}>{time}</Text>
        </View>
      </View>

      <View style={styles.moneySection}>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>{amount}</Text>
        <Text style={styles.underText}>{type}</Text>
      </View>
    </View>
    {showDivider && <View style={styles.lineCard}></View>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  underText: {
    fontSize: 12,
    color: '#939393',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  moneySection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  SectionDivider: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineCard: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 24,
    marginRight: 24,
  },
});
export default CardItem;
