import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: "ประเสริฐเจริญยนต์",
  slug: "prasert-mobile-app",
  version: "2.2.1",
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
    buildNumber: "3"
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
    cloudinaryUrl: process.env.CLOUDINARY_URL || "https://res.cloudinary.com/dkm0oeset/image/upload/",
    googleCloudDownloadUrl: process.env.GOOGLE_CLOUD_DOWNLOAD_URL || "https://prasert-upload-to-dive.prasertjarernyonte.workers.dev/download",
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gpamonnosfwdoxjvyrcw.supabase.co',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYW1vbm5vc2Z3ZG94anZ5cmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1ODI2MDMsImV4cCI6MjAzODE1ODYwM30.A67aR3z-pq30EhK5g0_nci2kTXbCkHal0YKUfTkV3d0',
  },
  owner: "kimsnow33"
});
