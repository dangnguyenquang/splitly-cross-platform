module.exports = {
  presets: [
    'module:@react-native/babel-preset', // handles React Native + JSX
    'nativewind/babel',
    '@babel/preset-typescript', // TS support
  ],
  
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
          '@src': './src',
        },
      },
    ],
  ],
};
