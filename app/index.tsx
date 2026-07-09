import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-paper">
        <ActivityIndicator size="large" color="#C8862A" />
      </View>
    );
  }
  if (user) return <Redirect href="/home" />;
  return <Redirect href="/login" />;
}