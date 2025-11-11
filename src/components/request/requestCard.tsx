import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constant/theme';

interface MoneyRequestCardProps {
  ownerName?: string;
  amount?: string;
  action?: string;
  showDivider?: boolean;
  requestPersonName?: string;
  handleOnPressRequestButton?: () => void;
}

const MoneyRequestCard: React.FC<MoneyRequestCardProps> = ({
  ownerName = 'Tien Loc',
  requestPersonName = 'QuangDang',
  action = 'owns', //owns, borrow
  amount = '194,000 VND',
  showDivider = true,
  handleOnPressRequestButton,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>{ownerName}</Text>
        <View style={styles.DetailRequestSection}>
          <Text>{action}</Text>
          <View style={styles.moneyRequestButton}>
            <Text style={{ color: 'red' }}>{amount}</Text>
            <TouchableOpacity
              style={styles.functionCircle}
              onPress={handleOnPressRequestButton}
            >
              <Text>Request</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text>{requestPersonName}</Text>
      </View>
      {showDivider && <View style={styles.line}></View>}
    </View>
  );
};

export default MoneyRequestCard;

const styles = StyleSheet.create({
  container: {
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    margin: 2,
    backgroundColor: '#ccc',
  },
  moneyRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  SectionHeaderText: {
    fontSize: 12,
    color: colors.secondary,
    paddingBottom: 10,
  },
  DetailRequestSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  functionCircle: {
    width: 87,
    height: 33,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 3,
  },
});
