import { View, FlatList, Text, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
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

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location?.name?.toLowerCase().includes(q)
    );
  }, [entries, search]);

  return (
    <View className="flex-1 bg-paper">
      <View className="px-4 pt-3 pb-1">
        <TextInput
          className="bg-white border border-gray-200 text-ink rounded-xl px-4 py-3"
          placeholder="Search trips by title or place..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {error && (
        <View className="bg-red-50 mx-4 mt-2 p-2 rounded-lg">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id!}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => user && loadEntries(user.uid)} />}
        renderItem={({ item }) => (
          <EntryCard entry={item} onPress={() => router.push(`/home/${item.id}`)} />
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-20">
              {search.trim() ? (
                <>
                  <Text className="text-lg font-bold text-ink">No matching trips</Text>
                  <Text className="text-gray-400 mt-1">Try a different search term</Text>
                </>
              ) : (
                <>
                  <Text className="text-lg font-bold text-ink">No trips yet</Text>
                  <Text className="text-gray-400 mt-1">Tap + to log your first trip</Text>
                </>
              )}
            </View>
          ) : null
        }
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      />

      <TouchableOpacity
        onPress={() => router.push('/home/add')}
        className="absolute right-5 bottom-6 w-14 h-14 rounded-full bg-ink justify-center items-center shadow-lg"
      >
        <Text className="text-white text-3xl -mt-1">+</Text>
      </TouchableOpacity>
    </View>
  );
}