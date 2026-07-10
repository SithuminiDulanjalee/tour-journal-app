import { View } from 'react-native';
import { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTravel } from '@/hooks/useTravel';

export default function MapScreen() {
  const { user } = useAuth();
  const { entries, loadEntries } = useTravel();

  useFocusEffect(
    useCallback(() => {
      if (user) loadEntries(user.uid);
    }, [user])
  );

  const valid = entries.filter((e) => e.location?.latitude);
  const initialRegion = valid.length
    ? { latitude: valid[0].location.latitude, longitude: valid[0].location.longitude, latitudeDelta: 3, longitudeDelta: 3 }
    : { latitude: 7.8731, longitude: 80.7718, latitudeDelta: 3, longitudeDelta: 3 };

  return (
    <View className="flex-1">
      <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
        {valid.map((entry) => (
          <Marker key={entry.id} coordinate={{ latitude: entry.location.latitude, longitude: entry.location.longitude }}>
            <Callout onPress={() => router.push(`/home/${entry.id}`)}>
              <View style={{ maxWidth: 180 }}>
                <Text style={{ fontWeight: '700' }}>{entry.title}</Text>
                <Text style={{ fontSize: 12, color: '#C8862A' }}>Tap to view</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}