import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { colors } from '../constant/theme';

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
      style={styles.scrollView}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent',
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
              style={[
                styles.touchableButton,
                {
                  backgroundColor: isFocused ? colors.primary : 'transparent',
                  borderColor: isFocused ? colors.primary : '#0c0606ff',
                },
              ]}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    maxHeight: 60,
  },
  scrollViewContent: {
    paddingHorizontal: 8,
    // paddingVertical: 10,
    flexGrow: 0,
  },
  touchableButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 3,
    alignSelf: 'center',
    height: 33,
    width: 100,
  },
});
