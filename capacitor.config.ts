import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tesamedia.radio',
  appName: 'Tesa Radio',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  bundledWebRuntime: false,

  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false,
      androidScaleType: "CENTER",
      backgroundColor: "#000000"
    },

    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
