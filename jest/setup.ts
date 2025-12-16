import 'react-native-gesture-handler/jestSetup';

// Mock Reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialIcons', () =>
  require('../__mocks__/react-native-vector-icons').default
);
jest.mock('react-native-vector-icons/Ionicons', () =>
  require('../__mocks__/react-native-vector-icons').default
);
jest.mock('react-native-vector-icons/FontAwesome', () =>
  require('../__mocks__/react-native-vector-icons').default
);
