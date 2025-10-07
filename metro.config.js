const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Images
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
  // Fonts
  'ttf', 'otf', 'woff', 'woff2',
  // Data
  'json', 'csv', 'geojson'
);

// Add support for source maps
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Configure transformer for better performance
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable hermes for better performance
config.transformer.hermesParser = true;

module.exports = config;
