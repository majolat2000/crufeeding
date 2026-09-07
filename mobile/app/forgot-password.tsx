import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { colors, radius } from '../src/theme/theme';

export function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, verifyOtp, resetPassword, loading } = useAuthStore();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devCode, setDevCode] = useState('');

  const handleSendOtp = async () => {
    if (!email) return Alert.alert('Error', 'Enter your email');
    try {
      const code = await forgotPassword(email.trim());
      setDevCode(code);
      Alert.alert('OTP Sent', code ? `Code: ${code}` : 'Check your email for the OTP');
      setStep('otp');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return Alert.alert('Error', 'Enter the OTP code');
    try {
      const token = await verifyOtp(email.trim(), otpCode);
      setResetToken(token);
      setStep('reset');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    try {
      await resetPassword(resetToken, newPassword);
      Alert.alert('Success', 'Password reset! You can now sign in.', [{ text: 'OK', onPress: () => router.replace('/login') }]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' }}>
          {step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Verify OTP' : 'New Password'}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 32 }}>
          {step === 'email' ? 'Enter your email to receive an OTP' : step === 'otp' ? `Code sent to ${email}` : 'Enter your new password'}
        </Text>

        {step === 'email' && (
          <>
            <TextInput value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }} />
            <TouchableOpacity onPress={handleSendOtp} disabled={loading} activeOpacity={0.85} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 20, opacity: loading ? 0.5 : 1 }}>
              <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Send OTP</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'otp' && (
          <>
            <TextInput value={otpCode} onChangeText={setOtpCode} placeholder="6-digit code" placeholderTextColor={colors.textMuted} keyboardType="number-pad" maxLength={6} style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15, textAlign: 'center', letterSpacing: 8 }} />
            <TouchableOpacity onPress={handleVerifyOtp} disabled={loading} activeOpacity={0.85} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 20, opacity: loading ? 0.5 : 1 }}>
              <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Verify Code</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'reset' && (
          <>
            <TextInput value={newPassword} onChangeText={setNewPassword} placeholder="New password (min 6 chars)" placeholderTextColor={colors.textMuted} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }} />
            <TouchableOpacity onPress={handleResetPassword} disabled={loading} activeOpacity={0.85} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 20, opacity: loading ? 0.5 : 1 }}>
              <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Reset Password</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.back()} style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Back to <Text style={{ color: colors.gold, fontWeight: '700' }}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ForgotPasswordScreen;
