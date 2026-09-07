import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { colors, radius } from '../../src/theme/theme';

const LEVELS = ['JUPEB', '100 LEVEL', '200 LEVEL', '300 LEVEL', '500 LEVEL', 'Visitor'];

export function SignupScreen() {
  const router = useRouter();
  const { signup, loading } = useAuthStore();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [level, setLevel] = useState('300 LEVEL');
  const [mealBreakfast, setMealBreakfast] = useState(false);
  const [mealLunch, setMealLunch] = useState(true);
  const [mealDinner, setMealDinner] = useState(false);

  const handleSignup = async () => {
    if (!fullname || !email || !password) return Alert.alert('Error', 'Name, email and password required');
    try {
      await signup({ fullname, email: email.trim(), password, matricNo: matricNo || undefined, level, mealBreakfast, mealLunch, mealDinner });
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Signup Failed', e.message);
    }
  };

  const ToggleMeal = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) => (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        flex: 1, paddingVertical: 10, borderRadius: radius.sm, alignItems: 'center',
        backgroundColor: value ? colors.goldGlow : colors.surfaceOverlay,
        borderWidth: 1, borderColor: value ? colors.gold : colors.borderSubtle,
      }}
    >
      <Text style={{ color: value ? colors.goldText : colors.textMuted, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' }}>Create Account</Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 4 }}>Join Crawford Feeding Platform</Text>

        <View style={{ marginTop: 32 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Full Name</Text>
          <TextInput value={fullname} onChangeText={setFullname} placeholder="Enter your full name" placeholderTextColor={colors.textMuted} style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="your.email@crawford.edu.ng" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} placeholder="Min 6 characters" placeholderTextColor={colors.textMuted} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Matric Number (optional)</Text>
          <TextInput value={matricNo} onChangeText={setMatricNo} placeholder="CRU*******" placeholderTextColor={colors.textMuted} autoCapitalize="characters" style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Meal Plan</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ToggleMeal label="Breakfast" value={mealBreakfast} onToggle={() => setMealBreakfast(!mealBreakfast)} />
            <ToggleMeal label="Lunch" value={mealLunch} onToggle={() => setMealLunch(!mealLunch)} />
            <ToggleMeal label="Dinner" value={mealDinner} onToggle={() => setMealDinner(!mealDinner)} />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.85}
          style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 24, opacity: loading ? 0.5 : 1 }}
        >
          <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Already have an account? <Text style={{ color: colors.gold, fontWeight: '700' }}>Sign In</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignupScreen;
