import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const tabs = [
  { name: 'home', title: 'Trips', icon: 'menu-book' },
  { name: 'map', title: 'Map', icon: 'map' },
  { name: 'profile', title: 'Profile', icon: 'person' },
] as const;

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C8862A',
        tabBarInactiveTintColor: '#9AA2AD',
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}