import { Spinner } from '@/components/ui/spinner';
import { colors } from '@/src/constant/theme';
import { View } from 'react-native';

export default function LoadingSpin() {
  return (
    <View className="absolute inset-0 bg-black/20 items-center justify-center">
      <Spinner size={60} color={colors.primary} />
    </View>
  );
}
