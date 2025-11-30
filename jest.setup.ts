// // jest.setup.ts

// // Add custom matchers from testing-library
// import '@testing-library/jest-native/extend-expect';

// // Mock AsyncStorage
// jest.mock('@react-native-async-storage/async-storage', () => ({
//   setItem: jest.fn(),
//   getItem: jest.fn(),
//   removeItem: jest.fn(),
// }));

// // Mock Native Animated Helper
// // Wrap in try/catch because in RN >= 0.71 it may not exist
// try {
//   jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// } catch (e) {
//   // Module not found, safe to ignore
// }


// // Mock AsyncStorage
// jest.mock('@react-native-async-storage/async-storage', () => ({
//   setItem: jest.fn(),
//   getItem: jest.fn(),
//   removeItem: jest.fn(),
// }));

// // Mock react-native-vector-icons to avoid font parsing issues
// jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
// jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
// jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');


// jest.mock('react-native-reanimated', () =>
//   require('react-native-reanimated/mock')
// );

// // Mock react-native-vector-icons
// jest.mock('react-native-vector-icons', () => 'Icon');

// jest.setup.ts

// Add custom matchers from testing-library
import '@testing-library/jest-native/extend-expect';

// --- Mocks Cần Thiết ---

// Mock AsyncStorage (Chỉ cần 1 lần)
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Native Animated Helper (để tránh lỗi khi chạy test)
// Wrap in try/catch because in RN >= 0.71 it may not exist
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch (e) {
  // Module not found, safe to ignore
}

// Mock react-native-reanimated (Sử dụng mock tích hợp sẵn)
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Mock react-native-vector-icons (Dùng mock chung để tránh lỗi parse font)
// Mock này thay thế cho 3 mock chi tiết bạn đã liệt kê
jest.mock('react-native-vector-icons', () => 'Icon');

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

