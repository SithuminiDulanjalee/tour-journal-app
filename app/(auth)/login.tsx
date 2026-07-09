import { View, Text, TextInput, Pressable, Alert, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { login } from '@/service/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace('/home');
    } catch (e: any) {
      Alert.alert('Login failed', e.message ?? 'Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-center items-center bg-paper p-6">
        <View className="w-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <Text className="text-3xl font-bold mb-1 text-center text-ink">VoyaLink</Text>
          <Text className="text-center text-teal mb-6">Every trip, kept.</Text>
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            className="border border-gray-200 bg-gray-50 p-3 mb-4 rounded-xl"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="border border-gray-200 bg-gray-50 p-3 mb-4 rounded-xl"
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            className="bg-ink px-6 py-3 rounded-2xl"
            onPress={handleLogin}
            disabled={submitting}
          >
            <Text className="text-white text-lg text-center font-semibold">
              {submitting ? 'Logging in...' : 'Log In'}
            </Text>
          </Pressable>
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">New here? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-stamp font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}