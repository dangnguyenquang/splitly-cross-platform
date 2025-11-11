import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constant/theme';

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginHorizontal: 16,
        marginVertical: 10,
        padding: 4,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => navigation.navigate(route.name)}
            style={{
              flex: 1,
              backgroundColor: isFocused ? colors.primary : 'transparent',
              borderRadius: 40,
              paddingVertical: 6,
              alignItems: 'center',
              borderColor: isFocused ? colors.primary : '#0c0606ff',
              borderWidth: 1,
              marginHorizontal: 3,
            }}
          >
            <Text
              style={{
                color: '#000',
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
