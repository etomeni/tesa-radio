import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'tesa-radio',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  bundledWebRuntime: false
};

export default config;
