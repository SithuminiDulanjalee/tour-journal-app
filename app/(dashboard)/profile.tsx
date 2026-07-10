import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTravel } from '@/hooks/useTravel';
import { logOut } from '@/service/authService';

export default function Profile() {
  const { user } = useAuth();
  const { entries } = useTravel();

  const handleLogout = () => {
    Alert.alert('Log out?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: async () => { await logOut(); router.replace('/login'); } },
    ]);
  };

  return (
    <View className="flex-1 items-center pt-16 bg-white">
      <View className="w-20 h-20 rounded-full bg-ink justify-center items-center mb-4">
        <Text className="text-white text-3xl font-bold">{user?.email?.[0]?.toUpperCase()}</Text>
      </View>
      <Text className="text-lg font-semibold text-ink">{user?.email}</Text>
      <Text className="text-gray-400 mt-1">{entries.length} trips logged</Text>
      <TouchableOpacity className="border border-red-400 rounded-xl px-8 py-3 mt-10" onPress={handleLogout}>
        <Text className="text-red-500 font-semibold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}