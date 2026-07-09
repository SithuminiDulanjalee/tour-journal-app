export interface TravelEntry {
  id?: string;
  userId: string;
  title: string;
  description: string;
  location: { name: string; latitude: number; longitude: number };
  date: string;
  photos: string[];
  weather?: { temp: number; condition: string };
  createdAt?: any;
  updatedAt?: any;
}