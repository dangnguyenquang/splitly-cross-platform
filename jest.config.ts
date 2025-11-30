// import type { Config } from '@jest/types';

// const config: Config.InitialOptions = {
//   preset: 'react-native',
//   transform: {
//     '^.+\\.(js|ts|tsx)$': 'babel-jest',
//   },
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
//     transformIgnorePatterns: [
//     'node_modules/(?!(' +
//         'react-native|' +
//         '@react-native|' +
//         '@react-navigation|' +
//         'react-native-screens|' +
//         'react-native-safe-area-context|' +
//         'react-native-gesture-handler|' +
//         'react-native-vector-icons|' +
//         'react-native-css-interop' +
//     ')/)',
//     ],
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//     '\\.(jpg|jpeg|png|gif|webp|svg|ttf|otf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.ts',
//   },
// };

// export default config;
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'react-native',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect','<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
     //'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-vector-icons)/)',
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-vector-icons|react-native-css-interop)/)',
    ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|webp|svg|ttf|otf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.ts',
  },
};

export default config;
