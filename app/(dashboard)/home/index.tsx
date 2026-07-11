import { View, FlatList, Text, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '@/hooks/useAuth';
import { useTravel } from '@/hooks/useTravel';
import EntryCard from '@/components/EntryCard';

export default function HomeList() {
  const { user } = useAuth();
  const { entries, loading, error, loadEntries } = useTravel();

  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (user) loadEntries(user.uid);
    }, [user])
  );

  const filteredTrips = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return entries;

    return entries.filter((trip) => {
      return (
        trip.title.toLowerCase().includes(keyword) ||
        trip.location.name.toLowerCase().includes(keyword) ||
        trip.description.toLowerCase().includes(keyword)
      );
    });
  }, [entries, search]);

  return (
    <View className="flex-1 bg-paper">

      {/* Search Bar */}

      <View className="px-4 pt-4 pb-2">
        <View className="bg-white rounded-2xl flex-row items-center px-4 border border-gray-200">

          <MaterialIcons
            name="search"
            size={22}
            color="#999"
          />

          <TextInput
            placeholder="Search trips..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            className="flex-1 py-3 ml-2 text-base"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons
                name="close"
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          )}

        </View>
      </View>

      {error && (
        <View className="bg-red-50 mx-4 mt-2 p-2 rounded-lg">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id!}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => user && loadEntries(user.uid)}
          />
        }
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => router.push(`/home/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-20">
              <Text className="text-lg font-bold text-ink">
                No matching trips
              </Text>

              <Text className="text-gray-400 mt-2">
                Try another search.
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
      />

      <TouchableOpacity
        onPress={() => router.push('/home/add')}
        className="absolute right-5 bottom-6 w-14 h-14 rounded-full bg-ink justify-center items-center shadow-lg"
      >
        <Text className="text-white text-3xl -mt-1">
          +
        </Text>
      </TouchableOpacity>

    </View>
  );
}