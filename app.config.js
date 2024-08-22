import 'dotenv/config';
import { version } from './package.json';

export default ({ config }) => {
  const getEnvVar = (key, defaultValue) => process.env[key] || defaultValue;

  return {
    ...config,
    name: "ประเสริฐเจริญยนต์",
    slug: "prasert-mobile-app",
    version,
    orientation: "portrait",
    icon: "./assets/appLogo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/appLogo.png",
      resizeMode: "contain",
      backgroundColor: "#0C1E2A"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kimsnow33.prasertmobileapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/appLogo.png",
        backgroundColor: "#0C1E2A"
      },
      package: "com.kimsnow33.prasertmobileapp",
      permissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/appLogo.png"
    },
    extra: {
      eas: {
        projectId: "500f1a50-0248-4356-a617-5d9117617500"
      },
      cloudinaryUrl: getEnvVar('CLOUDINARY_URL', "https://res.cloudinary.com/dkm0oeset/image/upload/"),
      googleCloudDownloadUrl: getEnvVar('GOOGLE_CLOUD_DOWNLOAD_URL', "https://prasert-upload-to-dive.prasertjarernyonte.workers.dev/download"),
      supabaseUrl: getEnvVar('EXPO_PUBLIC_SUPABASE_URL', 'https://gpamonnosfwdoxjvyrcw.supabase.co'),
      supabaseAnonKey: getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYW1vbm5vc2Z3ZG94anZ5cmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1ODI2MDMsImV4cCI6MjAzODE1ODYwM30.A67aR3z-pq30EhK5g0_nci2kTXbCkHal0YKUfTkV3d0'),
    },
    owner: "kimsnow33"
  };
};
