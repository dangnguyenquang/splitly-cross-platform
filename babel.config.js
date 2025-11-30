module.exports = {
  presets: [
    'module:@react-native/babel-preset', 
    'nativewind/babel',
    '@babel/preset-typescript', 
    //'@babel/preset-env',
    //'@babel/preset-react',
    //'@babel/preset-flow',
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
