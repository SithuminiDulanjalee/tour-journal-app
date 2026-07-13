import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/hooks/useAuth';
import { useTravel } from '@/hooks/useTravel';
import { fetchWeather, WeatherResult } from '@/service/weatherService';
import { uploadPhoto } from '@/service/travelService';
import { TravelEntry } from '@/types';

export default function AddEditEntry() {
  const { user } = useAuth();
  const { entries, addEntry, editEntry } = useTravel();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existingEntry = entries.find((e) => e.id === id);

  const [title, setTitle] = useState(existingEntry?.title ?? '');
  const [description, setDescription] = useState(existingEntry?.description ?? '');
  const [photos, setPhotos] = useState<string[]>(existingEntry?.photos ?? []);
  const [locationName, setLocationName] = useState(existingEntry?.location?.name ?? '');
  const [locationSearch, setLocationSearch] = useState('');
  const [coords, setCoords] = useState(
    existingEntry?.location ? { latitude: existingEntry.location.latitude, longitude: existingEntry.location.longitude } : null
  );
  const [weather, setWeather] = useState<WeatherResult | undefined>(existingEntry?.weather);
  const [date, setDate] = useState(existingEntry?.date ? new Date(existingEntry.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to continue.');
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.6 })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.6,
          allowsMultipleSelection: true,
          selectionLimit: 0,
        });

    if (!result.canceled && result.assets?.length) {
      const newUris = result.assets.map((asset) => asset.uri);
      setPhotos((prev) => [...prev, ...newUris]);
    }
  };

  const removePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const applyLocationAndWeather = async (
    newCoords: { latitude: number; longitude: number },
    name: string
  ) => {
    setCoords(newCoords);
    setLocationName(name);
    try {
      const w = await fetchWeather(newCoords.latitude, newCoords.longitude);
      setWeather(w);
    } catch (e: any) {
      Alert.alert('Weather unavailable', e.message);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location access is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const newCoords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      const places = await Location.reverseGeocodeAsync(newCoords);
      const name = places[0]
        ? `${places[0].city || places[0].subregion || ''}`.trim() || 'Current location'
        : 'Current location';
      await applyLocationAndWeather(newCoords, name);
      setLocationSearch('');
    } catch (e: any) {
      Alert.alert('Location error', e.message);
    } finally {
      setLocating(false);
    }
  };

  const handleSearchLocation = async () => {
    if (!locationSearch.trim()) {
      Alert.alert('Enter a place', 'Type a place name to search for first.');
      return;
    }
    setSearchingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location access is required to search for a place.');
        return;
      }

      const results = await Location.geocodeAsync(locationSearch.trim());
      if (!results.length) {
        Alert.alert('Not found', 'No location found for that search. Try a different name or add more detail (e.g. city, country).');
        return;
      }
      const newCoords = { latitude: results[0].latitude, longitude: results[0].longitude };
      await applyLocationAndWeather(newCoords, locationSearch.trim());
    } catch (e: any) {
      Alert.alert('Search failed', e.message);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !coords || !user) {
      Alert.alert('Missing info', 'Add a title and set a location first.');
      return;
    }
    setSubmitting(true);
    try {
      const uploadedPhotos: string[] = [];
      for (const uri of photos) {
        uploadedPhotos.push(uri.startsWith('http') ? uri : await uploadPhoto(uri));
      }
      const entryData: Omit<TravelEntry, 'id'> = {
        userId: user.uid,
        title: title.trim(),
        description: description.trim(),
        location: { name: locationName || 'Unknown', ...coords },
        date: date.toISOString(),
        photos: uploadedPhotos,
        weather,
      };
      if (existingEntry?.id) await editEntry(existingEntry.id, entryData);
      else await addEntry(entryData);
      router.canGoBack() ? router.back() : router.replace('/home');
    } catch (e: any) {
      Alert.alert('Save failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-paper p-4">
      <Text className="text-xs font-semibold text-gray-500 mt-2 mb-1">Title</Text>
      <TextInput className="bg-white border border-gray-200 rounded-xl p-3" value={title} onChangeText={setTitle} placeholder="e.g. Sigiriya Day Trip" />

      <Text className="text-xs font-semibold text-gray-500 mt-4 mb-1">Description</Text>
      <TextInput
        className="bg-white border border-gray-200 rounded-xl p-3 h-24"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        placeholder="What made this trip memorable?"
      />

      <Text className="text-xs font-semibold text-gray-500 mt-4 mb-1">Date</Text>
      <TouchableOpacity className="border border-stamp rounded-xl p-3 items-center" onPress={() => setShowDatePicker(true)}>
        <Text className="text-stamp font-semibold">{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          maximumDate={new Date()}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(e, selected) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selected) setDate(selected);
          }}
        />
      )}

      <Text className="text-xs font-semibold text-gray-500 mt-4 mb-1">Location</Text>
      
      <View className="flex-row gap-2">
        <TextInput
          className="flex-1 bg-white border border-gray-200 rounded-xl p-3"
          placeholder="Search a place (e.g. Sigiriya, Sri Lanka)"
          value={locationSearch}
          onChangeText={setLocationSearch}
          returnKeyType="search"
          onSubmitEditing={handleSearchLocation}
        />
        <TouchableOpacity
          className="border border-stamp rounded-xl px-4 items-center justify-center"
          onPress={handleSearchLocation}
          disabled={searchingLocation}
        >
          {searchingLocation ? (
            <ActivityIndicator color="#C8862A" />
          ) : (
            <Text className="text-stamp font-semibold">Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center text-gray-400 text-xs my-2">— or —</Text>

      <TouchableOpacity className="border border-stamp rounded-xl p-3 items-center" onPress={handleUseCurrentLocation} disabled={locating}>
        {locating ? <ActivityIndicator color="#C8862A" /> : <Text className="text-stamp font-semibold">Use current location</Text>}
      </TouchableOpacity>

      {coords && (
        <Text className="text-xs text-gray-500 mt-2">
          📍 {locationName} ({coords.latitude.toFixed(3)}, {coords.longitude.toFixed(3)})
        </Text>
      )}
      {weather && <Text className="text-xs text-teal font-semibold mt-1">{weather.temp}°C, {weather.condition}</Text>}

      <Text className="text-xs font-semibold text-gray-500 mt-4 mb-1">Photos</Text>
      <View className="flex-row flex-wrap gap-3">
        {photos.map((uri) => (
          <View key={uri} className="relative">
            <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
            <TouchableOpacity
              onPress={() => removePhoto(uri)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-white text-xs font-bold">✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {photos.length > 0 && (
        <Text className="text-xs text-gray-400 mt-1">Tap the ✕ on a photo to remove it.</Text>
      )}

      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity className="flex-1 border border-stamp rounded-xl p-3 items-center" onPress={() => handlePickImage(true)}>
          <Text className="text-stamp font-semibold">Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-stamp rounded-xl p-3 items-center" onPress={() => handlePickImage(false)}>
          <Text className="text-stamp font-semibold">Gallery (multi-select)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="bg-ink rounded-xl p-4 items-center mt-6 mb-10" onPress={handleSubmit} disabled={submitting}>
        <Text className="text-white font-semibold text-base">{submitting ? 'Saving...' : existingEntry ? 'Update Trip' : 'Save Trip'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}