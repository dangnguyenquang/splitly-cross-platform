import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../../constant/theme';
import { RootStackParamList } from '@/navigation/types';
interface IFooterContentProps {
  text: string;
  boldText: string;
  linkTo: keyof RootStackParamList;
}
export default function FooterContent({
  text,
  boldText,
  linkTo,
}: Readonly<IFooterContentProps>) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View className='flex-row items-center justify-center pt-16 gap-1'>
      <Text style={styles.textFooter}>{text} </Text>
      <Pressable onPress={() => navigation.navigate(linkTo as any)}>
        <Text style={styles.textBold}>{boldText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  textFooter: {
    textAlign: 'center',
    fontSize: 20,
  },
  textBold: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
