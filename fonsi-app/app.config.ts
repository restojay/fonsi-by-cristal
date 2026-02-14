import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Fonsi by Cristal',
  slug: 'fonsi-by-cristal',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'fonsi',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0a0a0a',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.fonsi.cristal',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0a0a0a',
    },
    package: 'com.fonsi.cristal',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    ['expo-splash-screen', { backgroundColor: '#0a0a0a', image: './assets/splash.png', imageWidth: 200 }],
    ['expo-notifications', { icon: './assets/icon.png', color: '#ffffff' }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    router: { origin: false },
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    eas: { projectId: process.env.EAS_PROJECT_ID || '' },
  },
})
