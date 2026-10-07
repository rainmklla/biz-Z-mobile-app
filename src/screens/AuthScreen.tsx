import React, { useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { requestPasswordReset } from '../services/passwordResetService';
import { Action, Zee } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

type AuthScreenProps = {
  registering: boolean;
  email: string;
  password: string;
  busy: boolean;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
};

export default function AuthScreen({
  registering,
  email,
  password,
  busy,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onToggleMode,
}: AuthScreenProps) {
  const [sendingReset, setSendingReset] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const resetInProgress = useRef(false);
  const disabled = busy || sendingReset;

  async function forgotPassword() {
    if (busy || resetInProgress.current) {
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        'Enter your email',
        'Enter your account email in the Email field, then tap Forgot password.',
      );
      return;
    }

    resetInProgress.current = true;
    setSendingReset(true);

    try {
      await requestPasswordReset(email);

      Alert.alert(
        'Check your email',
        'If an account exists for this address, you’ll receive a password-reset link. Check your spam folder too. Open the link on the Android device where this app is installed.',
      );
    } catch (error) {
      Alert.alert(
        'Unable to send reset email',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      resetInProgress.current = false;
      setSendingReset(false);
    }
  }

  return (
    <View>
      <View style={{ alignItems: 'center', marginBottom: 20 }}><Zee size={90} /></View>
      <Text style={styles.title}>
        {registering ? 'Create an account' : 'Welcome back'}
      </Text>

      <Text style={styles.subtitle}>
        {registering
          ? 'Big ideas start with a small hello.'
          : 'Your next little step is waiting for you.'}
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[ui.input, { marginBottom: 20 }]}
        accessibilityLabel="Email"
        placeholder="Your email address"
        placeholderTextColor="#77857d"
        value={email}
        onChangeText={onChangeEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordField}>
        <TextInput
          style={styles.passwordInput}
          accessibilityLabel="Password"
          placeholder="Your password"
          placeholderTextColor="#77857d"
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={() => setPasswordVisible(visible => !visible)}
          hitSlop={8}
          style={({ pressed }) => [styles.passwordVisibilityButton, pressed && styles.dimmed]}
        >
          <Ionicons
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.muted}
          />
        </Pressable>
      </View>

      {!registering && (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          onPress={forgotPassword}
          disabled={disabled}
          style={({ pressed }) => [
            styles.forgotButton,
            (pressed || disabled) && styles.dimmed,
          ]}
        >
          <Text style={styles.forgotText}>
            {sendingReset ? 'Sending reset email…' : 'Forgot password?'}
          </Text>
        </Pressable>
      )}

      <Action
        title={
          busy
            ? 'Please wait…'
            : registering
              ? 'Create account'
              : 'Log in'
        }
        onPress={onSubmit}
        disabled={disabled}
      />

      <View style={styles.space} />

      <Action
        title={
          registering
            ? 'Already have an account? Log in'
            : 'New here? Create an account'
        }
        onPress={onToggleMode}
        disabled={disabled}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#596c62',
    marginBottom: 24,
  },
  label: {
    color: '#18382c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    marginBottom: 16,
    fontSize: 16,
    color: '#222222',
  },
  passwordField: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 10,
    marginBottom: 20,
    backgroundColor: colors.surface,
  },
  passwordInput: {
    flex: 1,
    minHeight: 50,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.ink,
  },
  passwordVisibilityButton: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.purple,
  },
  dimmed: {
    opacity: 0.5,
  },
  space: {
    height: 16,
  },
});
