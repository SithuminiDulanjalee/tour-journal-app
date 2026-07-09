export interface WeatherResult {
  temp: number;
  condition: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather for this location.');
  const data = await res.json();
  return { temp: Math.round(data.main.temp), condition: data.weather[0].main };
}