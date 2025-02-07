import * as React from 'react';
import AppStackNavigation from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
import { useFonts } from 'expo-font';
import { SafeAreaView, Text, View } from 'react-native';
import { FilesProvider } from './src/context/FilesComtext';
import { PDFProvider } from './src/context/PDFContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [fontsLoaded] = useFonts({
    'SukhumvitSet-Bold': require('./assets/fonts/SukhumvitSet-Bold.ttf'),
    'SukhumvitSet-Light': require('./assets/fonts/SukhumvitSet-Light.ttf'),
    'SukhumvitSet-Medium': require('./assets/fonts/SukhumvitSet-Medium.ttf'),
    'SukhumvitSet-SemiBold': require('./assets/fonts/SukhumvitSet-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <FilesProvider>
        <PDFProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppStackNavigation />
          </GestureHandlerRootView>
        </PDFProvider>
      </FilesProvider>
    </AuthProvider>
  );
}
