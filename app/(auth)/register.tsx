import { View, Text, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '@/service/authService';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirm) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Use at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await registerUser(fullName.trim(), email.trim(), password);
      router.replace('/home');
    } catch (e: any) {
      Alert.alert('Registration failed', e.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-paper p-6">
      <View className="w-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <Text className="text-3xl font-bold mb-1 text-center text-ink">Create Account</Text>
        <Text className="text-center text-teal mb-6">Start journaling your trips.</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          className="border border-gray-200 bg-gray-50 p-3 mb-4 rounded-xl text-ink"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-gray-200 bg-gray-50 p-3 mb-4 rounded-xl text-ink"
          value={email}
          onChangeText={setEmail}
        />

        <View className="relative justify-center mb-4">
          <TextInput
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            className="border border-gray-200 bg-gray-50 p-3 pr-12 rounded-xl text-ink"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            className="absolute right-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View className="relative justify-center mb-4">
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirm}
            className="border border-gray-200 bg-gray-50 p-3 pr-12 rounded-xl text-ink"
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Pressable className="bg-ink px-6 py-3 rounded-2xl" onPress={handleRegister} disabled={submitting}>
          <Text className="text-white text-lg text-center font-semibold">
            {submitting ? 'Creating account...' : 'Register'}
          </Text>
        </Pressable>
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-500">Already registered? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-stamp font-semibold">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}