import { TouchableOpacity, View, Text, Image } from 'react-native';
import { TravelEntry } from '@/types';

export default function EntryCard({ entry, onPress }: { entry: TravelEntry; onPress: () => void }) {
  const dateLabel = new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <TouchableOpacity onPress={onPress} className="flex-row bg-white rounded-xl mb-3 border border-gray-100 overflow-hidden shadow-sm">
      {entry.photos?.[0] ? (
        <Image source={{ uri: entry.photos[0] }} className="w-24 h-28" />
      ) : (
        <View className="w-24 h-28 bg-gray-100 justify-center items-center">
          <Text className="text-gray-400 text-xs">No photo</Text>
        </View>
      )}
      <View className="flex-1 p-3 justify-center">
        <Text className="text-xs text-gray-400">{dateLabel}</Text>
        <Text className="text-base font-bold text-ink" numberOfLines={1}>{entry.title}</Text>
        <Text className="text-sm text-gray-500" numberOfLines={1}>{entry.location?.name}</Text>
        {entry.weather && (
          <Text className="text-xs text-teal font-semibold mt-1">{entry.weather.temp}°C · {entry.weather.condition}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}