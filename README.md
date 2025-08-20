

Install the required peer dependencies:

```bash
npm install react-native @react-navigation/native @react-navigation/native-stack
npm install react-i18next i18next
npm install @react-native-google-signin/google-signin @invertase/react-native-apple-authentication
npm install react-native-fast-image react-native-gradients axios
npm install react-native-image-crop-picker
npm install react-native-reanimated react-native-heroicons 
npm install axios
npm install react-native-localize

```

Setup babel.config.json and metro.config.json for react-native-reanimated package
```typescript
ex. babel.config.json:
    module.exports = {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    env: {
        production: {
        plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin'],
        },
    },
    };

ex. metro.config.json:
    const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
    const { withNativeWind } = require('nativewind/metro');
    const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

    // Varsayılan Metro yapılandırmasını alın
    const defaultConfig = getDefaultConfig(__dirname);
    const { assetExts, sourceExts } = defaultConfig.resolver;

    // Metro yapılandırmasını özelleştirin
    const config = mergeConfig(defaultConfig, {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
    },
    });

    // NativeWind ve Reanimated Metro yapılandırmalarını doğru şekilde birleştirin
    const finalConfig = withNativeWind(config, { input: './global.css' });
    module.exports = wrapWithReanimatedMetroConfig(finalConfig);

```
