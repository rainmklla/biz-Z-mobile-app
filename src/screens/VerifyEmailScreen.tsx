import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Action, Brand, Zee } from '../ui/BizUI';
import { colors, ui } from '../ui/theme';

type VerifyEmailScreenProps = {
  email: string;
  onResend: () => Promise<void>;
  onCheck: () => Promise<boolean>;
  onSignOut: () => void;
};

export default function VerifyEmailScreen({
  email,
  onResend,
  onCheck,
  onSignOut,
}: VerifyEmailScreenProps) {
  const [busy, setBusy] = useState<'resend' | 'check' | null>(null);
  const [message, setMessage] = useState('');

  async function checkVerification() {
    if (busy) return;
    setBusy('check');
    setMessage('');
    try {
      const verified = await onCheck();
      if (!verified) {
        setMessage('Your email is not verified yet. Open the link in your email, then check again.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to check your email. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  async function resendVerification() {
    if (busy) return;
    setBusy('resend');
    setMessage('');
    try {
      await onResend();
      setMessage('Verification email sent. Check your inbox and spam folder.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send the email. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.brand}><Brand /></View>
      <View style={styles.card}>
        <View style={styles.mascot}><Zee size={76} /></View>
        <Text style={ui.eyebrow}>ONE QUICK CHECK</Text>
        <Text style={ui.title}>Verify your email</Text>
        <Text style={ui.body}>
          Verify <Text style={styles.email}>{email}</Text> before setting up your profile.
          Open the link in your verification email. If you don’t see one, you can resend it below.
        </Text>
        {!!message && <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>}
        <Action
          title="I’ve verified my email"
          icon="checkmark"
          onPress={() => { void checkVerification(); }}
          loading={busy === 'check'}
          disabled={busy !== null}
        />
        <Action
          title="Resend verification email"
          variant="secondary"
          onPress={() => { void resendVerification(); }}
          loading={busy === 'resend'}
          disabled={busy !== null}
        />
        <Action title="Use a different account" variant="quiet" onPress={onSignOut} disabled={busy !== null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22, paddingTop: 18, backgroundColor: colors.background },
  brand: { marginBottom: 28 },
  card: { gap: 16, padding: 22, borderRadius: 24, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.surface },
  mascot: { alignItems: 'center', marginBottom: 2 },
  email: { color: colors.ink, fontWeight: '700' },
  message: { ...ui.small, color: colors.purple },
});
