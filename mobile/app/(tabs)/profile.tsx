import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { colors, radius } from '../../src/theme/theme';
import { FlashyCard } from '../../src/components/FlashyCard';
import { GoldButton } from '../../src/components/GoldButton';
import { StatusBadge } from '../../src/components/StatusBadge';
import { api } from '../../src/api/client';

const Field = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</Text>
    <View style={{ backgroundColor: colors.surfaceOverlay, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: colors.borderSubtle }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{value}</Text>
    </View>
  </View>
);

export function ProfileScreen() {
  const { user, logout, changePassword, setPin, toggleBiometric } = useAuthStore();
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinPw, setPinPw] = useState('');

  // PIN Reset states
  const [showPinReset, setShowPinReset] = useState(false);
  const [pinResetStep, setPinResetStep] = useState<'email' | 'otp' | 'newpin'>('email');
  const [pinResetEmail, setPinResetEmail] = useState('');
  const [pinResetOtp, setPinResetOtp] = useState('');
  const [pinResetToken, setPinResetToken] = useState('');
  const [pinResetNewPin, setPinResetNewPin] = useState('');

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) return Alert.alert('Error', 'Fill in all fields');
    if (newPw !== confirmPw) return Alert.alert('Error', 'New passwords do not match');
    if (newPw.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    try {
      await changePassword(currentPw, newPw);
      Alert.alert('Success', 'Password changed');
      setShowChangePw(false);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleSetPin = async () => {
    if (!pinCode || !pinPw) return Alert.alert('Error', 'Enter PIN and current password');
    try {
      await setPin(pinCode, pinPw);
      Alert.alert('Success', 'Transaction PIN set');
      setShowPinSetup(false);
      setPinCode('');
      setPinPw('');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handlePinResetSendOtp = async () => {
    if (!pinResetEmail) return Alert.alert('Error', 'Enter your email');
    try {
      const { data } = await api.post('/auth/forgot-pin', { email: pinResetEmail.trim() });
      Alert.alert('OTP Sent', data.data?.code ? `Code: ${data.data.code}` : 'Check your email for the OTP');
      setPinResetStep('otp');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handlePinResetVerifyOtp = async () => {
    if (!pinResetOtp) return Alert.alert('Error', 'Enter the OTP code');
    try {
      const { data } = await api.post('/auth/verify-pin-otp', { email: pinResetEmail.trim(), code: pinResetOtp });
      setPinResetToken(data.data.resetToken);
      setPinResetStep('newpin');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handlePinResetSubmit = async () => {
    if (!pinResetNewPin) return Alert.alert('Error', 'Enter a new PIN');
    if (!/^\d{4,6}$/.test(pinResetNewPin)) return Alert.alert('Error', 'PIN must be 4-6 digits');
    try {
      await api.post('/auth/reset-pin', { resetToken: pinResetToken, newPin: pinResetNewPin });
      Alert.alert('Success', 'PIN reset successfully');
      setShowPinReset(false);
      setPinResetStep('email');
      setPinResetEmail('');
      setPinResetOtp('');
      setPinResetNewPin('');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const resetPinFlow = () => {
    setShowPinReset(!showPinReset);
    setPinResetStep('email');
    setPinResetEmail('');
    setPinResetOtp('');
    setPinResetNewPin('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.surface, fontWeight: '900', fontSize: 22 }}>CU</Text>
          </View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 12 }}>Crawford University</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 4 }}>{user?.fullname || 'Student'}</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{user?.matricNo || user?.level || 'N/A'} {user?.hostel ? `\u2014 ${user.hostel}` : ''}</Text>
          <StatusBadge label={user?.role === 'subscriber' ? 'Subscriber' : 'Student'} variant="success" />
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Field label="Email" value={user?.email || ''} />
          <Field label="Level" value={user?.level || 'N/A'} />
          <Field label="Matric No" value={user?.matricNo || 'N/A'} />

          <FlashyCard style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.goldText, textTransform: 'uppercase', letterSpacing: 1 }}>Meal Plan</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {user?.mealBreakfast && <StatusBadge label="Breakfast" variant="warning" />}
              {user?.mealLunch && <StatusBadge label="Lunch" variant="warning" />}
              {user?.mealDinner && <StatusBadge label="Dinner" variant="warning" />}
              {!user?.mealBreakfast && !user?.mealLunch && !user?.mealDinner && (
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>No active meal plan</Text>
              )}
            </View>
          </FlashyCard>

          {/* Change Password */}
          <TouchableOpacity onPress={() => setShowChangePw(!showChangePw)} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '700' }}>{showChangePw ? 'Cancel' : 'Change Password'}</Text>
          </TouchableOpacity>
          {showChangePw && (
            <View style={{ marginTop: 8 }}>
              <TextInput value={currentPw} onChangeText={setCurrentPw} placeholder="Current password" placeholderTextColor={colors.textMuted} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8 }} />
              <TextInput value={newPw} onChangeText={setNewPw} placeholder="New password" placeholderTextColor={colors.textMuted} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8 }} />
              <TextInput value={confirmPw} onChangeText={setConfirmPw} placeholder="Confirm new password" placeholderTextColor={colors.textMuted} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8 }} />
              <GoldButton title="Update Password" onPress={handleChangePassword} />
            </View>
          )}

          {/* Set Transaction PIN */}
          <TouchableOpacity onPress={() => setShowPinSetup(!showPinSetup)} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '700' }}>{showPinSetup ? 'Cancel' : 'Set Transaction PIN'}</Text>
          </TouchableOpacity>
          {showPinSetup && (
            <View style={{ marginTop: 8 }}>
              <TextInput value={pinCode} onChangeText={setPinCode} placeholder="4-6 digit PIN" placeholderTextColor={colors.textMuted} keyboardType="number-pad" maxLength={6} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8 }} />
              <TextInput value={pinPw} onChangeText={setPinPw} placeholder="Current password to confirm" placeholderTextColor={colors.textMuted} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8 }} />
              <GoldButton title="Set PIN" onPress={handleSetPin} />
            </View>
          )}

          {/* Reset PIN via OTP */}
          <TouchableOpacity onPress={resetPinFlow} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '700' }}>{showPinReset ? 'Cancel' : 'Reset PIN'}</Text>
          </TouchableOpacity>
          {showPinReset && (
            <View style={{ marginTop: 8 }}>
              {pinResetStep === 'email' && (
                <>
                  <TextInput value={pinResetEmail} onChangeText={setPinResetEmail} placeholder="Enter your email" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8 }} />
                  <GoldButton title="Send OTP" onPress={handlePinResetSendOtp} />
                </>
              )}
              {pinResetStep === 'otp' && (
                <>
                  <TextInput value={pinResetOtp} onChangeText={setPinResetOtp} placeholder="6-digit OTP" placeholderTextColor={colors.textMuted} keyboardType="number-pad" maxLength={6} style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8, textAlign: 'center', letterSpacing: 4 }} />
                  <GoldButton title="Verify OTP" onPress={handlePinResetVerifyOtp} />
                </>
              )}
              {pinResetStep === 'newpin' && (
                <>
                  <TextInput value={pinResetNewPin} onChangeText={setPinResetNewPin} placeholder="New 4-6 digit PIN" placeholderTextColor={colors.textMuted} keyboardType="number-pad" maxLength={6} secureTextEntry style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 8, textAlign: 'center', letterSpacing: 4 }} />
                  <GoldButton title="Set New PIN" onPress={handlePinResetSubmit} />
                </>
              )}
            </View>
          )}

          {/* Biometric Toggle */}
          <TouchableOpacity
            onPress={async () => {
              try {
                await toggleBiometric(!user?.biometricEnabled);
                Alert.alert('Success', `Biometric ${user?.biometricEnabled ? 'disabled' : 'enabled'}`);
              } catch (e: any) {
                Alert.alert('Error', e.message);
              }
            }}
            style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '700' }}>Biometric Login</Text>
            <View style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: user?.biometricEnabled ? colors.emerald : colors.surfaceOverlay, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: user?.biometricEnabled ? colors.emerald : colors.borderSubtle }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', marginLeft: user?.biometricEnabled ? 20 : 0 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 24, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 14 }}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 20 }}>v1.0.0 {'\u00A9'} CRU Feeding</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;
