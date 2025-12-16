import type { Config } from "jest";

const config: Config = {
  preset: "react-native",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|ts|tsx)$": "babel-jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|react-native-vector-icons" +
      "|@react-navigation" +
      "|react-native-css-interop" +
      ")/)"
  ],

  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
