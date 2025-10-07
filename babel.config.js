module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'react' }],
    ],
    plugins: [
      // React Native Reanimated plugin (if using animations)
      'react-native-reanimated/plugin',
      
      // PWA plugin for service worker
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      
      // Optional: Enable experimental features
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  };
};
