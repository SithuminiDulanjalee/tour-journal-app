import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#FBF7EF' } }}>
      <Stack.Screen name="index" options={{ title: 'My Trips' }} />
      <Stack.Screen name="add" options={{ title: 'Trip Entry' }} />
      <Stack.Screen name="[id]" options={{ title: 'Trip Details' }} />
    </Stack>
  );
}