import { View } from 'react-native';
import { Slot } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import '../global.css';
import { LoaderProvider } from '@/context/LoaderContext';
import { AuthProvider } from '@/context/AuthContext';
import { TravelProvider } from '@/context/TravelContext';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <LoaderProvider>
      <AuthProvider>
        <TravelProvider>
          <View style={{ marginTop: insets.top, flex: 1 }}>
            <Slot />
          </View>
        </TravelProvider>
      </AuthProvider>
    </LoaderProvider>
  );
}