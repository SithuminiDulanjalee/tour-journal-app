import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useTravel } from '@/hooks/useTravel';

export default function EntryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, removeEntry } = useTravel();
  const entry = entries.find((e) => e.id === id);

  if (!entry) return <View className="flex-1 items-center justify-center"><Text>Trip not found.</Text></View>;

  const handleDelete = () => {
    Alert.alert('Delete trip?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await removeEntry(entry.id!); router.back(); } },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {entry.photos?.length > 0 && (
        <ScrollView horizontal pagingEnabled>
          {entry.photos.map((uri) => (
            <Image key={uri} source={{ uri }} style={{ width: Dimensions.get('window').width, height: 260 }} />
          ))}
        </ScrollView>
      )}
      <View className="p-5">
        <Text className="text-2xl font-bold text-ink">{entry.title}</Text>
        <Text className="text-gray-500 mt-1">{new Date(entry.date).toDateString()} · {entry.location?.name}</Text>
        {entry.weather && (
          <View className="bg-teal/10 self-start px-3 py-1 rounded-full mt-2">
            <Text className="text-teal font-semibold text-xs">{entry.weather.temp}°C · {entry.weather.condition}</Text>
          </View>
        )}
        {!!entry.description && <Text className="text-gray-700 mt-4 leading-6">{entry.description}</Text>}
        <MapView
          style={{ height: 180, borderRadius: 12, marginTop: 20 }}
          initialRegion={{ latitude: entry.location.latitude, longitude: entry.location.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
        >
          <Marker coordinate={{ latitude: entry.location.latitude, longitude: entry.location.longitude }} title={entry.title} />
        </MapView>
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity className="flex-1 border border-stamp rounded-xl p-3 items-center" onPress={() => router.push(`/home/add?id=${entry.id}`)}>
            <Text className="text-stamp font-semibold">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-red-50 rounded-xl p-3 items-center" onPress={handleDelete}>
            <Text className="text-red-600 font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}