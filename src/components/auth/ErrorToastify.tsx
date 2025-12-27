import { LoginForm } from '@/src/types';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
interface ErrorToastifyIProps {
  errors: FieldErrors<LoginForm>;
  onClose: () => void;
}
export default function ErrorToastify(props: Readonly<ErrorToastifyIProps>) {
  const { errors, onClose } = props;
  return (
    <View className="pb-4">
      {errors.root?.message && (
        <View className="flex-row justify-between items-center bg-red-200 py-2 px-3 rounded-lg">
          <View className="flex-row items-center gap-2">
            <Ionicons name="information-circle-outline" size={24} color="red" />
            <Text className="text-slate-900">{errors.root.message}</Text>
          </View>
          <MaterialIcons name="close" size={20} color="red" onPress={onClose} />
        </View>
      )}
    </View>
  );
}
