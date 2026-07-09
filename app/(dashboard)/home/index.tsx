import { View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTravel } from '@/hooks/useTravel';
import EntryCard from '@/components/EntryCard';

export default function HomeList() {
  const { user } = useAuth();
  const { entries, loading, error, loadEntries } = useTravel();

  useFocusEffect(
    useCallback(() => {
      if (user) loadEntries(user.uid);
    }, [user])
  );

  return (
    <View className="flex-1 bg-paper">
      {error && (
        <View className="bg-red-50 mx-4 mt-2 p-2 rounded-lg">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      )}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id!}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => user && loadEntries(user.uid)} />}
        renderItem={({ item }) => (
          <EntryCard entry={item} onPress={() => router.push(`/home/${item.id}`)} />
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-20">
              <Text className="text-lg font-bold text-ink">No trips yet</Text>
              <Text className="text-gray-400 mt-1">Tap + to log your first trip</Text>
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